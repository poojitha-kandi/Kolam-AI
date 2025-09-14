#!/usr/bin/env python3
"""
Simple test script to verify the Kolam AI API is working correctly.
"""

import requests
import os
from PIL import Image
import io
import base64

def test_kolam_api():
    """Test the /process-image endpoint"""
    
    # Check if sample image exists
    sample_image_path = "data/thumbs/kolam_dots_1.jpg"
    if not os.path.exists(sample_image_path):
        print(f"Sample image not found at {sample_image_path}")
        return
    
    # Test the API
    url = "http://localhost:8000/predict"
    
    try:
        with open(sample_image_path, 'rb') as f:
            files = {'file': ('test.jpg', f, 'image/jpeg')}
            response = requests.post(url, files=files)
        
        if response.status_code == 200:
            result = response.json()
            print("✅ API Test Successful!")
            print(f"Response keys: {list(result.keys())}")
            
            # Check if image data is returned
            if 'image_base64' in result:
                print("✅ Processed image data returned")
                
                # Optionally save the result
                try:
                    image_data = base64.b64decode(result['image_base64'])
                    with open('test_output.png', 'wb') as f:
                        f.write(image_data)
                    print("✅ Output saved as test_output.png")
                except Exception as e:
                    print(f"⚠️  Could not save output image: {e}")
            else:
                print("❌ No processed image in response")
                
            # Check similar images
            if 'similar' in result:
                print(f"✅ Found {len(result['similar'])} similar images")
            else:
                print("⚠️  No similar images found")
                
        else:
            print(f"❌ API Error: {response.status_code}")
            print(response.text)
            
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to backend server. Is it running on port 8000?")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_kolam_api()
