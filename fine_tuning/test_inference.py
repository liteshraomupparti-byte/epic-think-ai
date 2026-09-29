import os
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig
from peft import PeftModel

base_model_path = "Qwen/Qwen2.5-3B-Instruct"
adapter_path = "fine_tuning/checkpoints/epic-think-qwen-lora/best_adapter"

print("[*] Loading base model + trained LoRA adapter on RTX 5050...")
tokenizer = AutoTokenizer.from_pretrained(base_model_path, trust_remote_code=True)
bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_compute_dtype=torch.bfloat16,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_use_double_quant=True
)
model = AutoModelForCausalLM.from_pretrained(
    base_model_path,
    quantization_config=bnb_config,
    device_map="auto",
    torch_dtype=torch.bfloat16,
    attn_implementation="sdpa",
    low_cpu_mem_usage=True,
    trust_remote_code=True
)
model = PeftModel.from_pretrained(model, adapter_path)
model.eval()

prompt = "A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost? Reason step-by-step."
messages = [
    {"role": "system", "content": "You are Epic Think AI, an elite reasoning intelligence. Always think thoroughly inside <think>...</think> before providing the final answer."},
    {"role": "user", "content": prompt}
]

input_text = tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
inputs = tokenizer(input_text, return_tensors="pt").to(model.device)

print(f"\n[Query]: {prompt}\n")
print("[Generating response on RTX 5050 GPU...]\n")

with torch.no_grad():
    outputs = model.generate(
        **inputs,
        max_new_tokens=512,
        temperature=0.6,
        top_p=0.95,
        do_sample=True,
        pad_token_id=tokenizer.eos_token_id
    )

response = tokenizer.decode(outputs[0][inputs.input_ids.size(1):], skip_special_tokens=True)
print("=" * 60)
print("EPIC THINK AI - LIVE OUTPUT:")
print("=" * 60)
print(response)
print("=" * 60)
