#!/usr/bin/env python3
"""
Epic Think AI - Synthetic Reasoning Dataset Generator
Generates high-quality CoT instruction datasets tailored for Qwen models.
Supports offline synthetic expansion & online LLM bootstrapping.
"""

import os
import sys
import json
import random
import argparse
from typing import List, Dict, Any
from pathlib import Path

# Try to load pyyaml
try:
    import yaml
except ImportError:
    yaml = None

# Default paths
CONFIG_PATH = Path(__file__).resolve().parent.parent / "config" / "dataset_config.yaml"
SEED_PATH = Path(__file__).resolve().parent / "seed_tasks.json"
OUTPUT_DIR = Path(__file__).resolve().parent.parent / "data"

SYSTEM_PROMPT_DEFAULT = """You are Epic Think AI, an elite reasoning and autonomous agent intelligence.
When presented with complex problems, questions, coding tasks, or tool-use scenarios:
1. First, reason thoroughly inside a <think>...</think> block.
2. In the thinking block: dissect the problem into first principles, consider constraints, explore competing hypotheses, simulate edge cases, identify potential pitfalls, and formulate a clear verification path.
3. If interacting with tools, determine exact required arguments and expected responses.
4. Provide your final, direct, polished answer after the </think> closing tag with pristine clarity and structure."""

def load_system_prompt() -> str:
    if yaml and CONFIG_PATH.exists():
        with open(CONFIG_PATH, "r", encoding="utf-8") as f:
            cfg = yaml.safe_load(f)
            return cfg.get("persona", {}).get("system_prompt", SYSTEM_PROMPT_DEFAULT).strip()
    return SYSTEM_PROMPT_DEFAULT

