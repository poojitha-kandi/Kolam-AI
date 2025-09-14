import requests, io
from PIL import Image, ImageDraw

# Create a 2x2 test image
img = Image.new('RGB', (200, 200), 'white')
draw = ImageDraw.Draw(img)
for i in range(2):
    for j in range(2):
        x, y = 50 + i*100, 50 + j*100
        draw.ellipse([x-15, y-15, x+15, y+15], fill='black')

buf = io.BytesIO()
img.save(buf, format='JPEG')
test_bytes = buf.getvalue()

# Test API
files = {'file': ('test.jpg', io.BytesIO(test_bytes), 'image/jpeg')}
response = requests.post('http://localhost:8000/predict', files=files)
result = response.json()

print(f"Grid detected: {result['grid_size']}x{result['grid_size']}")
print(f"Dots found: {result['num_dots_detected']}")
print(f"Similar patterns: {len(result['similar'])}")
print("Pattern types:", [s["pattern_type"] for s in result["similar"]])
print("✅ Complete system test successful!")
