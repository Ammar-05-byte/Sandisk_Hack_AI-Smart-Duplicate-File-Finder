# AI Smart Duplicate File Finder
### An AI-Powered Storage Intelligence System

---

## What This Project Does

This is a full-stack web application that scans folders on your computer and intelligently finds duplicate files using AI. It goes far beyond simple duplicate detection:

- **Exact Duplicates** — Finds files that are 100% identical using SHA256 hashing
- **Image Near-Duplicates** — Finds similar-looking images even if they're slightly different (different resolution, compression, etc.)
- **Text Similarity** — Finds documents with similar content using AI sentence embeddings
- **AI Recommendation Engine** — Tells you which duplicate to keep based on recency, resolution, folder priority, and file size
- **Storage Analytics** — Shows charts of your file types, wasted space, and CO₂ impact
- **Storage Forecast** — Predicts when your disk will be full using linear regression
- **Emotional Protection** — Flags images containing faces as "High Emotional Importance"
- **Smart Clean Mode** — Simulates what would be deleted (no actual files are removed)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Python 3.11, FastAPI, Uvicorn |
| AI / ML | Sentence Transformers, scikit-learn, imagehash |
| Image Processing | Pillow |
| Data | NumPy, Pandas |
| Frontend | React (Vite), TailwindCSS |
| Charts | Recharts |
| HTTP Client | Axios |

---

## Project Structure

```
project/
├── backend/
│   ├── main.py                       # FastAPI app entry point
│   ├── requirements.txt              # Python dependencies
│   ├── routers/
│   │   ├── scan.py                   # POST /scan
│   │   ├── duplicates.py             # POST /duplicates/exact|image|text
│   │   ├── analytics.py              # GET /analytics/storage|predict
│   │   └── recommendation.py        # POST /recommend, /recommend/clean
│   ├── services/
│   │   ├── file_scanner.py           # Directory traversal logic
│   │   ├── hash_service.py           # SHA256 exact duplicate detection
│   │   ├── image_similarity.py       # Perceptual hash image detection
│   │   ├── text_similarity.py        # Sentence embedding text similarity
│   │   ├── recommendation_engine.py  # Multi-factor AI scoring
│   │   └── storage_predictor.py      # Linear regression forecasting
│   ├── models/
│   │   └── schemas.py                # Pydantic request/response models
│   └── utils/
│       └── helpers.py                # Shared utility functions
│
└── frontend/
    ├── index.html
    ├── package.json                  # Node dependencies
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── public/
    │   └── vite.svg                  # Favicon
    └── src/
        ├── main.jsx                  # React entry point
        ├── App.jsx                   # App shell + routing
        ├── api.js                    # Axios API calls
        ├── utils.js                  # Formatting helpers
        ├── index.css                 # Global styles + animations
        ├── components/
        │   ├── DirectoryInput.jsx    # Path input + scan button
        │   ├── StatCard.jsx          # Metric display card
        │   ├── DuplicateTable.jsx    # Collapsible duplicate groups
        │   ├── RecommendationCard.jsx# AI recommendation with score bars
        │   ├── StorageAnalyticsCharts.jsx # Pie + bar charts
        │   └── PredictionCard.jsx    # Storage forecast line chart
        └── pages/
            ├── Dashboard.jsx         # Home page overview
            ├── DuplicatesPage.jsx    # Duplicate detection results
            └── AnalyticsPage.jsx     # Storage analytics + forecast
```

---

## Prerequisites

Before running, make sure you have these installed:

### Python 3.11+
Download from: https://python.org/downloads

Check it's installed:
```bash
python --version
# Should show: Python 3.11.x or higher
```

### Node.js 18+
Download from: https://nodejs.org

Check it's installed:
```bash
node --version
# Should show: v18.x.x or higher
```

---

## Running in VS Code (Recommended)

### Step 1 — Open the Project

1. Open **VS Code**
2. Go to **File → Open Folder**
3. Select the `project/` folder

### Step 2 — Open Two Terminals

Press **Ctrl + `** (backtick) to open a terminal.
Click the **+** button in the terminal panel to open a second one.

You need **two terminals running at the same time** — one for backend, one for frontend.

---

### Terminal 1 — Start the Backend

```bash
# Navigate into the backend folder
cd backend

