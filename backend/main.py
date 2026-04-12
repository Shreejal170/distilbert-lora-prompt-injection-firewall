from fastapi import FastAPI
from pydantic import BaseModel
import torch
import os
from transformers import AutoModelForSequenceClassification, AutoTokenizer
from peft import PeftModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="AI Firewall API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

base_model_name = 'distilbert-base-uncased'
current_dir = os.path.dirname(os.path.abspath(__file__))
lora_model_path = os.path.abspath(os.path.join(current_dir, '..', 'final_lora_model'))

tokenizer = AutoTokenizer.from_pretrained(lora_model_path)
base_model = AutoModelForSequenceClassification.from_pretrained(base_model_name, num_labels=2)
model = PeftModel.from_pretrained(base_model, lora_model_path)

device = "cuda" if torch.cuda.is_available() else "cpu"
model.to(device)
model.eval()

class PromptRequest(BaseModel):
    text: str

@app.post("/scan")
async def scan_prompt(request: PromptRequest):
    inputs = tokenizer(request.text, return_tensors="pt", truncation=True, padding=True, max_length=512).to(device)

    with torch.no_grad():
        outputs = model(**inputs)
        prediction = torch.argmax(outputs.logits, dim=-1).item()

    result = "Safe" if prediction == 0 else "Malicious Injection"

    return {"prompt": request.text, "prediction": result}