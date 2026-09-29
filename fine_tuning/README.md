# Epic Think AI — Qwen LoRA / QLoRA Fine-Tuning Pipeline

A complete, production-grade fine-tuning and deployment pipeline tailored for **Epic Think AI** using foundation models from the **Qwen 2.5** family (`Qwen2.5-7B`, `14B`, `32B`, `Coder`, `Math`).

This pipeline equips Qwen with elite, structured Chain-of-Thought (CoT) reasoning inside `<think> ... </think>` tags, systematic hypothesis verification, autonomous tool calling, and multi-turn conversational robustness.

---

## Architecture Overview

```
                                  +------------------------------+
                                  |   Seed Tasks & Domain Mix    |
                                  +--------------+---------------+
                                                 |
                                                 v
                                  +------------------------------+
                                  |   1. Dataset Generation      |  <-- synthetic CoT generation
                                  |     (dataset/generator.py)   |
                                  +--------------+---------------+
                                                 |
                                                 v
                                  +------------------------------+
                                  | 2. Quality Gate & Validation |  <-- ChatML check, tag check,
                                  |     (dataset/validator.py)   |      token lengths, dedup
                                  +--------------+---------------+
                                                 |
                                                 v
                                  +------------------------------+
                                  |  3. QLoRA / LoRA Training    |  <-- 4-bit NF4, All-Linear LoRA,
                                  |    (training/train_lora.py)  |      Response-only loss masking
                                  +--------------+---------------+
                                                 |
                                                 v
                                  +------------------------------+
                                  | 4. Checkpoints & Loss Curves |  <-- best_adapter selection,
                                  |  (checkpoint_manager.py)     |      eval loss trajectory
                                  +--------------+---------------+
                                                 |
                                                 v
                                  +------------------------------+
                                  | 5. Evaluation & LLM-as-Judge |  <-- Perplexity, CoT compliance,
                                  |    (evaluation/evaluate.py)  |      tool JSON accuracy, pairwise win-rate
                                  +--------------+---------------+
                                                 |
                                                 v
                                  +------------------------------+
                                  | 6. LoRA Adapter Fusion       |  <-- Standalone 16-bit safetensors
                                  |   (deployment/merge_adapter) |
                                  +--------------+---------------+
                                                 |
                   +-----------------------------+-----------------------------+
                   |                                                           |
                   v                                                           v
    +------------------------------+                            +------------------------------+
    | 7. GGUF Quantization & Edge  |                            | 8. High-Throughput Serving   |
    |  - llama.cpp (Q4_K_M, Q8_0)  |                            |  - vLLM (PagedAttention)     |
    |  - Ollama (Modelfile)        |                            |  - FastAPI (SSE streaming)   |
    +------------------------------+                            +--------------+---------------+
                                                                               |
                                                                               v
                                                                +------------------------------+
                                                                | Epic Think AI Node.js Engine |
                                                                | (EpicThinkLocalProvider.js)  |
                                                                +------------------------------+
```

---

## Directory Structure

```
fine_tuning/
├── config/
│   ├── training_config.yaml       # Hyperparameters, QLoRA 4-bit config, optimizer, learning rate
│   ├── dataset_config.yaml        # System prompt, domain distribution, CoT tags specification
│   └── deployment_config.yaml     # vLLM, GGUF, Ollama Modelfile, and FastAPI server settings
├── dataset/
│   ├── seed_tasks.json            # Curated seed problems across 5 reasoning domains
│   ├── generator.py               # Synthetic CoT dataset generator (offline & online modes)
│   └── validator.py               # Quality gate: ChatML validation, tag matching, dedup, train/val split
├── data/
│   ├── raw_dataset.jsonl          # Raw synthesized reasoning records
│   ├── train.jsonl                # Sanitized training split (90%)
│   ├── val.jsonl                  # Sanitized validation split (10%)
│   └── dataset_quality_report.json# Token distribution and validation audit report
├── training/
│   ├── train_lora.py              # Main training script (SFTTrainer, PEFT, response loss masking)
│   └── checkpoint_manager.py      # Checkpoint loss inspector and best adapter tracker
├── evaluation/
│   ├── evaluate.py                # Validation loss, perplexity, CoT tag compliance, tool JSON check
│   ├── judge_eval.py              # Pairwise LLM-as-a-Judge comparator (Base Qwen vs Fine-tuned)
│   ├── evaluation_report.json     # Quantitative benchmark output
│   └── judge_report.json          # Pairwise win/loss/tie audit
├── deployment/
│   ├── merge_adapter.py           # Merges LoRA adapter into base model weights (16-bit safetensors)
│   ├── export_gguf.py             # Converts to GGUF (Q4_K_M, Q5_K_M, Q8_0) for local / edge deployment
│   ├── Modelfile                  # Production Ollama model manifest
│   ├── vllm_config.yaml           # vLLM configuration with PagedAttention & dynamic LoRA support
│   ├── vllm_serve.bat             # Windows launch script for vLLM
│   └── serve_api.py               # FastAPI OpenAI-compatible server with real-time reasoning SSE streaming
├── requirements.txt               # Pinned dependencies (PyTorch, PEFT, TRL, Transformers, BitsAndBytes)
├── setup_env.py                   # Environment, CUDA, and hardware diagnostic script
├── run_pipeline.py                # Unified one-command CLI orchestrator
└── README.md                      # Comprehensive documentation
```

---

## Hardware & VRAM Requirements

