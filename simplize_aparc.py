"""
File: simplize_aparc.py
Author: Chuncheng Zhang
Date: 2023-11-28
Copyright & Email: chuncheng.zhang@ia.ac.cn

Purpose:
    It strips unnecessary columns in the asset/fsaverage/aparc.json,
    so the file size is largely shrunk.

Functions:
    1. Requirements and constants
    2. Function and class
    3. Play ground
    4. Pending
    5. Pending
"""


# %% ---- 2023-11-28 ------------------------
# Requirements and constants
import pandas as pd

path = './asset/fsaverage/aparc.json'
df = pd.read_json(path)
df = df[['name', 'xyz', 'color']]
df.to_json(path)


# %% ---- 2023-11-28 ------------------------
# Function and class


# %% ---- 2023-11-28 ------------------------
# Play ground


# %% ---- 2023-11-28 ------------------------
# Pending


# %% ---- 2023-11-28 ------------------------
# Pending
