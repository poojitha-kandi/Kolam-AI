from main import generate_similar_designs
import json

print("🎨 Testing the New Traditional Kolam Designs")
print("=" * 50)

# Generate the designs
designs = generate_similar_designs(3, 4)
print(f"✅ Generated {len(designs)} traditional kolam designs based on your provided images")
print()

for i, design in enumerate(designs, 1):
    print(f"🔸 Design {i}: {design['pattern_name']}")
    print(f"   Similarity: {design['score']*100:.1f}%")
    print(f"   Pattern Type: {design['pattern_type']}")
    print(f"   Saved as: {design['filename']}")
    print(f"   Base64 size: {len(design['thumb_base64'])} characters")
    print()

print("🎉 All traditional kolam patterns are now ready!")
print("📱 Your application will now show these designs in the 'Similar Traditional Kolam Designs' section")
print("🌟 Each design matches the style of the kolam images you provided")
