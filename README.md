# 🛡️ distilbert-lora-prompt-injection-firewall

A lightweight, local AI firewall built with DistilBERT and LoRA to detect and block LLM prompt injections in real-time on standard CPUs or low-VRAM GPUs.

<img src="./assets/ChatInterface.png" alt="Firewall UI" width="600">

## 📌 Project Overview
As Large Language Models become integrated into production systems, they are vulnerable to Prompt Injections and Jailbreaks. This project implements a lightweight, local "firewall" model that scans incoming user text in real-time. If an attack is detected, the request is blocked.

This is achieved by fine-tuning a `distilbert-base-uncased` model using Parameter-Efficient Fine-Tuning (PEFT/LoRA) to run inference on limited hardware (4GB VRAM or CPU) in milliseconds.

## ⚙️ Architecture & Tech Stack
* **Base Model:** DistilBERT (Hugging Face)
* **Optimization:** PEFT / LoRA (Rank 8)
* **Backend Engine:** FastAPI, PyTorch, Uvicorn
* **Frontend:** Vanilla HTML/JS/CSS (No-framework static site)
* **Training Hardware:** Google Colab (T4 GPU)
* **Inference Hardware:** Local CPU or 4GB VRAM GPU

## 📊 Model Performance
The model was fine-tuned on a custom dataset of prompt injections and evaluated on an unseen test split, achieving an overall accuracy of **91%**.

* **Precision (Attacks):** 0.96 (Low False Positive rate; legitimate users are rarely blocked)
* **Recall (Attacks):** 0.85 (Successfully caught 85% of injection attempts)
* **F1-Score:** 0.90

## 🧠 Training & Fine-Tuning (DIY)
This repository includes the complete dataset and Jupyter Notebooks used to train the model. If you want to train your own version, explore the data, or see the math behind the model, check out the `FineTuning` directory:

* 📊 **[The Dataset](./FineTuning/data/raw/raw_injections.csv):** The raw CSV containing safe and malicious prompts. You can modify this to include new zero-day attacks and retrain the model!
* 🔍 **[Data Analysis Notebook](./FineTuning/DataAnalysis.ipynb):** Exploratory Data Analysis (EDA) showcasing data distribution and token length analysis.
* 🤖 **[Training Notebook](./FineTuning/DistilBERT_LoRA_Training.ipynb):** The complete PyTorch/Hugging Face training loop using LoRA adapters.

## 🚀 Quick Start / Local Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Shreejal170/distilbert-lora-prompt-injection-firewall
cd distilbert-lora-prompt-injection-firewall
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Start the Backend API
The FastAPI server loads the .safetensors LoRA weights and listens for incoming prompts.

```bash
cd backend
uvicorn main:app --reload
```

### 4. Launch the UI
Simply open `frontend/index.html` in your browser. Type a prompt, and watch the firewall evaluate it in real-time.

## 📂 Repository Structure
```text
├── assets/                   # README images and UI screenshots
├── backend/                  
│   └── main.py               # FastAPI server and inference logic
├── final_lora_model/         # Exported .safetensors weights and tokenizer
├── FineTuning/               
│   ├── data/                 # Raw and processed CSV datasets
│   ├── scripts/              # Data preparation scripts
│   ├── DataAnalysis.ipynb    # EDA and dataset overview
│   └── DistilBERT_LoRA_Training.ipynb # Core training pipeline
├── frontend/                 # Static HTML/JS/CSS user interface
├── requirements.txt          # Python dependencies
└── README.md
```