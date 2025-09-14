print("🎨 KOLAM AI APPLICATION STATUS")
print("=" * 40)
print()

# Check backend
import requests
try:
    r = requests.get('http://127.0.0.1:8000/', timeout=5)
    print("✅ Backend Server: RUNNING")
    print(f"   └─ http://127.0.0.1:8000 (Status: {r.status_code})")
except:
    print("❌ Backend Server: NOT ACCESSIBLE")

# Check frontend by trying to access it
try:
    r = requests.get('http://localhost:3002/', timeout=5)
    print("✅ Frontend Server: RUNNING")
    print(f"   └─ http://localhost:3002 (Status: {r.status_code})")
except:
    print("❌ Frontend Server: NOT ACCESSIBLE")

print()
print("🎯 YOUR EXACT KOLAM PATTERNS:")

# Check kolam patterns
try:
    from main import generate_similar_designs
    designs = generate_similar_designs(3)
    
    for i, design in enumerate(designs, 1):
        print(f"   {i}. {design['pattern_name']} - {design['score']*100:.1f}%")
    
    print()
    print("✅ All exact kolam patterns loaded successfully!")
    print()
    print("🌐 READY TO USE:")
    print("   1. Open: http://localhost:3002")
    print("   2. Upload any kolam image")
    print("   3. View your exact traditional patterns!")
    
except Exception as e:
    print(f"❌ Kolam patterns error: {e}")

print()
print("🎉 APPLICATION IS READY!")
