# Epic Think AI 🧠⚡

> Autonomous Multi-Provider Agent Intelligence with Hindsight Long-Term Semantic Memory and Local Qwen Reasoning LoRA Fine-Tuning Pipeline.

---

## 🌟 Key Features

- **Deep Reasoning Engine**: Native support for DeepSeek-style and Qwen `<think> ... </think>` Chain-of-Thought (CoT) reasoning blocks.
- **Hindsight Long-Term Memory**: Semantic graph and vector-grounded memory recall across sessions.
- **Multi-Model Orchestration**: Dynamic switching between cloud providers (Gemini, Claude, OpenAI) and local models (Qwen, Ollama, vLLM).
- **Autonomous Tool & Plugin System**: Extensible plugin framework with confirmation-gated execution for terminal, GitHub, and browser actions.
- **End-to-End LoRA Fine-Tuning Pipeline**:
  - Synthetic dataset generation and ChatML validation.
  - 4-bit NormalFloat (NF4) QLoRA training optimized for 8 GB GPUs (NVIDIA RTX 5050 / 4060 / 3060).
  - Multi-metric evaluation harness (Validation loss, perplexity, pairwise LLM-as-a-judge).
  - Standalone weight fusion, GGUF quantization, and OpenAI-compatible FastAPI streaming server.

---

## 🏗️ System Architecture

```text
                                  +------------------------+
                                  |   Web UI / Dashboard   |
                                  |    (Epic Think AI)     |
                                  +-----------+------------+
                                              |
                                              v
+---------------------+           +------------------------+           +----------------------+
|  Hindsight Memory   | <-------> |  Express / WS Server   | <-------> |   Plugin Ecosystem   |
|   (Semantic/Vector) |           |      (server.js)       |           |   (GitHub, Shell...) |
+---------------------+           +-----------+------------+           +----------------------+
                                              |
                                              v
                                  +------------------------+
                                  |   AI Model Router      |
                                  +-----+------------+-----+
                                        |            |
                     +------------------+            +------------------+
                     |                                                  |
                     v                                                  v
         +-----------------------+                          +-----------------------+
         | Cloud Providers       |                          | Local Epic Think LoRA |
         | (Gemini / Anthropic)  |                          | (RTX 5050 / FastAPI)  |
         +-----------------------+                          +-----------------------+
```

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- Node.js 18+ (Node 20+ recommended)
- Python 3.10+ (for fine-tuning pipeline)
- Git

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/liteshraomupparti-byte/epic-think-ai.git
cd epic-think-ai
npm install
```

### 3. Environment Setup
Copy the sample environment file and configure your API keys:
```bash
cp .env.example .env
```

### 4. Running the Web Application
```bash
npm start
```
Access the web console at `http://localhost:3000`.

---

## 🔬 Local Qwen Fine-Tuning Pipeline

The [`fine_tuning/`](fine_tuning/) directory provides a complete QLoRA workflow configured for NVIDIA RTX GPUs:

### Setup Python Environment
```bash
cd fine_tuning
python -m venv .venv
# Activate environment (Windows PowerShell: .venv\Scripts\Activate.ps1)
pip install torch transformers peft trl bitsandbytes accelerate datasets pyyaml
```

### Execute Fine-Tuning & Evaluation
```bash
# 1. Generate & Validate Dataset
python dataset/generator.py
python dataset/validator.py

# 2. Run QLoRA Fine-Tuning
python training/train_lora.py --config config/training_config.yaml

# 3. Evaluate Perplexity & Reasoning Benchmarks
python evaluation/evaluate.py --adapter checkpoints/epic-think-qwen-lora/best_adapter

# 4. Launch OpenAI-Compatible Streaming Microservice
python deployment/serve_api.py
```

---

## 🔒 Security & Privacy

- All sensitive keys (`.env`, `service-account.json`, persistent storage snapshots) are strictly `.gitignore`'d.
- Always use `.env.example` as a template for team deployments.

---

## 📄 License
ISC License. Built with ❤️ for Epic Think AI.
