# 🥗 HealthFeast: AI-Powered Personalized Diet, Nutrition & Wellness System

> *"Your Health. Your Food. Your Personalized Wellness."*

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=flat&logo=python&logoColor=white)](https://python.org)
[![Django](https://img.shields.io/badge/Django-5.2+-092E20?style=flat&logo=django&logoColor=white)](https://djangoproject.com)
[![React](https://img.shields.io/badge/React-19+-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6+-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat&logo=postgresql&logoColor=white)](https://postgresql.org)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat&logo=docker&logoColor=white)](https://docker.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## ⚕️ Medical & Clinical Disclaimer

> **Important**: HealthFeast provides general nutritional, dietary, and wellness education, calculation, and meal suggestions grounded in established scientific guidelines (ICMR-NIN 2024, WHO, FSSAI, USDA). **It is NOT a medical diagnosis, clinical prescription, or cure for any medical condition.**
>
> Users with diagnosed chronic diseases (such as chronic kidney disease, severe diabetes, cardiovascular conditions), pregnant or nursing mothers, or those experiencing eating disorders should consult a registered dietitian, physician, or qualified healthcare professional before undertaking major dietary modifications.

---

## 🌟 Overview & Key Highlights

**HealthFeast** is a complete, production-grade, full-stack health-tech application that synthesizes human biometrics, dietary preferences, medical safety constraints, lifestyle patterns, and authentic Indian culinary traditions into intelligent, adaptive meal planning and wellness management.

Unlike static calorie trackers or generic chatbots, HealthFeast combines:
1. **Deterministic Safety Core**: Strict mathematical and biochemical guardrails (zero allergens, condition contraindication checks, calorie biological safety floors).
2. **Evidence-Based Knowledge Retrieval (RAG)**: Real-time authoritative grounding from ICMR-NIN (National Institute of Nutrition), WHO, and FSSAI guidelines with explicit source citations.
3. **Authentic Indian Culinary Database**: 40+ curated Indian foods spanning breakfast staples, pulses, grains, vegetables, and snacks, verified with calorie and macro profiles.
4. **Computer Vision Food Scanner**: Multimodal recognition powered by Gemini 3.8 Flash Vision, with an instant OpenCV edge color-texture heuristic fallback.
5. **Adaptive Personalization Engine**: Continuously learns from logged meals, skipped foods, and rating feedback to fine-tune future plans.
6. **Holistic Skin & Lifestyle Wellness**: Tracks hydration, sleep, stress, and exercise to calculate a Glow & Skin Health Score.

---

## 🏛️ System Architecture

```text
┌────────────────────────────────────────────────────────────────────────┐
│                   HealthFeast React 19 Frontend                        │
│   (Vite, Recharts, Lucide Icons, Glassmorphic UI, AuthContext)         │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP / REST + Bearer JWT
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   Django 5.2 / DRF Backend Core                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │   REST API Controllers (/api/auth, /api/diet, /api/food, etc.) │   │
│   └───────────────┬────────────────────────────────┬───────────────┘   │
│                   ▼                                ▼                   │
│   ┌──────────────────────────────┐ ┌───────────────────────────────┐   │
│   │   Deterministic Safety Rules │ │   Nutrition Math Engine       │   │
│   │   - Allergen filter          │ │   - Mifflin-St Jeor BMR       │   │
│   │   - Health condition rules   │ │   - TDEE & Goal Calorie Floors│   │
│   │   - Unsafe food combinations │ │   - Macro splits & Hydration  │   │
│   └───────────────┬──────────────┘ └───────────────┬───────────────┘   │
│                   │                                │                   │
│                   ▼                                ▼                   │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │            7-Day Adaptive Meal Recommendation Engine           │   │
│   └───────────────┬────────────────────────────────┬───────────────┘   │
│                   ▼                                ▼                   │
│   ┌──────────────────────────────┐ ┌───────────────────────────────┐   │
│   │   Multimodal AI Vision & NLP │ │   Authoritative Knowledge RAG │   │
│   │   - Gemini 3.8 Flash         │ │   - ICMR-NIN 2024 Guidelines  │   │
│   │   - OpenCV edge classifier   │ │   - WHO & FSSAI Standards     │   │
│   └──────────────────────────────┘ └───────────────────────────────┘   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ ORM
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│            Database: PostgreSQL 16 (or SQLite Fallback)                │
│    21 Relational Models (User, HealthProfile, Food, MealPlan, Logs)    │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Features & Modules

### 1. Smart Dynamic Health Onboarding
- Multi-step guided interview gathering biometrics, lifestyle, budget (₹150 - ₹400+/day), cuisine, allergies, and diagnosed conditions.
- Contextual follow-up hints (e.g. medical disclaimer reminders on selecting renal or diabetes restrictions).

### 2. Precise Nutrition & Metabolic Calculations
- **BMR**: Mifflin-St Jeor equation accounting for gender, weight, height, and age.
- **TDEE**: Multiplied by physical activity factor (Sedentary 1.2 to Very Active 1.9).
- **Goal Targets**: Controlled surpluses/deficits with biological safety floors (1200 kcal/day for women, 1500 kcal/day for men).
- **Macronutrient Splits**: Protein, carbs, fats, minimum daily dietary fiber (25–38g), and baseline hydration based on body weight.

### 3. Seven-Day Personalized Meal Planner (Mon–Sun)
- Generates 5 meals per day (Breakfast, Mid-morning snack, Lunch, Evening snack, Dinner).
- Macro-compatible **food substitution modal** (replaces dishes while maintaining nutrition).
- Real-time **Mark Eaten** and **Skip Meal** logging with instant daily calorie recalculation.
- Budget-sensitive portioning.

### 4. Deterministic Health & Safety Layer
- Absolute allergen filtering (Peanuts, Tree nuts, Milk, Eggs, Seafood, Soy, Gluten).
- Condition-specific biochemical constraints:
  - **Diabetes**: Carb moderation, high-GI restriction, fiber-rich priority.
  - **Hypertension**: Sodium awareness, potassium and antioxidant priority.
  - **PCOS**: Insulin-stabilizing complex carbohydrates and anti-inflammatory foods.
  - **Fatty Liver**: Low saturated fat, omega-3, cruciferous and whole food emphasis.
  - **Kidney Restrictions**: Phosphorus and high-potassium warnings; urges clinical guidance.

### 5. Computer Vision Food Scanner
- Drag-and-drop or camera capture of meal photos.
- Multimodal analysis via **Gemini 3.8 Flash Vision**.
- Offline / keyless fallback via **OpenCV visual color-texture analyzer** with nutritional estimates.

### 6. Glow & Skin Wellness Engine
- Computes a holistic **Skin Wellness Score (0–100)** based on hydration, sleep, exercise, and antioxidants.
- Provides actionable skincare dietary habits and anti-inflammatory Indian superfood suggestions (Amla, Turmeric, Walnuts, Papaya, Chia seeds).

### 7. Kitchen Fridge Matcher ("What Can I Eat?")
- Enter ingredients already in your pantry or fridge (e.g., *poha, curd, onions*).
- System checks your medical profile, allergies, and daily calorie allowance to suggest safe, nutritious recipes.

### 8. Automated 7-Day Grocery List
- Automatically compiles every ingredient needed for the active 7-day meal plan.
- Categorized by **Produce**, **Grains & Cereals**, **Dairy & Proteins**, and **Pantry & Spices**.
- Interactive checkboxes to cross off items while shopping.

### 9. Context-Aware AI Health Assistant ("Ask AI")
- Accessible from any page via a floating drawer.
- Always retains user profile, today's eaten macros, allergies, and conditions.
- Cites verified sources (ICMR-NIN, WHO, FSSAI) with live reference tags.

### 10. Admin Analytics Dashboard
- Superuser analytics showing total registered users, food items by category, active meal plans, and data source freshness.

---

## 🔑 Pre-Configured Test Credentials

The database comes pre-seeded with two ready-to-test accounts:

| Role | Username | Password | Notes |
|---|---|---|---|
| **Demo User** | `demo_user` | `HealthFeast123!` | Complete sample profile (Vegetarian, Weight Loss, Skin Goal, active meal plan) |
| **Administrator** | `admin` | `AdminFeast123!` | Superuser with access to `/admin` and Admin Dashboard |

---

## 🛠️ Tech Stack Details

- **Frontend**: React 19, Vite 6, Tailwind/CSS3 Glassmorphism System, Recharts, Lucide React, Canvas Confetti.
- **Backend**: Python 3.11+, Django 5.2, Django REST Framework 3.18, SimpleJWT 5.5, django-cors-headers.
- **AI / Multimodal**: Google GenAI SDK (`google-genai`), Gemini 3.8 Flash, OpenCV (`opencv-python`), Scikit-learn, Pandas, NumPy.
- **Database**: PostgreSQL 16 (production) with automatic SQLite3 fallback (development).
- **Deployment**: Docker, Docker Compose, Nginx, Gunicorn, Railway, Render, Vercel.

---

## 💻 Local Setup & Execution Guide

### Prerequisites
- Python 3.11+
- Node.js 18+ and npm
- Git

### 1. Backend Setup

```bash
# Clone the repository
git clone https://github.com/your-username/Healthfeast.git
cd Healthfeast/backend

# Create and activate Python virtual environment
# Windows:
python -m venv .venv
.\.venv\Scripts\activate
# Linux / macOS:
# python3 -m venv .venv
# source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Seed authentic Indian food database and demo users
python manage.py seed_data

# Start Django development server
python manage.py runserver 127.0.0.1:8001
```

The Django REST API will be live at `http://127.0.0.1:8001/` by default (use `PORT=8002` if 8001 is already occupied).
On Windows, `run_backend.bat` applies migrations and seeds the database before starting the server; `run_all.bat` starts both backend and frontend.

### 2. Frontend Setup

In a new terminal window:

```bash
cd Healthfeast/frontend

# Install frontend dependencies
npm install

# Start Vite development server
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🐳 Docker Compose Quickstart

Run the complete multi-container stack (PostgreSQL + Django Backend + React/Nginx Frontend) with one command:

```bash
# From the project root
docker-compose up --build
```

- **Frontend Application**: `http://localhost:5173` (or `http://localhost:8080`)
- **Backend API**: `http://localhost:8001/api`
- **Django Admin**: `http://localhost:8001/admin`

---

## 🧪 Automated Testing

HealthFeast includes an automated test suite verifying nutrition mathematics, deterministic safety constraints, calorie floors, live knowledge retrieval, and API endpoints.

```bash
cd backend
python manage.py test
```

All 14 comprehensive test cases will run and report status:
```text
Creating test database for alias 'default'...
..............
Ran 14 tests in 13.039s

OK
```

---

## 🌐 Environment Variables Configuration

Copy `.env.example` to `.env` in the project root:

```bash
cp .env.example .env
```

| Variable | Description | Default |
|---|---|---|
| `DJANGO_SECRET_KEY` | Secret key for Django cryptographic signing | `insecure-dev-key` |
| `DJANGO_DEBUG` | Enables/disables debug mode (`True` or `False`) | `True` |
| `ALLOWED_HOSTS` | Comma-separated list of allowed hostnames | `*` |
| `DATABASE_URL` | PostgreSQL connection URL (e.g. on Railway/Render) | Local SQLite if empty |
| `GEMINI_API_KEY` | Google Gemini API key for live LLM and vision scanner | Optional (demo fallback active) |
| `GEMINI_MODEL` | Gemini model variant | `gemini-3.8-flash` |
| `DEMO_MODE` | Enable deterministic fallback when API key is missing | `True` |

---

## 📡 REST API Reference

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register/` | Register new user with profile & health data | No |
| `POST` | `/api/auth/login/` | Obtain JWT access and refresh tokens | No |
| `GET` | `/api/auth/profile/` | Retrieve user health profile & biometrics | Yes |
| `PUT` | `/api/auth/profile/` | Update biometrics, goals, or preferences | Yes |
| `GET` | `/api/health/analyze/` | Calculate BMI, BMR, TDEE, macros & hydration | Yes |
| `GET` | `/api/diet/weekly/` | Retrieve 7-day personalized meal plan | Yes |
| `POST` | `/api/diet/generate/` | Generate or refresh 7-day meal plan | Yes |
| `POST` | `/api/diet/replace/` | Replace an individual meal or food item | Yes |
| `POST` | `/api/diet/mark-eaten/` | Mark meal as eaten and record food log | Yes |
| `POST` | `/api/diet/skip-meal/` | Mark meal as skipped with reason | Yes |
| `GET` | `/api/food/search/` | Search food database with filters | Yes |
| `POST` | `/api/food/scanner/` | Multimodal food image recognition | Yes |
| `POST` | `/api/food/what-can-i-eat/` | Match available pantry ingredients | Yes |
| `POST` | `/api/ai/chat/` | Conversational assistant with RAG citations | Yes |
| `GET` | `/api/wellness/skin/` | Skin Wellness score and recommendations | Yes |
| `GET` | `/api/grocery/generate/` | Compile categorized 7-day grocery list | Yes |
| `GET/POST`| `/api/tracking/water/` | View or log daily hydration (ml) | Yes |
| `GET/POST`| `/api/tracking/exercise/`| View or log physical activities & calories | Yes |
| `GET` | `/api/tracking/progress/` | View weight, calorie, and goal trends | Yes |
| `GET` | `/api/tracking/adaptive/` | Retrieve weekly adaptive AI recommendations | Yes |
| `GET` | `/api/admin/metrics/` | Admin health metrics & database counts | Superuser |

---

## ☁️ Deployment Guidelines

### Frontend on Vercel
1. Set the root directory to `frontend`.
2. Build command: `npm run build`.
3. Output directory: `dist`.
4. Environment variable: `VITE_API_URL=https://your-backend.railway.app/api`.
5. The included `frontend/vercel.json` ensures SPA client-side routes work seamlessly.

### Backend on Railway / Render
1. Connect repository with root directory `backend`.
2. Attach a managed PostgreSQL database.
3. Railway automatically detects `backend/Procfile` and `requirements.txt`.
4. Set environment variables: `DATABASE_URL`, `DJANGO_SECRET_KEY`, `DJANGO_DEBUG=False`, `ALLOWED_HOSTS=*`, `GEMINI_API_KEY`.
5. Run command: `gunicorn healthfeast.wsgi:application --bind 0.0.0.0:$PORT --workers 3`.

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).
