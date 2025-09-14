"""
Script to create sample thumbnail images for similarity search.
This simulates having a database of Kolam patterns.
"""
import numpy as np
from PIL import Image, ImageDraw
import os

def create_kolam_pattern(size=64, pattern_type="dots"):
    """Create a simple synthetic Kolam pattern."""
    img = Image.new('RGB', (size, size), 'white')
    draw = ImageDraw.Draw(img)
    
    if pattern_type == "dots":
        # Create a dot grid pattern
        for i in range(1, 4):
            for j in range(1, 4):
                x = i * size // 4
                y = j * size // 4
                draw.ellipse([x-3, y-3, x+3, y+3], fill='black')
    
    elif pattern_type == "lines":
        # Create intersecting lines
        draw.line([10, 10, size-10, size-10], fill='black', width=2)
        draw.line([10, size-10, size-10, 10], fill='black', width=2)
        draw.line([size//2, 5, size//2, size-5], fill='black', width=2)
        draw.line([5, size//2, size-5, size//2], fill='black', width=2)
    
    elif pattern_type == "curves":
        # Create curved pattern
        draw.arc([10, 10, size-10, size-10], 0, 180, fill='black', width=2)
        draw.arc([10, 10, size-10, size-10], 180, 360, fill='black', width=2)
    
    return img

# Create sample thumbnails
thumbs_dir = "data/thumbs"
os.makedirs(thumbs_dir, exist_ok=True)

patterns = [
    ("dots", "kolam_dots_1.jpg"),
    ("lines", "kolam_lines_1.jpg"), 
    ("curves", "kolam_curves_1.jpg"),
    ("dots", "kolam_dots_2.jpg"),
    ("lines", "kolam_lines_2.jpg")
]

for pattern_type, filename in patterns:
    img = create_kolam_pattern(pattern_type=pattern_type)
    img.save(os.path.join(thumbs_dir, filename))
    print(f"Created {filename}")

print(f"Sample thumbnails created in {thumbs_dir}")