| Model | Technique | Target Precision | Minimum VRAM | Recommended GPU |
| :--- | :--- | :--- | :--- | :--- |
| **Qwen2.5-7B** | 4-bit QLoRA | NF4 + bfloat16 | **8 GB** | RTX 3070 / 4060 / 4070 (8-12 GB) |
| **Qwen2.5-7B** | 16-bit LoRA | bfloat16 | **16 GB** | RTX 4080 / 4090 / A4000 (16-24 GB) |
| **Qwen2.5-14B** | 4-bit QLoRA | NF4 + bfloat16 | **16 GB** | RTX 4090 / RTX 6000 / A5000 (16-24 GB) |
| **Qwen2.5-32B** | 4-bit QLoRA | NF4 + bfloat16 | **24–32 GB** | RTX A6000 / A100 (40-80 GB) |
| **Qwen2.5-72B** | 4-bit QLoRA | NF4 + bfloat16 | **48–60 GB** | 2x RTX 4090 or A100 / H100 (80 GB) |

---

## Quick Start — Master CLI

The pipeline is managed via `run_pipeline.py`:

```bash
# 1. Inspect hardware & environment
python fine_tuning/run_pipeline.py --step setup-check

# 2. Run the entire end-to-end pipeline in one command
python fine_tuning/run_pipeline.py --all

# Or run individual stages:
python fine_tuning/run_pipeline.py --step data-gen --samples 200
python fine_tuning/run_pipeline.py --step validate
python fine_tuning/run_pipeline.py --step train
python fine_tuning/run_pipeline.py --step checkpoints
python fine_tuning/run_pipeline.py --step evaluate
python fine_tuning/run_pipeline.py --step judge
python fine_tuning/run_pipeline.py --step merge
python fine_tuning/run_pipeline.py --step export-gguf
python fine_tuning/run_pipeline.py --step serve --port 8001
```

---

## Step-by-Step Stage Breakdown

### 1. Dataset Generation (`dataset/generator.py`)
- Synthesizes diverse reasoning pairs across 5 core domains:
  1. `deep_reasoning`: Logic grids, deduction trees, counterfactual elimination.
  2. `agentic_coding`: Concurrent architecture, AST analysis, async backpressure.
  3. `tool_orchestration`: Structured JSON tool calling (`<tool_call>...`), parameter schemas.
  4. `math_and_symbolic`: Bayesian derivations, combinatorial proofs, recurrences.
  5. `error_recovery_reflection`: Catching deceptive user assumptions, self-repair.
- Enforces strict `<think> ... </think>` CoT reasoning trace formatting.

### 2. Dataset Validation & Quality Gate (`dataset/validator.py`)
- Validates alternating message turns (`system` -> `user` -> `assistant`).
- Checks for matching, non-empty `<think>` and `</think>` tags with minimum reasoning depth.
- Prevents delimiter leakage (`<|im_start|>`, `<|im_end|>`).
- Computes token percentiles (P50, P90, P99) and flags tokens over maximum context limit (4096).
- Removes exact duplicates and generates stratified `train.jsonl` (90%) and `val.jsonl` (10%).
- Outputs an audit report to `data/dataset_quality_report.json`.

### 3. LoRA / QLoRA Training Engine (`training/train_lora.py`)
- **All-Linear LoRA**: Targets `["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"]` with rank `r=32`, `alpha=64`.
- **4-Bit NF4 Quantization**: `BitsAndBytesConfig` with double quantization and bfloat16 compute.
- **Response-Only Loss Masking**: Leverages `DataCollatorForCompletionOnlyLM` targeting `<|im_start|>assistant\n`. Loss is computed **strictly on reasoning and answer tokens**, protecting foundation knowledge and maximizing instruction alignment.
- **Paged AdamW 8-bit** (`paged_adamw_8bit`): Eliminates CUDA memory fragmentation spikes.
- **Gradient Checkpointing** (`use_reentrant=False`): Drops intermediate activation memory by ~60%.

### 4. Checkpoints & Metrics (`training/checkpoint_manager.py`)
- Tracks step-by-step training and evaluation loss.
- Automatically isolates `best_adapter` based on minimum validation loss.

### 5. Multi-Metric Evaluation (`evaluation/evaluate.py`, `judge_eval.py`)
- **Quantitative**: Computes perplexity ($PPL = \exp(\text{loss})$) on held-out validation data.
- **CoT Compliance**: Evaluates benchmark problems to ensure the model naturally executes `<think>` tags and problem deconstruction before responding.
- **Pairwise Judge**: Compares base model vs fine-tuned model across reasoning depth, factual rigor, and tool schema accuracy.

### 6. Deployment & Serving
- **LoRA Fusion** (`deployment/merge_adapter.py`): Fuses weights back into base model, exporting standalone 16-bit Hugging Face safetensors.
- **GGUF Export** (`deployment/export_gguf.py`): Quantizes into Q4_K_M (~4.5 GB) or Q8_0 (~7.7 GB) for local inference with Ollama or LM Studio.
- **Ollama**: Run `ollama create epic-think-qwen -f deployment/Modelfile`.
- **vLLM**: Production serving on port 8000 with PagedAttention and dynamic LoRA support (`vllm_serve.bat`).
- **FastAPI Microservice** (`deployment/serve_api.py`): OpenAI-compatible API on port 8001 featuring live Server-Sent Events (SSE) streaming with **real-time extraction of `<think>` tokens into `delta.reasoning_content`**!

---

## Integration with Epic Think AI Core

The fine-tuned model is pre-wired into Epic Think AI's Node.js engine:

1. **Provider**: `ai/providers/EpicThinkLocalProvider.js` connects to the local inference API (`http://127.0.0.1:8001/v1` or vLLM `http://127.0.0.1:8000/v1`).
2. **Registry**: Registered in `ai/core/ModelRegistry.js` as `epic-think-qwen2.5-7b` under presets `Epic Think o1` and `Epic Think Local`.
3. **Real-Time Streaming**: Streamed reasoning tokens populate the UI's collapsible thinking panel in real-time.
