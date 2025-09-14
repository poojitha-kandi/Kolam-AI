from main import generate_similar_designs

designs = generate_similar_designs(3, 4)
print('Generated', len(designs), 'traditional kolam designs')

for i, design in enumerate(designs):
    print(f'Design {i+1}: {design["pattern_type"]} - {design["score"]*100:.1f}% similarity')
    print(f'  Filename: {design["filename"]}')
    print()

print("✅ Traditional kolam pattern generation successful!")