# Create a Python virtual environment
python -m venv venv

# Activate the virtual environment
source venv/bin/activate          # Mac / Linux
venv\Scripts\activate             # Windows

# Install all Python dependencies
pip install -r requirements.txt

# Start the backend server
python main.py
```

**Expected output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Application startup complete.
```

> ⚠️ The first time you run a text similarity scan, the AI model (`all-MiniLM-L6-v2`, ~80MB) will automatically download. This is a one-time download — just wait for it to finish.

Backend is now running at: **http://localhost:8000**
API documentation available at: **http://localhost:8000/docs**

---

### Terminal 2 — Start the Frontend

```bash
# Navigate into the frontend folder
cd frontend

# Install Node dependencies (only needed once)
npm install

# Start the development server
npm run dev
```

**Expected output:**
```
  VITE v5.x.x  ready in 500ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Frontend is now running at: **http://localhost:5173**

---

### Step 3 — Open the App

Open your browser and go to:
```
http://localhost:5173
```

---

## Running Without VS Code (Command Line)

If you prefer plain terminal:

**Terminal 1 — Backend:**
```bash
cd project/backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

**Terminal 2 — Frontend:**
```bash
cd project/frontend
npm install
npm run dev
```

Then open **http://localhost:5173** in your browser.

---

## How to Use the App

### Dashboard (Home Page)
1. Type a folder path into the input field (see examples below)
2. Click **SCAN →**
3. View total files, size, duplicate count, and recoverable space

### Duplicates Page
1. Enter a folder path and click **SCAN →**
2. Three tabs appear: **Exact Duplicates**, **Image Near-Dupes**, **Text Similarity**
3. Click any group to expand it and see the files
4. Click **◈ GET RECOMMENDATION** to see which file the AI recommends keeping

### Analytics Page
1. Enter a folder path and click **SCAN →**
2. View storage breakdown, file type pie chart, CO₂ impact
3. Scroll down to see the **90-day storage forecast** chart

---

## What Path to Enter

Enter the full path to any folder on your computer:

**Windows examples:**
```
C:\Users\YourName\Downloads
C:\Users\YourName\Documents
C:\Users\YourName\Pictures
```

**Mac examples:**
```
/Users/yourname/Downloads
/Users/yourname/Documents
/Users/yourname/Pictures
```

**Linux examples:**
```
/home/yourname/Downloads
/home/yourname/Documents
/home/yourname/Pictures
```

> 💡 **Tip:** Start with your `Downloads` folder — it almost always contains duplicates.

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/scan` | Scan directory, return file metadata |
| POST | `/duplicates/exact` | SHA256 exact duplicate detection |
| POST | `/duplicates/image` | Perceptual hash image near-duplicate detection |
| POST | `/duplicates/text` | Sentence embedding text similarity |
| POST | `/recommend` | AI recommendation — which file to keep |
| POST | `/recommend/clean` | Smart clean simulation (no files deleted) |
| GET | `/analytics/storage?directory=` | Storage analytics and file type distribution |
| GET | `/analytics/predict?directory=` | 90-day storage growth prediction |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `python` not found | Try `python3` instead |
| `pip` not found | Try `pip3` instead |
| Port 8000 already in use | Change port in `backend/main.py` last line |
| Port 5173 already in use | Vite will auto-pick the next available port |
| CORS error in browser | Make sure the backend is running on port 8000 |
| `npm install` fails | Make sure Node.js 18+ is installed |
| AI model download hangs | Wait — it's downloading ~80MB, can take a few minutes |
| Permission denied on folder | Choose a folder your user account has access to |
| `imagehash` install fails | Run `pip install Pillow imagehash` separately |

---

## Important Notes

- **Smart Clean Mode is simulation only** — the app will never delete any files on your computer
- **Text similarity** downloads the `all-MiniLM-L6-v2` AI model (~80MB) on first use
- **Face detection** requires `opencv-python` — install with `pip install opencv-python` if needed (optional, app works without it)
- Re-activating the virtual environment (`source venv/bin/activate`) is required each time you open a new terminal session, but `pip install` only needs to run once
- `npm install` only needs to run once — after that just use `npm run dev`
