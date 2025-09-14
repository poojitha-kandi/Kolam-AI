from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io, base64, numpy as np, cv2
import os

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for MVP; restrict in production
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- Replace with your notebook pipeline ----------
def process_image_bytes(img_bytes):
    """Input: image bytes. Output: RGB numpy array (0-255) recreated kolam."""
    img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
    img_np = np.array(img)
    # example pipeline (tweak to match your notebook)
    gray = cv2.cvtColor(img_np, cv2.COLOR_RGB2GRAY)
    # adaptive threshold or Otsu
    _, bw = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
    # optional morphological cleanup
    kernel = np.ones((3,3), np.uint8)
    bw = cv2.morphologyEx(bw, cv2.MORPH_OPEN, kernel)
    # Use OpenCV thinning instead of skeletonize for now
    # Apply morphological thinning to get skeleton-like effect
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3,3))
    skeleton = cv2.morphologyEx(bw, cv2.MORPH_GRADIENT, kernel)
    out_rgb = cv2.cvtColor(skeleton, cv2.COLOR_GRAY2RGB)
    return out_rgb

# ---------- Simple similarity (MVP) ----------
# Precomputed database of thumbnails (prepare offline) as numpy arrays smaller size
THUMBS_DIR = "data/thumbs"  # store small images here
def load_thumbs():
    thumbs = []
    ids = []
    if not os.path.exists(THUMBS_DIR):
        return ids, thumbs
    for fn in os.listdir(THUMBS_DIR):
        path = os.path.join(THUMBS_DIR, fn)
        img = Image.open(path).convert("RGB").resize((64,64))
        arr = np.array(img).astype(np.float32).ravel()
        arr = arr / (np.linalg.norm(arr)+1e-8)
        ids.append(fn)
        thumbs.append(arr)
    return ids, np.stack(thumbs) if thumbs else np.zeros((0,1))

THUMB_IDS, THUMB_ARRS = load_thumbs()

def find_similar_bytes(img_bytes, k=5):
    if THUMB_ARRS.size == 0:
        return []
    img = Image.open(io.BytesIO(img_bytes)).convert("RGB").resize((64,64))
    q = np.array(img).astype(np.float32).ravel()
    q = q / (np.linalg.norm(q)+1e-8)
    sims = (THUMB_ARRS @ q)
    idx = np.argsort(-sims)[:k]
    results = []
    for i in idx:
        fn = THUMB_IDS[i]
        score = float(sims[i])
        # return thumbnail as base64
        with open(os.path.join(THUMBS_DIR, fn), "rb") as f:
            b64 = base64.b64encode(f.read()).decode("utf-8")
        results.append({"id": fn, "score": score, "thumb_base64": b64})
    return results

# ---------- API endpoint ----------
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    content = await file.read()
    recreated = process_image_bytes(content)
    # encode recreated as base64 PNG
    pil = Image.fromarray(recreated)
    buf = io.BytesIO()
    pil.save(buf, format="PNG")
    recreated_b64 = base64.b64encode(buf.getvalue()).decode("utf-8")
    similar = find_similar_bytes(content, k=5)
    return JSONResponse({"image_base64": recreated_b64, "similar": similar})
