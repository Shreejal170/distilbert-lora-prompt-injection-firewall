from datasets import load_dataset
import pandas as pd
import os

os.makedirs('../data/raw', exist_ok=True)
os.makedirs('../data/processed', exist_ok=True)

dataset = load_dataset("deepset/prompt-injections", split="train")

df = dataset.to_pandas()

file_path = "../data/raw/raw_injections.csv"
df.to_csv(file_path, index=False)

print(f"Downloaded {len(df)} prompts and saved to {file_path}")
