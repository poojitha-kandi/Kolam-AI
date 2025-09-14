import requests
import time

print("🔍 Testing Server Connectivity")
print("=" * 40)

# Test Backend
try:
    r = requests.get('http://127.0.0.1:8000', timeout=10)
    print(f"✅ Backend: Status {r.status_code}")
except Exception as e:
    print(f"❌ Backend Error: {e}")

# Test Frontend
try:
    r = requests.get('http://localhost:3003', timeout=10)
    print(f"✅ Frontend: Status {r.status_code}")
except Exception as e:
    print(f"❌ Frontend Error: {e}")

print("\n🌐 Try accessing these URLs in your browser:")
print("- Frontend App: http://localhost:3003")
print("- Backend API: http://127.0.0.1:8000/docs")
