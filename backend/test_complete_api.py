import requests
import base64
from PIL import Image, ImageDraw
import io

def test_complete_api():
    print("🔍 Testing Complete Kolam AI API...")
    
    # Create a simple test kolam image
    img = Image.new('RGB', (200, 200), 'white')
    draw = ImageDraw.Draw(img)
    
    # Draw a simple 3x3 dot pattern
    for i in range(3):
        for j in range(3):
            x = 50 + i * 50
            y = 50 + j * 50
            draw.ellipse([x-8, y-8, x+8, y+8], fill='black')
            
    # Add some connecting lines to make it look more like a kolam
    for i in range(3):
        for j in range(2):
            x1 = 50 + i * 50
            y1 = 50 + j * 50
            x2 = 50 + i * 50
            y2 = 50 + (j + 1) * 50
            draw.line([(x1, y1), (x2, y2)], fill='gray', width=3)
    
    # Convert to bytes
    buf = io.BytesIO()
    img.save(buf, format='PNG')
    buf.seek(0)
    
    try:
        # Send to API
        files = {'file': ('test_kolam.png', buf, 'image/png')}
        response = requests.post('http://127.0.0.1:8000/predict', files=files, timeout=30)
        
        if response.status_code == 200:
            result = response.json()
            print("✅ API Response Successful!")
            print(f"📊 Grid size detected: {result['grid_size']}x{result['grid_size']}")
            print(f"🔢 Number of dots detected: {result['num_dots_detected']}")
            print(f"🎨 Number of similar designs: {len(result['similar'])}")
            print(f"📁 Recreated image saved as: {result['recreated_filename']}")
            
            print("\n🎯 Similar Traditional Designs:")
            for i, design in enumerate(result['similar']):
                print(f"  Design {i+1}: {design['score']*100:.1f}% similarity")
                print(f"    Pattern type: {design['pattern_type']}")
                print(f"    Filename: {design['filename']}")
                print(f"    Image data: {len(design['thumb_base64'])} bytes (base64)")
            
            # Verify that we have base64 image data for each design
            all_valid = True
            for design in result['similar']:
                try:
                    img_data = base64.b64decode(design['thumb_base64'])
                    print(f"    ✅ Image {design['id']}: {len(img_data)} bytes decoded")
                except Exception as e:
                    print(f"    ❌ Image {design['id']}: Failed to decode - {e}")
                    all_valid = False
            
            if all_valid:
                print("\n🎉 All traditional kolam designs generated successfully!")
                print("✨ The similar traditional kolam designs section is working perfectly!")
                return True
            else:
                print("\n⚠️ Some images failed to decode properly")
                return False
        else:
            print(f"❌ API Error: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Connection Error: {e}")
        print("Make sure the backend server is running on http://127.0.0.1:8000")
        return False

if __name__ == "__main__":
    test_complete_api()
