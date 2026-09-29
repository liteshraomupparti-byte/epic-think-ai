@echo off
REM ==============================================================================
REM Epic Think AI - vLLM Windows Launch Script
REM ==============================================================================

set MODEL_PATH=./exported/epic-think-qwen-merged
set PORT=8000
set HOST=0.0.0.0

echo Starting Epic Think AI vLLM Server on http://%HOST%:%PORT%...
python -m vllm.entrypoints.openai.api_server ^
    --model "%MODEL_PATH%" ^
    --served-model-name "epic-think-qwen2.5-7b" ^
    --host %HOST% ^
    --port %PORT% ^
    --gpu-memory-utilization 0.90 ^
    --max-model-len 16384 ^
    --enable-prefix-caching ^
    --trust-remote-code
