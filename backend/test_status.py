from main import generate_similar_designs

print("🎨 Exact Kolam Pattern Status Check")
print("=" * 40)

designs = generate_similar_designs(3)
print(f"✅ Generated {len(designs)} exact patterns")
print()

for i, design in enumerate(designs, 1):
    print(f"{i}. {design['pattern_name']}")
    print(f"   Similarity: {design['score']*100:.1f}%")
    print(f"   Type: {design['pattern_type']}")
    print()

print("🎉 All exact kolam patterns ready!")
print("🌐 Frontend: http://localhost:3002")
print("🔧 Backend: http://127.0.0.1:8000")
