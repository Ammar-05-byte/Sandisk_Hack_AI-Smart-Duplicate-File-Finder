# AI Smart Duplicate File Finder
### An AI-Powered Storage Intelligence System

---

## What This Project Does

This is a full-stack web application that scans folders on your computer and intelligently finds duplicate files using AI. It goes far beyond simple duplicate detection:

- **Exact Duplicates** — Finds files that are 100% identical using SHA256 hashing
- **Image Near-Duplicates** — Finds similar-looking images even if slightly different (resolution, compression, etc.)
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

### Mac — Install Prerequisites

**Check if already installed:**
```bash
python3 --version
node --version
```

**Install Homebrew (Mac package manager):**
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**Install Python:**
```bash
brew install python
```

**Install Node.js:**
```bash
brew install node
```

---

### Windows — Install Prerequisites

**Check if already installed:**
```bash
python --version
node --version
```

**Install Python:**
1. Go to **https://python.org/downloads**
2. Download and run the installer
3. ⚠️ **Make sure to check "Add Python to PATH"** during installation

**Install Node.js:**
1. Go to **https://nodejs.org**
2. Download the **LTS version**
3. Run the installer — keep all default settings

---

## Running the Project

You need **two terminals open at the same time** — one for the backend and one for the frontend.

---

### Terminal 1 — Start the Backend

**Mac:**
```bash
cd ~/project/backend

python3 -m venv venv

source venv/bin/activate

pip3 install -r requirements.txt

python3 main.py
```

**Windows:**
```bash
cd C:\Users\YourName\project\backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

python main.py
```

**Expected output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Application startup complete.
```

Backend is now running at: **http://localhost:8000**
API documentation available at: **http://localhost:8000/docs**

> ⚠️ The first time you run a text similarity scan, the AI model (all-MiniLM-L6-v2, ~80MB) will automatically download. This is a one-time download — just wait for it to finish.

---

### Terminal 2 — Start the Frontend

**Mac & Windows (same commands):**
```bash
cd project/frontend

npm install

npm run dev
```

**Expected output:**
```
  VITE v5.x.x  ready in 500ms

  ➜  Local:   http://localhost:5173/
```

Frontend is now running at: **http://localhost:5173**

---

### Open the App

Open your browser and go to:
```
http://localhost:5173
```

---

## Every Time You Want to Run the Project Again

You don't need to reinstall anything. Just run:

**Terminal 1 — Backend:**

Mac:
```bash
cd ~/project/backend
source venv/bin/activate
python3 main.py
```

Windows:
```bash
cd C:\Users\YourName\project\backend
venv\Scripts\activate
python main.py
```

**Terminal 2 — Frontend:**

Mac & Windows:
```bash
cd project/frontend
npm run dev
```

> 💡 pip install and npm install only need to run once. After that just activate the venv and run the servers.

---

## Running in VS Code

1. Open VS Code
2. Go to **File → Open Folder** and select the `project/` folder
3. Press **Ctrl + `** to open terminal
4. Click the **+** button to open a second terminal
5. Run backend in Terminal 1 and frontend in Terminal 2 using the commands above

---

## How to Use the App

### Dashboard (Home Page)
1. Type a folder path into the input field
2. Click **SCAN →**
3. View total files, size, duplicate count, and recoverable space

### Duplicates Page
1. Enter a folder path and click **SCAN →**
2. Three tabs appear: **Exact Duplicates**, **Image Near-Dupes**, **Text Similarity**
3. Click any group to expand it and see the files
4. Click **GET RECOMMENDATION** to see which file the AI recommends keeping

### Analytics Page
1. Enter a folder path and click **SCAN →**
2. View storage breakdown, file type pie chart, CO₂ impact
3. Scroll down to see the **90-day storage forecast** chart

---

## What Path to Enter in the App

Enter the full path to any folder on your computer:

**Windows:**
```
C:\Users\YourName\Downloads
C:\Users\YourName\Documents
C:\Users\YourName\Pictures
```

**Mac:**
```
/Users/yourname/Downloads
/Users/yourname/Documents
/Users/yourname/Pictures
```

> 💡 Start with your Downloads folder — it almost always has duplicates.

---

## Pushing to GitHub

### Using Terminal

```bash
cd project
git init
touch .gitignore
git add .
git commit -m "Initial commit - AI Duplicate File Finder"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

**.gitignore contents:**
```
venv/
__pycache__/
*.pyc
*.pyo
.env
node_modules/
dist/
.DS_Store
.vscode/
*.bin
*.safetensors
```

### Using GitHub Desktop

**Push (send your changes to GitHub):**
1. Open GitHub Desktop
2. Changed files appear in the left panel
3. Write a commit message in the **Summary** box at the bottom left
4. Click **Commit to main**
5. Click **Push origin** at the top

**Pull (get changes from GitHub):**
1. Click **Fetch origin** at the top bar
2. If new changes exist, the button changes to **Pull origin**
3. Click **Pull origin**

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
| `python` not found | Use `python3` instead (Mac/Linux) |
| `pip` not found | Use `pip3` instead (Mac/Linux) |
| Port 8000 already in use | Change port in `backend/main.py` last line |
| Port 5173 already in use | Vite will auto-pick the next available port |
| CORS error in browser | Make sure backend is running on port 8000 |
| `npm install` fails | Make sure Node.js 18+ is installed |
| AI model download hangs | Wait — downloading ~80MB, can take a few minutes |
| Permission denied on folder | Choose a folder your user account has access to |
| `imagehash` install fails | Run `pip install Pillow imagehash` separately |
| Git push rejected | Run `git push -u origin main --force` |

---

## Important Notes

- **Smart Clean Mode is simulation only** — the app will never delete any files
- **Text similarity** downloads the `all-MiniLM-L6-v2` AI model (~80MB) on first use
- **Face detection** requires `opencv-python` — install with `pip install opencv-python` if needed (optional)
- Re-activating the virtual environment is required each time you open a new terminal, but `pip install` only runs once
- `npm install` only needs to run once — after that just use `npm run dev`
