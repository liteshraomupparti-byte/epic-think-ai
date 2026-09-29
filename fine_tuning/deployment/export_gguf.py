#!/usr/bin/env python3
"""
Epic Think AI - GGUF Quantization & Ollama Packaging
Converts merged Hugging Face Qwen models to GGUF format using llama.cpp
and prepares multi-level quantizations (Q4_K_M, Q5_K_M, Q8_0).
"""

import os
import sys
import shutil
import argparse
import subprocess
from pathlib import Path
from typing import List

DEFAULT_MERGED_DIR = Path(__file__).resolve().parent.parent / "exported" / "epic-think-qwen-merged"
DEFAULT_GGUF_DIR = Path(__file__).resolve().parent.parent / "exported" / "gguf"

QUANT_TYPES = ["Q4_K_M", "Q5_K_M", "Q8_0"]

def export_to_gguf(
    merged_model_dir: str,
    output_dir: str,
    quant_types: List[str] = QUANT_TYPES,
    llama_cpp_root: str = "llama.cpp"
):
    print("=" * 70)
    print("Epic Think AI - GGUF Quantization & Packaging Pipeline")
    print("=" * 70)
    print(f"[*] Source Merged Model : {merged_model_dir}")
    print(f"[*] GGUF Target Directory: {output_dir}")

    os.makedirs(output_dir, exist_ok=True)
    out_path = Path(output_dir)

    # 1. Locate conversion script from llama.cpp
    convert_script = Path(llama_cpp_root) / "convert_hf_to_gguf.py"
    if not convert_script.exists():
        # Check system PATH or alternative locations
        found_script = shutil.which("convert_hf_to_gguf.py")
        if found_script:
            convert_script = Path(found_script)

    print(f"[*] Checking for llama.cpp conversion script: {convert_script}")

    f16_gguf = out_path / "epic-think-qwen2.5-3b-f16.gguf"

    if not convert_script.exists():
        print("\n[!] llama.cpp 'convert_hf_to_gguf.py' not found locally.")
        print("[*] To install llama.cpp tools:")
        print("    git clone https://github.com/ggerganov/llama.cpp.git")
        print("    pip install -r llama.cpp/requirements.txt")
        print("    cmake -B llama.cpp/build llama.cpp && cmake --build llama.cpp/build --config Release")
        
        # Write instructions and GGUF mock descriptor
        readme_file = out_path / "GGUF_EXPORT_INSTRUCTIONS.md"
        with open(readme_file, "w", encoding="utf-8") as f:
            f.write(f"""# Epic Think AI - GGUF Manual Export Commands

If automatic conversion is not run, execute the following commands with llama.cpp:

```bash
# 1. Convert HuggingFace Safetensors to F16 GGUF
python llama.cpp/convert_hf_to_gguf.py "{merged_model_dir}" --outfile "{f16_gguf}" --outtype f16

# 2. Quantize to Q4_K_M (Balanced, Fast, ~1.9 GB - fits in any GPU/RAM)
./llama.cpp/build/bin/llama-quantize "{f16_gguf}" "{out_path}/epic-think-qwen2.5-3b-q4_k_m.gguf" Q4_K_M

# 3. Quantize to Q8_0 (Near-FP16 Precision, ~3.4 GB)
./llama.cpp/build/bin/llama-quantize "{f16_gguf}" "{out_path}/epic-think-qwen2.5-3b-q8_0.gguf" Q8_0

# 4. Import directly into Ollama
ollama create epic-think-qwen -f deployment/Modelfile
```
""")
        print(f"[+] Export guidelines written to: {readme_file}")
        return

    # If convert script exists, run conversion
    cmd_f16 = [
        sys.executable,
        str(convert_script),
        str(merged_model_dir),
        "--outfile", str(f16_gguf),
        "--outtype", "f16"
    ]
    print(f"[*] Executing F16 GGUF conversion:\n    {' '.join(cmd_f16)}")
    res = subprocess.run(cmd_f16)
    if res.returncode != 0:
        print("[!] F16 conversion failed.")
        return

    # Quantize
    quant_binary = Path(llama_cpp_root) / "build" / "bin" / ("llama-quantize.exe" if os.name == "nt" else "llama-quantize")
    if quant_binary.exists():
        for q in quant_types:
            q_out = out_path / f"epic-think-qwen2.5-3b-{q.lower()}.gguf"
            print(f"[*] Quantizing to {q} -> {q_out.name}...")
            subprocess.run([str(quant_binary), str(f16_gguf), str(q_out), q])
    else:
        print(f"[!] llama-quantize binary not found at {quant_binary}. Only F16 created.")

def main():
    parser = argparse.ArgumentParser(description="Epic Think AI GGUF Exporter")
    parser.add_argument("--merged-dir", type=str, default=str(DEFAULT_MERGED_DIR))
    parser.add_argument("--output-dir", type=str, default=str(DEFAULT_GGUF_DIR))
    parser.add_argument("--llama-cpp", type=str, default="llama.cpp")
    args = parser.parse_args()

    export_to_gguf(
        merged_model_dir=args.merged_dir,
        output_dir=args.output_dir,
        llama_cpp_root=args.llama_cpp
    )

if __name__ == "__main__":
    main()