def load_seed_tasks() -> List[Dict[str, Any]]:
    if not SEED_PATH.exists():
        raise FileNotFoundError(f"Seed file not found at {SEED_PATH}")
    with open(SEED_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

# Offline parametric synthetic variations
VARIATION_TEMPLATES = [
    {
        "domain": "deep_reasoning",
        "title_fmt": "Logical Deduction across {n} Entities with Negation Constraints",
        "generate": lambda idx: {
            "user_prompt": f"Four developers (Alex, Blake, Casey, and Devon) manage four microservices: Auth, Payments, Search, and Analytics. Each service is written in a distinct language: Go, Rust, TypeScript, and Python. Alex does not manage Search. Casey manages the Go service. Devon manages Payments. The Rust service is managed by the person who is not Alex and not Devon. Who manages what?",
            "thought_trace": "1. Problem Deconstruction:\n- Entities: Alex, Blake, Casey, Devon.\n- Services: Auth, Payments, Search, Analytics.\n- Languages: Go, Rust, TypeScript, Python.\n- Clues:\n  C1: Casey manages Go.\n  C2: Devon manages Payments.\n  C3: Alex does not manage Search.\n  C4: Rust is managed by someone who is not Alex and not Devon.\n\n2. Deductive Path:\n- Analyze Language allocation: Who can manage Rust? Options are Alex, Blake, Casey, Devon. Not Alex (C4), not Devon (C4), not Casey (Casey manages Go per C1). Therefore, Blake must manage Rust!\n- Analyze Services: Devon manages Payments (C2). Alex does not manage Search (C3) and cannot manage Payments. What services can Alex manage? Auth or Analytics. If Alex manages Auth, who manages Search? Either Blake or Casey.\n- Analyze Developer-Language mapping: Casey=Go, Blake=Rust. Devon and Alex manage {TypeScript, Python}.\n\n3. Verification:\n- Systematically test assignments against all negative constraints.\n- All assignments form a consistent bijection.",
            "final_response": "Based on the deductive elimination of the negative and positive constraints:\n\n1. **Blake** manages **Rust** (eliminating Alex, Devon, and Casey who has Go).\n2. **Casey** manages **Go** (given).\n3. **Devon** manages **Payments** (given).\n4. **Alex** manages **Auth** or **Analytics** with either **TypeScript** or **Python**.\n\nThis completely satisfies all stated boundary conditions without contradiction."
        }
    },
    {
        "domain": "agentic_coding",
        "title_fmt": "Async Concurrency & Rate Limiting System {n}",
        "generate": lambda idx: {
            "user_prompt": f"Design an asynchronous Leaky Bucket rate limiter in Python for an API gateway supporting {100 * (idx + 1)} req/sec with burst capacity. Explain the mathematical invariants and thread/task safety.",
            "thought_trace": "1. Problem Deconstruction:\n- Objective: Implement Leaky Bucket algorithm in Python `asyncio`.\n- Invariants: Capacity (burst ceiling), leak_rate (continuous output rate), current_water_level.\n- Time calculation: On each incoming request, compute elapsed time since last leak, decrease water level proportionally, then decide admission.\n\n2. Implementation Details:\n- Thread-safe / Coroutine-safe: Guard state with `asyncio.Lock()` to prevent race conditions during high throughput.\n- Edge cases: Water level cannot drop below zero. Excessive requests rejected immediately (HTTP 429 semantics) or awaited.\n\n3. Verification:\n- Test with high concurrent burst of 50 tasks; ensure no over-allocation.",
            "final_response": "Here is an asynchronous Leaky Bucket Rate Limiter implemented with `asyncio`:\n\n```python\nimport time\nimport asyncio\n\nclass AsyncLeakyBucket:\n    def __init__(self, capacity: float, leak_rate: float):\n        self.capacity = capacity          # Maximum burst volume\n        self.leak_rate = leak_rate        # Tokens/units leaked per second\n        self.water_level = 0.0\n        self.last_update = time.monotonic()\n        self._lock = asyncio.Lock()\n\n    async def acquire(self, amount: float = 1.0) -> bool:\n        async with self._lock:\n            now = time.monotonic()\n            elapsed = now - self.last_update\n            self.last_update = now\n            \n            # Leak water proportionally to elapsed time\n            self.water_level = max(0.0, self.water_level - elapsed * self.leak_rate)\n            \n            # Check if adding requested amount exceeds capacity\n            if self.water_level + amount <= self.capacity:\n                self.water_level += amount\n                return True\n            return False\n```\n\n### Mathematical Invariants\n- **Continuous Drain**: $\\text{water}_{t} = \\max(0, \\text{water}_{t_0} - \\Delta t \\cdot r)$\n- **Admission Guarantee**: A request is admitted if and only if $\\text{water}_{t} + c \\le \\text{capacity}$."
        }
    },
    {
        "domain": "tool_orchestration",
        "title_fmt": "Multi-Tool Database & Cache Synchronization {n}",
        "generate": lambda idx: {
            "user_prompt": f"A user asks: 'Invalidate cache key user_session_{idx + 100} in Redis, fetch fresh records from MongoDB for user {idx + 100}, and broadcast an event to Kafka topic user-updates.' Formulate the tool sequence.",
            "thought_trace": "1. Problem Deconstruction:\n- Required Operations in Sequence:\n  1. Invalidate Redis cache (`redis_delete`)\n  2. Query fresh user record from MongoDB (`mongo_find_one`)\n  3. Publish event to Kafka (`kafka_publish`)\n- Check dependencies: Step 3 depends on payload returned by Step 2.\n\n2. Tool Call Generation:\n- Produce structured `<tool_call>` JSON schemas.\n- State clearly the error handling strategy if cache invalidation fails.",
            "final_response": "I will coordinate this state synchronization across Redis, MongoDB, and Kafka:\n\n```json\n<tool_call>\n{\n  \"tool\": \"redis_delete\",\n  \"arguments\": {\n    \"key\": \"user_session_" + str(idx + 100) + "\"\n  }\n}\n</tool_call>\n```\n\nNext, retrieving the authoritative state from MongoDB:\n\n```json\n<tool_call>\n{\n  \"tool\": \"mongo_find_one\",\n  \"arguments\": {\n    \"collection\": \"users\",\n    \"query\": {\"userId\": " + str(idx + 100) + "}\n  }\n}\n</tool_call>\n```\n\nUpon receiving the record payload, I will broadcast to Kafka:\n\n```json\n<tool_call>\n{\n  \"tool\": \"kafka_publish\",\n  \"arguments\": {\n    \"topic\": \"user-updates\",\n    \"key\": \"user_" + str(idx + 100) + "\",\n    \"payload\": {\"status\": \"synchronized\", \"userId\": " + str(idx + 100) + "}\n  }\n}\n</tool_call>\n```"
        }
    }
]

def generate_synthetic_dataset(num_samples: int = 100) -> List[Dict[str, Any]]:
    system_prompt = load_system_prompt()
    seeds = load_seed_tasks()
    dataset = []

    # 1. Include base seeds first
    for seed in seeds:
        record = {
            "id": seed["id"],
            "domain": seed["domain"],
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": seed["user_prompt"]},
                {"role": "assistant", "content": f"<think>\n{seed['thought_trace']}\n</think>\n{seed['final_response']}"}
            ]
        }
        dataset.append(record)

    # 2. Synthetically expand up to num_samples
    counter = len(dataset)
    while counter < num_samples:
        template = random.choice(VARIATION_TEMPLATES)
        sample_data = template["generate"](counter)
        record = {
            "id": f"epic-synth-{template['domain']}-{counter:04d}",
            "domain": template["domain"],
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": sample_data["user_prompt"]},
                {"role": "assistant", "content": f"<think>\n{sample_data['thought_trace']}\n</think>\n{sample_data['final_response']}"}
            ]
        }
        dataset.append(record)
        counter += 1

    return dataset

def main():
    parser = argparse.ArgumentParser(description="Epic Think AI Dataset Generator")
    parser.add_argument("--samples", type=int, default=150, help="Number of samples to generate")
    parser.add_argument("--output", type=str, default=str(OUTPUT_DIR / "raw_dataset.jsonl"), help="Output JSONL path")
    args = parser.parse_args()

    os.makedirs(OUTPUT_DIR, exist_ok=True)
    print(f"[*] Generating {args.samples} reasoning dataset samples for Epic Think AI...")
    data = generate_synthetic_dataset(args.samples)

    with open(args.output, "w", encoding="utf-8") as f:
        for item in data:
            f.write(json.dumps(item, ensure_ascii=False) + "\n")

    print(f"[+] Dataset successfully generated and written to: {args.output}")
    print(f"[+] Total samples: {len(data)}")

if __name__ == "__main__":
    main()
