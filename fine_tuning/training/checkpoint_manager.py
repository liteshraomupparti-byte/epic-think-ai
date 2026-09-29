#!/usr/bin/env python3
"""
Epic Think AI - Checkpoint & Model State Manager
Inspects training checkpoints, evaluates learning curves (train vs eval loss),
identifies best performing checkpoint by validation loss, and manages adapter artifacts.
"""

import os
import sys
import json
import argparse
from pathlib import Path
from typing import Dict, Any, List

CHECKPOINTS_DIR = Path(__file__).resolve().parent.parent / "checkpoints" / "epic-think-qwen-lora"

def inspect_checkpoints(ckpt_dir: Path) -> List[Dict[str, Any]]:
    if not ckpt_dir.exists():
        print(f"[-] Checkpoints directory does not exist: {ckpt_dir}")
        return []

    checkpoints = []
    for item in ckpt_dir.iterdir():
        if item.is_dir() and (item.name.startswith("checkpoint-") or item.name == "best_adapter"):
            adapter_config = item / "adapter_config.json"
            adapter_weights = item / "adapter_model.safetensors"
            trainer_state_file = item / "trainer_state.json"
            
            ckpt_info = {
                "name": item.name,
                "path": str(item),
                "has_adapter_config": adapter_config.exists(),
                "has_weights": adapter_weights.exists() or (item / "adapter_model.bin").exists(),
                "is_best": item.name == "best_adapter"
            }

            # Check size
            total_size_mb = sum(f.stat().st_size for f in item.glob("**/*") if f.is_file()) / (1024 * 1024)
            ckpt_info["size_mb"] = round(total_size_mb, 2)
            checkpoints.append(ckpt_info)

    return sorted(checkpoints, key=lambda x: x["name"])

def parse_trainer_state(ckpt_dir: Path):
    state_file = ckpt_dir / "trainer_state.json"
    if not state_file.exists():
        # Check subdirectories
        for sub in ckpt_dir.glob("checkpoint-*/trainer_state.json"):
            state_file = sub
            break

    if not state_file.exists():
        print("[-] trainer_state.json not found in checkpoints folder.")
        return

    with open(state_file, "r", encoding="utf-8") as f:
        state = json.load(f)

    log_history = state.get("log_history", [])
    print(f"\n[*] Training Log History ({len(log_history)} entries):")
    print("-" * 65)
    print(f"{'Step':<10} | {'Epoch':<10} | {'Train Loss':<15} | {'Eval Loss':<15}")
    print("-" * 65)

    best_eval_loss = float("inf")
    best_step = None

    for entry in log_history:
        step = entry.get("step", "-")
        epoch = round(entry.get("epoch", 0), 2)
        train_loss = round(entry.get("loss", 0), 4) if "loss" in entry else "-"
        eval_loss = round(entry.get("eval_loss", 0), 4) if "eval_loss" in entry else "-"

        if "eval_loss" in entry and entry["eval_loss"] < best_eval_loss:
            best_eval_loss = entry["eval_loss"]
            best_step = step

        print(f"{step:<10} | {epoch:<10} | {str(train_loss):<15} | {str(eval_loss):<15}")

    print("-" * 65)
    if best_step is not None:
        print(f"[+] Optimal Checkpoint: Step {best_step} with Eval Loss = {best_eval_loss:.4f}")
    print(f"[+] Total Flops: {state.get('total_flos', 'N/A')}")

def main():
    parser = argparse.ArgumentParser(description="Epic Think AI Checkpoint Manager")
    parser.add_argument("--dir", type=str, default=str(CHECKPOINTS_DIR), help="Path to checkpoints folder")
    parser.add_argument("--analyze-logs", action="store_true", help="Print training and evaluation loss history")
    args = parser.parse_args()

    ckpt_path = Path(args.dir)
    print("=" * 65)
    print("Epic Think AI - Checkpoint & Adapter Inspector")
    print("=" * 65)
    print(f"[*] Target Directory: {ckpt_path}")

    ckpts = inspect_checkpoints(ckpt_path)
    if ckpts:
        print(f"[+] Discovered {len(ckpts)} checkpoint artifact(s):")
        for c in ckpts:
            status = "READY" if c["has_adapter_config"] and c["has_weights"] else "INCOMPLETE"
            print(f"    - {c['name']:<20} | Size: {c['size_mb']:>6.1f} MB | Status: {status}")
    else:
        print("[!] No checkpoints generated yet. Run training first.")

    if args.analyze_logs:
        parse_trainer_state(ckpt_path)

if __name__ == "__main__":
    main()
