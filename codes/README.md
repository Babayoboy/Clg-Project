# Hnazer • Personal Lifestyle & Health Self-Analysis Platform

> **Open-Source College Term-End Project (2026)**  
> **Developer:** Ansh Joshi  
> **License:** MIT License  

---

## 🌟 Overview
**Hnazer** is an open-source, privacy-first, web-based self-analysis platform built with **React 18** and **Tailwind CSS**. It is designed to help individuals monitor, understand, and optimize their daily routine habits.

By systematically logging and analyzing critical biometric and behavioral indicators—**sleep duration**, **physical activity**, **water intake**, **screen time exposure**, and **daily mood**—Hnazer converts raw daily routines into intuitive visual intelligence, helping users prevent burnout and cultivate sustainable health habits.

---

## 📊 Core Features & System Architecture

### 1. 100% Privacy & Client-Side Data Storage
- Complies strictly with the IGNOU Project Synopsis (Sections 1.4 & 2.2).
- Non-AI tracking data remains **100% on the user's local device** using `localStorage` / `IndexedDB`.
- Complete user sovereignty with **JSON backup/restore** and **CSV export** for spreadsheet analysis.

### 2. Biometric Metrics & Data Dictionary
Directly aligns with the project data dictionary:
- `user_id`: Unique identifier
- `name`: User profile name
- `date`: Record timestamp (YYYY-MM-DD)
- `sleep_hour`: Nightly sleep duration (hours) with circadian rest analysis
- `exercise_time`: Physical workout / walk duration (hours/minutes)
- `water_intake`: Hydration tracking (Litres) with interactive 250ml glass logging
- `screen_time`: Daily display exposure (hours) with 20-20-20 digital fatigue alerts
- `mood`: Daily emotional state (Energized, Good, Neutral, Tired, Stressed, Burnout Alert)
- `diet`: Dietary quality (Healthy, Balanced, Average, Fast Food, Irregular)
- `notes`: Personal trigger and reflection journal

### 3. Visual Analytics & Diagnostic Gauges
- **Composite Vitality Index (0–100 PTS)**: Weighted daily health score with animated circular progress dial.
- **Burnout Risk Index Radar**: 6-axis equilibrium polygon diagnosing physical, digital, and mental strain.
- **Multi-Metric Trend Timeline**: Interactive SVG chart comparing sleep vs. screen exposure over 7, 14, 30, or all days.
- **35-Day Consistency Heatmap**: GitHub-style visual habit grid.
- **Mood Distribution Bar**: Emotional distribution breakdown.

### 4. Smart AI & Diagnostic Intelligence
- **On-Device Private Diagnostics Engine (Default)**: Instant rule-based circadian analysis, sleep debt calculation, and actionable habit roadmaps running completely offline.
- **Optional Google Gemini AI Integration (Opt-In)**: Generative coaching synthesis using the user's custom API key with transparent privacy disclosures.

### 5. Academic & Evaluation Utilities
- **Preloaded 14-Day Realistic Demo Dataset**: Instant one-click test data for viva presentations and examiners.
- **Official Print-Ready PDF / Project Summary Report**: Formatted clinical summary report with candidate info, KPIs, anomalies, and habit recommendations.
- **Educational Self-Help Library**: Evidence-based guides on Circadian Biology, the 20-20-20 Rule, Metabolic Hydration, and 4-7-8 Breathing.

---

## 🚀 Getting Started

### Method 1: Development Server (Vite)
Navigate to the `codes` directory:
```bash
cd codes
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

### Method 2: Production Build
```bash
npm run build
```
This builds the optimized production assets directly into `site/`.

### Method 3: Instant Browser Preview (Zero Installation)
Open [`site/index.html`](../site/index.html) directly in any modern web browser (Chrome, Firefox, Edge, Safari) without needing Node.js or any command line setup.

---

## 📁 Project Structure
```
codes/
├── package.json               # Dependencies & scripts
├── vite.config.js             # Vite configuration
├── tailwind.config.js         # Tailwind theme & color tokens
├── postcss.config.js          # PostCSS configuration
├── index.html                 # Vite HTML entrypoint
├── README.md                  # Comprehensive documentation
└── src/
    ├── main.jsx               # React 18 DOM mount
    ├── App.jsx                # Core application dashboard
    ├── index.css              # Design tokens & glassmorphism
    ├── components/
    │   ├── Header.jsx         # Navigation, date controller & CTAs
    │   ├── VitalityOverview.jsx # Score dial, burnout index & streaks
    │   ├── MetricCards.jsx    # 6 Data Dictionary KPI cards
    │   ├── AnalyticsCharts.jsx# Timeline & correlation graphs
    │   ├── BurnoutRadar.jsx   # 6-axis lifestyle balance radar
    │   ├── HabitHeatmap.jsx   # 35-day habit consistency grid
    │   ├── QuickWaterLogger.jsx# Animated fluid water glass
    │   ├── DailyLogModal.jsx  # Habit logging modal with sliders
    │   ├── HistoryManager.jsx # Database table, CSV/JSON export/import
    │   ├── AiAdvisorModal.jsx # On-device engine + Gemini AI
    │   ├── EducationalHub.jsx # Evidence-based self-help guides
    │   ├── ReportModal.jsx    # Printable College Project summary report
    │   └── SettingsModal.jsx  # Profile, target goals & data management
    └── utils/
        ├── scoring.js         # Vitality & burnout scoring logic
        ├── sampleData.js      # 14-day sample dataset & defaults
        ├── storage.js         # LocalStorage persistence & file export
        └── aiService.js       # AI reasoning & Gemini API bridge
```
