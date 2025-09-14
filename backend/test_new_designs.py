import requests
import base64
import os

# Test the API endpoint
def test_kolam_api():
    # Use a simple test image
    from PIL import Image, ImageDraw
    import io
    
    # Create a simple test kolam image
    img = Image.new('RGB', (200, 200), 'white')
    draw = ImageDraw.Draw(img)
    
    # Draw a simple 3x3 dot pattern
    for i in range(3):
        for j in range(3):
            x = 50 + i * 50
            y = 50 + j * 50
            draw.ellipse([x-5, y-5, x+5, y+5], fill='black')
    
    # Convert to bytes
    buf = io.BytesIO()
    img.save(buf, format='PNG')
    buf.seek(0)
    
    # Send to API
    files = {'file': ('test.png', buf, 'image/png')}
    response = requests.post('http://127.0.0.1:8000/predict', files=files)
    
    if response.status_code == 200:
        result = response.json()
        print("✅ API test successful!")
        print(f"Grid size detected: {result['grid_size']}")
        print(f"Number of similar designs: {len(result['similar'])}")
        
        # Print similarity scores
        for i, design in enumerate(result['similar']):
            print(f"Design {i+1}: {design['score']*100:.1f}% similarity")
        
        return True
    else:
        print(f"❌ API test failed: {response.status_code}")
        print(response.text)
        return False

if __name__ == "__main__":
    test_kolam_api()
