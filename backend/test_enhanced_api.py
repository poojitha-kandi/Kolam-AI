#!/usr/bin/env python3
"""
Simple test script to verify the enhanced Kolam AI API is working correctly.
"""

import requests
import os
from PIL import Image, ImageDraw
import io
import base64

def test_kolam_api():
    """Test the /predict endpoint"""
    
    # Create a simple test image with dots
    print("Creating test image with 3x3 dot pattern...")
    test_img = Image.new('RGB', (300, 300), 'white')
    draw = ImageDraw.Draw(test_img)
    
    # Draw a 3x3 grid of dots
    for i in range(3):
        for j in range(3):
            x = 75 + i * 75
            y = 75 + j * 75
            draw.ellipse([x-10, y-10, x+10, y+10], fill='black')
    
    # Save to bytes
    buf = io.BytesIO()
    test_img.save(buf, format='JPEG')
    test_image_bytes = buf.getvalue()
    
    # Save test image for reference
    test_img.save('test_input.jpg')
    print("✅ Test input image saved as test_input.jpg")
    
    # Test the API
    url = "http://localhost:8000/predict"
    
    try:
        files = {'file': ('test.jpg', io.BytesIO(test_image_bytes), 'image/jpeg')}
        response = requests.post(url, files=files)
        
        if response.status_code == 200:
            result = response.json()
            print("✅ API Test Successful!")
            print(f"Grid size detected: {result.get('grid_size', 'Unknown')}")
            print(f"Number of dots detected: {result.get('num_dots_detected', 'Unknown')}")
            print(f"Response keys: {list(result.keys())}")
            
            # Check if image data is returned
            if 'image_base64' in result:
                print("✅ Recreated image data returned")
                
                # Save the recreated result
                try:
                    image_data = base64.b64decode(result['image_base64'])
                    with open('test_recreated_output.png', 'wb') as f:
                        f.write(image_data)
                    print("✅ Recreated output saved as test_recreated_output.png")
                except Exception as e:
                    print(f"⚠️  Could not save recreated image: {e}")
            else:
                print("❌ No recreated image in response")
                
            # Check similar images
            if 'similar' in result:
                print(f"✅ Found {len(result['similar'])} similar pattern designs")
                for i, item in enumerate(result['similar']):
                    pattern_type = item.get('pattern_type', 'Unknown')
                    score = item.get('score', 0)
                    print(f"  Pattern {i+1}: {pattern_type} (Score: {score:.1%})")
                    
                    # Save similar pattern images
                    try:
                        image_data = base64.b64decode(item['thumb_base64'])
                        with open(f'test_similar_{i+1}_{pattern_type}.png', 'wb') as f:
                            f.write(image_data)
                        print(f"    ✅ Saved as test_similar_{i+1}_{pattern_type}.png")
                    except Exception as e:
                        print(f"    ⚠️  Could not save similar image {i+1}: {e}")
            else:
                print("⚠️  No similar patterns found")
                
        else:
            print(f"❌ API Error: {response.status_code}")
            print(response.text)
            
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to backend server. Is it running on port 8000?")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_kolam_api()
