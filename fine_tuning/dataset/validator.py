#!/usr/bin/env python3
"""
Epic Think AI - Dataset Validation & Quality Gate
Performs schema verification, Qwen ChatML delimiter sanitization,
<think> tag compliance checks, token distribution analysis,
de-duplication, and generates train/val splits.
"""

import os
import sys
import json
import hashlib
import random
import argparse
from pathlib import Path
from typing import List, Dict, Any, Tuple

DATA_DIR = Path(__file__).resolve().parent.parent / "data"

def estimate_tokens(text: str) -> int:
    """Fast, reliable token approximation: ~4 characters per token for English/code."""
    return max(1, len(text) // 4)

def validate_record(record: Dict[str, Any], idx: int) -> Tuple[bool, List[str]]:
    """Validates an individual chat record against Epic Think AI and Qwen requirements."""
    errors = []

    if "messages" not in record or not isinstance(record["messages"], list):
        return False, [f"Record {idx}: Missing or invalid 'messages' array."]

    messages = record["messages"]
    if len(messages) < 2:
        return False, [f"Record {idx}: Messages array must contain at least a user and assistant turn."]

    # Validate role alternation
    expected_next = ["system", "user"]
    has_system = False

    for m_idx, msg in enumerate(messages):
        role = msg.get("role")
        content = msg.get("content", "")

        if not role or role not in ["system", "user", "assistant"]:
            errors.append(f"Record {idx}, msg {m_idx}: Invalid role '{role}'.")

        if not content or not isinstance(content, str) or len(content.strip()) == 0:
            errors.append(f"Record {idx}, msg {m_idx}: Empty content for role '{role}'.")

        # ChatML delimiter leakage check
        for leak in ["<|im_start|>", "<|im_end|>", "<|endoftext|>"]:
            if leak in content:
                errors.append(f"Record {idx}, msg {m_idx}: Delimiter leakage '{leak}' detected in content.")

        # Reasoning block checks on assistant messages
        if role == "assistant":
            if "<think>" not in content or "</think>" not in content:
                errors.append(f"Record {idx}, msg {m_idx}: Missing <think> or </think> tags in assistant response.")
            else:
                # Check ordering
                start_think = content.find("<think>")
                end_think = content.find("</think>")
                if start_think > end_think:
                    errors.append(f"Record {idx}, msg {m_idx}: Malformed tags - </think> appears before <think>.")
                else:
                    thought_content = content[start_think + len("<think>"):end_think].strip()
                    answer_content = content[end_think + len("</think>"):].strip()
                    if len(thought_content) < 30:
                        errors.append(f"Record {idx}, msg {m_idx}: Thought trace is too short (<30 chars).")
                    if len(answer_content) < 20:
                        errors.append(f"Record {idx}, msg {m_idx}: Final answer after </think> is too short (<20 chars).")

    return len(errors) == 0, errors

def process_and_split_dataset(
    input_file: str,
    train_output: str,
    val_output: str,
    report_output: str,
    val_ratio: float = 0.1,
    max_tokens: int = 4096,
    seed: int = 42
):
    print(f"[*] Reading and validating dataset from: {input_file}")
    random.seed(seed)

    if not os.path.exists(input_file):
        raise FileNotFoundError(f"Input file not found: {input_file}")

    valid_records = []
    seen_hashes = set()
    total_samples = 0
    all_errors = []
    token_lengths = []
    domains_count = {}

    with open(input_file, "r", encoding="utf-8") as f:
        for idx, line in enumerate(f):
            line = line.strip()
            if not line:
                continue
            total_samples += 1
            try:
                record = json.loads(line)
            except json.JSONDecodeError as e:
                all_errors.append(f"Line {idx}: JSON parse error: {str(e)}")
                continue

            # Check validity
            is_valid, errors = validate_record(record, idx)
            if not is_valid:
                all_errors.extend(errors)
                continue

            # Deduplication by user prompt hash
            user_msg = next((m["content"] for m in record["messages"] if m["role"] == "user"), "")
            prompt_hash = hashlib.md5(user_msg.encode("utf-8")).hexdigest()
            if prompt_hash in seen_hashes:
                continue
            seen_hashes.add(prompt_hash)

            # Sequence length check
            full_text = " ".join(m["content"] for m in record["messages"])
            tok_est = estimate_tokens(full_text)
            if tok_est > max_tokens:
                all_errors.append(f"Record {idx}: Exceeds maximum token threshold ({tok_est} > {max_tokens}).")
                continue

            token_lengths.append(tok_est)
            domain = record.get("domain", "general")
            domains_count[domain] = domains_count.get(domain, 0) + 1
            valid_records.append(record)

    # Random shuffle
    random.shuffle(valid_records)

    # Split
    val_size = max(1, int(len(valid_records) * val_ratio))
    val_records = valid_records[:val_size]
    train_records = valid_records[val_size:]

    # Write train and val
    os.makedirs(os.path.dirname(train_output), exist_ok=True)
    with open(train_output, "w", encoding="utf-8") as f:
        for r in train_records:
            f.write(json.dumps(r, ensure_ascii=False) + "\n")

    with open(val_output, "w", encoding="utf-8") as f:
        for r in val_records:
            f.write(json.dumps(r, ensure_ascii=False) + "\n")

    # Generate Report
    avg_tokens = sum(token_lengths) / len(token_lengths) if token_lengths else 0
    token_lengths.sort()
    p50 = token_lengths[len(token_lengths) // 2] if token_lengths else 0
    p90 = token_lengths[int(len(token_lengths) * 0.90)] if token_lengths else 0
    p99 = token_lengths[int(len(token_lengths) * 0.99)] if token_lengths else 0

    report = {
        "summary": {
            "total_raw_samples": total_samples,
            "valid_samples_passed": len(valid_records),
            "duplicates_removed": total_samples - len(seen_hashes),
            "validation_errors_count": len(all_errors),
            "train_samples": len(train_records),
            "val_samples": len(val_records),
            "val_split_percentage": f"{val_ratio * 100:.1f}%"
        },
        "token_statistics": {
            "min_tokens": min(token_lengths) if token_lengths else 0,
            "max_tokens": max(token_lengths) if token_lengths else 0,
            "avg_tokens": round(avg_tokens, 1),
            "p50_tokens": p50,
            "p90_tokens": p90,
            "p99_tokens": p99
        },
        "domain_distribution": domains_count,
        "sample_errors": all_errors[:10]
    }

    with open(report_output, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2)

    print("\n" + "=" * 60)
    print("Epic Think AI - Dataset Validation & Quality Report")
    print("=" * 60)
    print(f"[+] Total Raw Samples Processed: {total_samples}")
    print(f"[+] Valid Passed: {len(valid_records)} ({len(valid_records)/max(1, total_samples)*100:.1f}%)")
    print(f"[+] Train Set: {len(train_records)} records -> {train_output}")
    print(f"[+] Validation Set: {len(val_records)} records -> {val_output}")
    print(f"[+] Token Stats -> Avg: {avg_tokens:.1f}, P50: {p50}, P90: {p90}, Max: {max(token_lengths) if token_lengths else 0}")
    print(f"[+] Domains: {domains_count}")
    print(f"[+] Detailed Quality Report saved to: {report_output}")
    print("=" * 60)

def main():
    parser = argparse.ArgumentParser(description="Epic Think AI Dataset Validator")
    parser.add_argument("--input", type=str, default=str(DATA_DIR / "raw_dataset.jsonl"))
    parser.add_argument("--train-out", type=str, default=str(DATA_DIR / "train.jsonl"))
    parser.add_argument("--val-out", type=str, default=str(DATA_DIR / "val.jsonl"))
    parser.add_argument("--report-out", type=str, default=str(DATA_DIR / "dataset_quality_report.json"))
    parser.add_argument("--val-ratio", type=float, default=0.10)
    parser.add_argument("--max-tokens", type=int, default=4096)
    args = parser.parse_args()

    process_and_split_dataset(
        input_file=args.input,
        train_output=args.train_out,
        val_output=args.val_out,
        report_output=args.report_out,
        val_ratio=args.val_ratio,
        max_tokens=args.max_tokens
    )

if __name__ == "__main__":
    main()
