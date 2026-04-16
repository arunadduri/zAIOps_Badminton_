#!/usr/bin/env python3

"""
Gallery Image List Generator

This script automatically scans the Photos directory and generates
an images.json file with all image filenames.

Usage: python update-gallery.py

Run this script whenever you add new images to the Photos folder.
"""

import os
import json
from pathlib import Path

# Configuration
PHOTOS_DIR = Path(__file__).parent / 'Photos'
OUTPUT_FILE = PHOTOS_DIR / 'images.json'

# Supported image extensions
IMAGE_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'}

def is_image_file(filename):
    """Check if file is an image based on extension"""
    return Path(filename).suffix.lower() in IMAGE_EXTENSIONS

def generate_image_list():
    """Scan Photos directory and generate images.json"""
    try:
        # Get all files in Photos directory
        files = [f.name for f in PHOTOS_DIR.iterdir() if f.is_file()]
        
        # Filter for image files only and exclude images.json
        image_files = sorted([
            f for f in files 
            if f != 'images.json' and is_image_file(f)
        ])
        
        # Write to images.json
        with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
            json.dump(image_files, f, indent=4, ensure_ascii=False)
        
        print('✅ Gallery updated successfully!')
        print(f'📸 Found {len(image_files)} images:')
        for img in image_files:
            print(f'   - {img}')
        print(f'\n📝 Updated: {OUTPUT_FILE}')
        
    except Exception as e:
        print(f'❌ Error generating image list: {e}')
        exit(1)

if __name__ == '__main__':
    generate_image_list()

# Made with Bob
