# Epic Think AI - GGUF Manual Export Commands

If automatic conversion is not run, execute the following commands with llama.cpp:

```bash
# 1. Convert HuggingFace Safetensors to F16 GGUF
python llama.cpp/convert_hf_to_gguf.py "D:\Ai Agent HPS\fine_tuning\exported\epic-think-qwen-merged" --outfile "D:\Ai Agent HPS\fine_tuning\exported\gguf\epic-think-qwen2.5-7b-f16.gguf" --outtype f16

# 2. Quantize to Q4_K_M (Balanced, Fast, 4.5 GB)
./llama.cpp/build/bin/llama-quantize "D:\Ai Agent HPS\fine_tuning\exported\gguf\epic-think-qwen2.5-7b-f16.gguf" "D:\Ai Agent HPS\fine_tuning\exported\gguf/epic-think-qwen2.5-7b-q4_k_m.gguf" Q4_K_M

# 3. Quantize to Q8_0 (Near-FP16 Precision, 7.7 GB)
./llama.cpp/build/bin/llama-quantize "D:\Ai Agent HPS\fine_tuning\exported\gguf\epic-think-qwen2.5-7b-f16.gguf" "D:\Ai Agent HPS\fine_tuning\exported\gguf/epic-think-qwen2.5-7b-q8_0.gguf" Q8_0

# 4. Import directly into Ollama
ollama create epic-think-qwen -f deployment/Modelfile
```
