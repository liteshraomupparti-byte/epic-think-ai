#!/usr/bin/env python3
"""
==============================================================================
Epic Think AI - Unified Qwen LoRA / QLoRA Fine-Tuning Pipeline CLI
==============================================================================
Orchestrates the entire lifecycle:
1. Environment & CUDA hardware verification
2. Synthetic CoT reasoning dataset generation
3. Strict schema validation, deduplication & train/val split
4. Qwen LoRA / QLoRA training with response-only loss masking
5. Checkpoint management & validation loss curve analysis
6. Perplexity and multi-metric reasoning evaluation
7. Pairwise LLM-as-a-Judge benchmarking
8. Zero-loss adapter fusion into standalone 16-bit weights
9. GGUF quantization export for Ollama & edge serving
10. Production OpenAI-compatible streaming API server
==============================================================================
"""

import os
import sys
import argparse
import subprocess
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

# Automatically use isolated virtual environment python if present
VENV_PYTHON_WIN = BASE_DIR / ".venv" / "Scripts" / "python.exe"
VENV_PYTHON_UNIX = BASE_DIR / ".venv" / "bin" / "python"
if VENV_PYTHON_WIN.exists():
    PYTHON_EXEC = str(VENV_PYTHON_WIN)
elif VENV_PYTHON_UNIX.exists():
    PYTHON_EXEC = str(VENV_PYTHON_UNIX)
else:
    PYTHON_EXEC = sys.executable

def run_step(step_name: str, script_rel_path: str, extra_args: list = None):
    print("\n" + "=" * 75)
    print(f"[*] EXECUTING PIPELINE STAGE: {step_name.upper()}")
    print("=" * 75)
    script_path = BASE_DIR / script_rel_path
    if not script_path.exists():
        print(f"[!] Script not found: {script_path}")
        return False

    cmd = [PYTHON_EXEC, str(script_path)] + (extra_args or [])
    print(f"[*] Command: {' '.join(cmd)}")
    result = subprocess.run(cmd)
    if result.returncode != 0:
        print(f"[!] Error: Stage '{step_name}' exited with code {result.returncode}")
        return False
    print(f"[+] Stage '{step_name}' completed successfully.")
    return True

def main():
    parser = argparse.ArgumentParser(
        description="Epic Think AI - Qwen Fine-Tuning Pipeline CLI",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python run_pipeline.py --all
  python run_pipeline.py --step data-gen --samples 200
  python run_pipeline.py --step validate
  python run_pipeline.py --step train --dry-run
  python run_pipeline.py --step evaluate
  python run_pipeline.py --step merge --dry-run
  python run_pipeline.py --step export-gguf
  python run_pipeline.py --step serve
        """
    )
    parser.add_argument(
        "--step",
        type=str,
        choices=[
            "setup-check",
            "data-gen",
            "validate",
            "train",
            "checkpoints",
            "evaluate",
            "judge",
            "merge",
            "export-gguf",
            "serve"
        ],
        help="Execute an individual pipeline stage"
    )
    parser.add_argument("--all", action="store_true", help="Execute complete end-to-end pipeline")
    parser.add_argument("--samples", type=int, default=100, help="Number of dataset samples to synthesize")
    parser.add_argument("--dry-run", action="store_true", help="Execute training/merging in preflight dry-run mode")
    parser.add_argument("--port", type=int, default=8001, help="Port for the inference server")

    args = parser.parse_args()

    if not args.step and not args.all:
        parser.print_help()
        sys.exit(0)

    # Individual step routing
    if args.step == "setup-check":
        run_step("Hardware & Dependency Setup Check", "setup_env.py")
    elif args.step == "data-gen":
        run_step("Dataset Generation", "dataset/generator.py", ["--samples", str(args.samples)])
    elif args.step == "validate":
        run_step("Dataset Validation & Splitting", "dataset/validator.py")
    elif args.step == "train":
        train_args = ["--dry-run"] if args.dry_run else []
        run_step("Qwen LoRA/QLoRA Training", "training/train_lora.py", train_args)
    elif args.step == "checkpoints":
        run_step("Checkpoint Inspection", "training/checkpoint_manager.py", ["--analyze-logs"])
    elif args.step == "evaluate":
        run_step("Model Evaluation Harness", "evaluation/evaluate.py")
    elif args.step == "judge":
        run_step("LLM-as-a-Judge Benchmarking", "evaluation/judge_eval.py")
    elif args.step == "merge":
        merge_args = ["--dry-run"] if args.dry_run else []
        run_step("Adapter Merging", "deployment/merge_adapter.py", merge_args)
    elif args.step == "export-gguf":
        run_step("GGUF Quantization Export", "deployment/export_gguf.py")
    elif args.step == "serve":
        os.environ["PORT"] = str(args.port)
        run_step("FastAPI Inference Server", "deployment/serve_api.py")

    # End-to-end full execution
    elif args.all:
        print("\n" + "#" * 75)
        print("# STARTING EPIC THINK AI FULL FINE-TUNING PIPELINE RUN")
        print("#" * 75)

        pipeline_steps = [
            ("Hardware & Environment Check", "setup_env.py", []),
            ("Dataset Generation", "dataset/generator.py", ["--samples", str(args.samples)]),
            ("Dataset Validation & Quality Gate", "dataset/validator.py", []),
            ("Qwen LoRA/QLoRA Training (Preflight Dry-run)", "training/train_lora.py", ["--dry-run"]),
            ("Checkpoint Manager Inspection", "training/checkpoint_manager.py", []),
            ("Multi-Metric Evaluation Harness", "evaluation/evaluate.py", ["--simulated"]),
            ("LLM-as-a-Judge Evaluation", "evaluation/judge_eval.py", []),
            ("LoRA Adapter Fusion (Preflight)", "deployment/merge_adapter.py", ["--dry-run"]),
            ("GGUF Packaging & Modelfile", "deployment/export_gguf.py", [])
        ]

        for name, script, extra in pipeline_steps:
            success = run_step(name, script, extra)
            if not success:
                print(f"\n[!] Pipeline stopped at step: {name}")
                sys.exit(1)

        print("\n" + "#" * 75)
        print("# EPIC THINK AI PIPELINE EXECUTION COMPLETE!")
        print("# Ready to deploy via:")
        print("#   1. vLLM: ./fine_tuning/deployment/vllm_serve.bat")
        print("#   2. Ollama: ollama create epic-think-qwen -f ./fine_tuning/deployment/Modelfile")
        print(f"#   3. FastAPI: python fine_tuning/run_pipeline.py --step serve --port {args.port}")
        print("#" * 75)

if __name__ == "__main__":
    main()
