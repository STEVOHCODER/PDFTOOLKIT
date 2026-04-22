from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
import pdfplumber
from pypdf import PdfWriter, PdfReader
import os
import uuid
import shutil
from typing import List
import img2pdf
import zipfile
import io
from PIL import Image
import time
import threading
import pikepdf
import sqlite3
from datetime import datetime
from fastapi.middleware.gzip import GZipMiddleware

app = FastAPI()
app.add_middleware(GZipMiddleware, minimum_size=500)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = os.path.join(os.getcwd(), "uploads")
DB_PATH = os.path.join(os.getcwd(), "stats.db")

if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS stats 
                 (id INTEGER PRIMARY KEY, type TEXT, tool TEXT, timestamp DATETIME)''')
    conn.commit()
    conn.close()

init_db()

def track_event(event_type: str, tool: str = "general"):
    try:
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute("INSERT INTO stats (type, tool, timestamp) VALUES (?, ?, ?)", 
                  (event_type, tool, datetime.now()))
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"Stats Error: {e}")

ADMIN_USERNAME = os.environ.get("ADMIN_USER", "admin")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASS", "smartpdf2026")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/admin/login")

@app.post("/api/admin/login")
def admin_login(form_data: OAuth2PasswordRequestForm = Depends()):
    if form_data.username == ADMIN_USERNAME and form_data.password == ADMIN_PASSWORD:
        return {"access_token": "secret-admin-token", "token_type": "bearer"}
    raise HTTPException(status_code=400, detail="Invalid credentials")

@app.get("/api/admin/stats")
def get_stats(token: str = Depends(oauth2_scheme)):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT COUNT(*) FROM stats WHERE type = 'visit'")
    visits = c.fetchone()[0]
    c.execute("SELECT COUNT(*) FROM stats WHERE type = 'download'")
    downloads = c.fetchone()[0]
    c.execute("SELECT tool, COUNT(*) FROM stats WHERE type = 'download' GROUP BY tool")
    breakdown = dict(c.fetchall())
    conn.close()
    return {"total_visitors": visits, "total_downloads": downloads, "breakdown": breakdown}

@app.get("/api/track/visit")
def log_visit():
    track_event("visit")
    return {"status": "tracked"}

@app.get("/")
def root():
    return {"status": "online", "message": "Smart PDF Pro API"}

@app.post("/api/compress")
def compress_pdf(file: UploadFile = File(...)):
    temp_path = os.path.join(UPLOAD_DIR, f"{uuid.uuid4()}_{file.filename}")
    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        output_path = os.path.join(UPLOAD_DIR, f"compressed_{uuid.uuid4()}.pdf")
        try:
            with pikepdf.open(temp_path) as pdf:
                pdf.save(output_path, compress_streams=True, linearize=True, object_stream_mode=pikepdf.ObjectStreamMode.all)
            final_path = output_path if os.path.getsize(output_path) < os.path.getsize(temp_path) else temp_path
        except:
            final_path = temp_path
        track_event("download", "compress")
        return FileResponse(final_path, filename=f"compressed_{file.filename}", media_type="application/pdf")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/compress-image")
def compress_image(file: UploadFile = File(...)):
    temp_path = os.path.join(UPLOAD_DIR, f"{uuid.uuid4()}_{file.filename}")
    try:
        with open(temp_path, "wb") as buffer: shutil.copyfileobj(file.file, buffer)
        img = Image.open(temp_path)
        if img.mode in ("RGBA", "P"): img = img.convert("RGB")
        output_io = io.BytesIO()
        img.save(output_io, format="JPEG", quality=50, optimize=True)
        output_io.seek(0)
        output_path = os.path.join(UPLOAD_DIR, f"{uuid.uuid4()}.jpg")
        with open(output_path, "wb") as f: f.write(output_io.read())
        track_event("download", "compress-image")
        return FileResponse(output_path, filename="compressed.jpg", media_type="image/jpeg")
    except Exception as e: raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/extract")
def extract_data(file: UploadFile = File(...)):
    temp_path = os.path.join(UPLOAD_DIR, f"{uuid.uuid4()}_{file.filename}")
    try:
        with open(temp_path, "wb") as buffer: shutil.copyfileobj(file.file, buffer)
        data = []
        with pdfplumber.open(temp_path) as pdf:
            pages = pdf.pages[:20]
            for page_num, page in enumerate(pages):
                text = page.extract_text()
                tables = page.extract_tables({"vertical_strategy": "lines", "horizontal_strategy": "lines"})
                formatted_tables = [[[(cell or "").strip() for cell in row] for row in t if any(row)] for t in tables if t]
                data.append({"page": page_num + 1, "text": text[:500] if text else "", "table_count": len(formatted_tables), "tables": formatted_tables})
        track_event("download", "extract")
        return JSONResponse(content={"filename": file.filename, "pages": data, "total_pages": len(pdf.pages), "status": "success"})
    except Exception as e: raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/merge")
def merge_pdfs(files: List[UploadFile] = File(...)):
    writer = PdfWriter()
    try:
        for file in files:
            path = os.path.join(UPLOAD_DIR, f"{uuid.uuid4()}_{file.filename}")
            with open(path, "wb") as b: shutil.copyfileobj(file.file, b)
            reader = PdfReader(path)
            for page in reader.pages: writer.add_page(page)
        out = os.path.join(UPLOAD_DIR, f"merged_{uuid.uuid4()}.pdf")
        with open(out, "wb") as f: writer.write(f)
        track_event("download", "merge")
        return FileResponse(out, filename="merged.pdf", media_type="application/pdf")
    except Exception as e: raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/split")
def split_pdf(file: UploadFile = File(...), ranges: str = Form(...)):
    path = os.path.join(UPLOAD_DIR, f"{uuid.uuid4()}_{file.filename}")
    try:
        with open(path, "wb") as b: shutil.copyfileobj(file.file, b)
        reader = PdfReader(path)
        output_files = []
        for r in [r.strip() for r in ranges.split(',')]:
            writer = PdfWriter()
            if '-' in r:
                s, e = map(int, r.split('-'))
                for p in range(s-1, min(e, len(reader.pages))): writer.add_page(reader.pages[p])
            else:
                p = int(r)-1
                if 0 <= p < len(reader.pages): writer.add_page(reader.pages[p])
            if len(writer.pages) > 0:
                out_p = os.path.join(UPLOAD_DIR, f"split_{uuid.uuid4()}.pdf")
                with open(out_p, "wb") as f: writer.write(f)
                output_files.append((out_p, f"split_{r}.pdf"))
        if not output_files: raise Exception("Invalid ranges")
        track_event("download", "split")
        if len(output_files) == 1: return FileResponse(output_files[0][0], filename=output_files[0][1], media_type="application/pdf")
        zip_p = os.path.join(UPLOAD_DIR, f"splits_{uuid.uuid4()}.zip")
        with zipfile.ZipFile(zip_p, 'w') as z:
            for p, n in output_files: z.write(p, arcname=n)
        return FileResponse(zip_p, filename="splits.zip", media_type="application/zip")
    except Exception as e: raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/img2pdf")
def img2pdf_conv(files: List[UploadFile] = File(...)):
    paths = []
    try:
        for file in files:
            p = os.path.join(UPLOAD_DIR, f"{uuid.uuid4()}_{file.filename}")
            with open(p, "wb") as b: shutil.copyfileobj(file.file, b)
            paths.append(p)
        out = os.path.join(UPLOAD_DIR, f"converted_{uuid.uuid4()}.pdf")
        with open(out, "wb") as f: f.write(img2pdf.convert(paths))
        track_event("download", "img2pdf")
        return FileResponse(out, filename="images.pdf", media_type="application/pdf")
    except Exception as e: raise HTTPException(status_code=500, detail=str(e))

def cleanup_old_files():
    while True:
        try:
            now = time.time()
            for f in os.listdir(UPLOAD_DIR):
                f_path = os.path.join(UPLOAD_DIR, f)
                if os.path.isfile(f_path) and os.stat(f_path).st_mtime < now - 3600: os.remove(f_path)
        except: pass
        time.sleep(600)

threading.Thread(target=cleanup_old_files, daemon=True).start()

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
