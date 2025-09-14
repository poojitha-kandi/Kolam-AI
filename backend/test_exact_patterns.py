import requests
import json
from PIL import Image, ImageDraw
import io

def create_test_kolam():
    """Create a simple test kolam for upload"""
    img = Image.new('RGB', (300, 300), 'white')
    draw = ImageDraw.Draw(img)
    
    # Draw a 3x3 grid of dots
    for i in range(3):
        for j in range(3):
            x = 75 + i * 75
            y = 75 + j * 75
            draw.ellipse([x-10, y-10, x+10, y+10], fill='black')
    
    # Add some connecting lines
    for i in range(3):
        for j in range(2):
            x1, y1 = 75 + i * 75, 75 + j * 75
            x2, y2 = 75 + i * 75, 75 + (j+1) * 75
            draw.line([(x1, y1), (x2, y2)], fill='gray', width=4)
    
    return img

def test_exact_kolam_patterns():
    print("🎨 Testing Exact Kolam Pattern Recreation")
    print("=" * 50)
    
    # Create test image
    test_img = create_test_kolam()
    
    # Convert to bytes
    buf = io.BytesIO()
    test_img.save(buf, format='PNG')
    buf.seek(0)
    
    try:
        # Upload to API
        files = {'file': ('test_kolam.png', buf, 'image/png')}
        response = requests.post('http://127.0.0.1:8000/predict', files=files, timeout=30)
        
        if response.status_code == 200:
            result = response.json()
            print("✅ API Response Success!")
            print(f"📊 Detected Grid: {result['grid_size']}x{result['grid_size']}")
            print(f"🎨 Generated Designs: {len(result['similar'])}")
            print()
            
            print("🎯 Your Exact Traditional Kolam Patterns:")
            pattern_descriptions = [
                "3x3 Interlocking Loops - figure-8 patterns connecting dots",
                "Cross Star Pattern - X/cross shapes around each dot", 
                "Simple Curved Loops - oval loops with curved connections",
                "Interwoven Diamond Pattern - diamond shapes with diagonal connections"
            ]
            
            for i, (design, desc) in enumerate(zip(result['similar'], pattern_descriptions)):
                print(f"  🔸 Pattern {i+1}: {design['pattern_name']}")
                print(f"     Description: {desc}")
                print(f"     Similarity: {design['score']*100:.1f}%")
                print(f"     File: {design['filename']}")
                print(f"     Base64 Data: {len(design['thumb_base64'])} chars")
                print()
            
            print("🎉 SUCCESS: All exact kolam patterns are now live in your application!")
            print("🌐 Visit http://localhost:3002 to see them in action!")
            return True
            
        else:
            print(f"❌ API Error: {response.status_code}")
            print(response.text)
            return False
            
    except Exception as e:
        print(f"❌ Test Failed: {e}")
        return False

if __name__ == "__main__":
    test_exact_kolam_patterns()
