#!/usr/bin/env python3
"""
Epic Think AI - Environment Verification & Setup Utility
Checks system capabilities (GPU, CUDA, PyTorch, Memory, Drivers) and verifies
whether required packages for LoRA / QLoRA are installed.
"""

import sys
import os
import platform
import subprocess
import importlib.util

def check_python_version():
    print(f"[*] Python Version: {platform.python_version()} ({sys.executable})")
    if sys.version_info < (3, 10):
        print("[!] Warning: Python 3.10+ is strongly recommended for Qwen fine-tuning.")
    else:
        print("[+] Python version is compatible.")

def check_cuda_and_gpu():
    print("\n--- Hardware & Acceleration Probes ---")
    try:
        import torch
        print(f"[+] PyTorch Version: {torch.__version__}")
        cuda_avail = torch.cuda.is_available()
        print(f"[*] CUDA Available: {cuda_avail}")
        if cuda_avail:
            device_count = torch.cuda.device_count()
            print(f"[+] Detected {device_count} CUDA Device(s):")
            for i in range(device_count):
                device_name = torch.cuda.get_device_name(i)
                total_mem_gb = torch.cuda.get_device_properties(i).total_memory / (1024**3)
                print(f"    - GPU {i}: {device_name} ({total_mem_gb:.2f} GB VRAM)")
                
            # Suggest optimal quantization mode based on VRAM
            primary_vram = torch.cuda.get_device_properties(0).total_memory / (1024**3)
            if primary_vram >= 40:
                print(f"[+] VRAM {primary_vram:.1f}GB: Suitable for full 16-bit LoRA on 14B/32B or QLoRA on 72B.")
            elif primary_vram >= 16:
                print(f"[+] VRAM {primary_vram:.1f}GB: Recommended mode: 4-bit QLoRA on Qwen2.5-7B or 14B.")
            elif primary_vram >= 8:
                print(f"[+] VRAM {primary_vram:.1f}GB: Recommended mode: 4-bit QLoRA on Qwen2.5-7B with gradient checkpointing.")
            else:
                print(f"[!] Low VRAM ({primary_vram:.1f}GB): Consider Unsloth 4-bit or cloud GPU (RunPod/Colab/Lambda).")
        else:
            print("[!] CUDA not detected in PyTorch. Training will run in CPU fallback mode (very slow).")
    except ImportError:
        print("[!] PyTorch is not yet installed.")

def check_packages():
    print("\n--- Package Verification ---")
    required = [
        "torch", "transformers", "peft", "trl", "bitsandbytes", 
        "accelerate", "datasets", "yaml", "pydantic", "fastapi"
    ]
    missing = []
    for pkg in required:
        pkg_name = "pyyaml" if pkg == "yaml" else pkg
        spec = importlib.util.find_spec(pkg_name if pkg != "yaml" else "yaml")
        if spec is not None:
            try:
                mod = __import__(pkg_name if pkg != "yaml" else "yaml")
                version = getattr(mod, "__version__", "installed")
                print(f"  [+] {pkg}: {version}")
            except Exception:
                print(f"  [+] {pkg}: installed")
        else:
            print(f"  [-] {pkg}: NOT FOUND")
            missing.append(pkg)
            
    if missing:
        print(f"\n[!] Missing packages detected: {', '.join(missing)}")
        print(f"[*] Install via: pip install -r fine_tuning/requirements.txt")
    else:
        print("\n[+] All core dependencies are installed and ready!")

if __name__ == "__main__":
    print("=" * 65)
    print("Epic Think AI - Qwen Fine-Tuning Environment Check")
    print("=" * 65)
    check_python_version()
    check_cuda_and_gpu()
    check_packages()
