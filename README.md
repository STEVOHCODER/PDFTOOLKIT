# Smart PDF Pro: Monetized PDF Suite

## How it works
This application is a specialized wrapper that leverages:
1.  **pdfplumber (Python):** For high-precision text and table extraction. This is the "Data Extraction" feature in the UI.
2.  **Stirling-PDF (Logic Patterns):** We use a FastAPI backend that mimics the processing patterns of Stirling-PDF for utility tasks like merging and splitting PDFs using standard Python libraries (`pypdf`).

## Monetization Strategy
The app is designed to be ad-supported:
- **Banner Ads:** Strategically placed in the header, footer, sidebars, and between tool sections.
- **Components:** See `frontend/src/components/AdBanner.tsx`. To go live, replace the placeholder `div` with your Google AdSense `ins` tag code.
- **Premium Model:** The UI includes a "Go Premium" button placeholder. You can implement a subscription logic to hide ads and allow larger file uploads.

## How to Run

### 1. Start the Backend (Python)
```bash
cd backend
python main.py
```
The API will run on `http://localhost:8000`.

### 2. Start the Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```
The UI will be available at `http://localhost:3000`.

## Key Files
- `frontend/src/app/page.tsx`: Landing page with ad placements.
- `frontend/src/app/tools/extract/page.tsx`: The pdfplumber-powered extraction interface.
- `backend/main.py`: FastAPI routes for PDF processing.
