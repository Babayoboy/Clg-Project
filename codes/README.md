# Hnazer Lifestyle Journal

Hnazer is a browser-local lifestyle journaling and self-analysis web application. It lets a user record sleep, exercise, water intake, screen time, mood, diet, and notes, then displays rule-based scores, trends, reminders, and summaries. Accounts, profiles, and records are stored in IndexedDB in the current browser profile. There is no shared server database or multi-device sync.

Hnazer does not connect to biometric sensors or produce medically validated diagnoses. All values are entered by the user; health-related labels and recommendations are informational heuristics only.

> College term-end project (2026)
> Developer: Ansh Joshi
> License: MIT is identified by the project; a standalone `LICENSE` file is not currently present.

## Contents

- [Features](#features)
- [Requirements](#requirements)
- [Install And Run](#install-and-run)
- [Accounts And Browser Storage](#accounts-and-browser-storage)
- [Using The App](#using-the-app)
- [Daily Record Schema](#daily-record-schema)
- [Scores And Analysis](#scores-and-analysis)
- [Backup, Restore, And Export](#backup-restore-and-export)
- [AI And Privacy](#ai-and-privacy)
- [Browser Storage](#browser-storage)
- [Build And Deployment Notes](#build-and-deployment-notes)
- [Project Structure](#project-structure)
- [Known Limitations](#known-limitations)
- [Troubleshooting](#troubleshooting)

## Features

- **Browser-local accounts:** Create an account with a username, display name, and password. Accounts, profile settings, and logs are kept in this browser's IndexedDB. No email address is required.
- **Per-account records:** Each account has its own profile and daily logs. A new account starts with an empty logbook.
- **Manual daily journaling:** Record sleep, activity, water, screen time, mood, diet, date, and optional notes. Entries can be edited or deleted later.
- **Rule-based analysis:** Calculate per-day metric scores, a weighted vitality score, a recent-record burnout risk summary, and recommendations.
- **Dashboard visualizations:** Review metric panels, a multi-channel timeline, mood distribution, a six-axis score radar, a 35-day heatmap, and record history.
- **Quick hydration logging:** Add 250 ml from the hydration metric, or use the water logger controls to adjust a day's water total.
- **History tools:** Search and filter records, edit or delete entries, export CSV, export a JSON backup, and import JSON logs.
- **AI advisor:** Use the built-in deterministic analysis without sending data to an AI service, or explicitly choose Gemini for an external analysis.
- **Reference library:** Browse in-app learning material about sleep, screen breaks, hydration, and stress management.
- **Print report:** Open the report from the Print Report action in the dashboard dossier and use the browser's print dialog. The browser can save the printed view as PDF.
- **Light and dark themes:** Use the sun/moon control in the top header to switch themes. The choice is saved with the account profile.
- **Settings:** Change the display name, MRN/user ID, daily targets, screen-time ceiling, Gemini API key, and clear the current account's daily logs.

The top navigation intentionally does not contain a demo-data button or a Medical Report button. The print report remains available from the dashboard's dossier area. New accounts start with an empty logbook.

## Requirements

- Node.js and npm for development/build commands.
- A modern browser with JavaScript, IndexedDB, and Web Crypto enabled. HTTPS is required for Web Crypto outside localhost.

## Install And Run

Run commands from this project directory (the directory containing `package.json`):

```bash
npm ci
npm run dev
```

Open the Vite URL (normally [http://127.0.0.1:5173](http://127.0.0.1:5173)). Keep the development server running while using the app. Vite may select another port if 5173 is occupied.

On first launch, choose **Create account**, enter a display name and username, and create a password of at least eight characters. Account data is stored in this browser profile on this site origin. Different browsers, browser profiles, and devices have separate data stores. Clearing site data removes those accounts and records.

Useful package scripts:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Starts the Vite frontend; account storage runs in the browser. |
| `npm run build` | Creates a production frontend build in the sibling `../site` directory. |
| `npm run preview` | Serves the static production build for visual preview. |

There is currently no test, lint, or typecheck script defined in `package.json`.

## Accounts And Browser Storage

### Registration And Sign-In

- Usernames are trimmed, converted to lowercase, and must contain 3–32 letters, digits, or underscores.
- Display names are trimmed, required, and limited to 80 characters.
- Passwords must be 8–128 characters.
- Usernames are unique within this browser profile and site origin. The same username can exist in another browser or device.
- There is no email verification, password reset, account recovery, or in-app account deletion flow.
- Registration creates a default profile and an empty log array. Signing in restores that account's saved profile and logs.
- Signing out clears the current browser session. Account credentials and records remain in this browser profile.

An initial browser-local administrator account is created as `admin` / `admin1234`. Change its password after signing in from **Admin Console → Data Utilities & Backups**. The administrator can inspect only accounts stored in the same browser profile and cannot see accounts on anyone else's device. This is a local convenience feature, not a server-enforced security boundary.

IndexedDB stores account data and records on the device. It is not encrypted at rest. Browser storage may be removed by clearing site data, private browsing cleanup, or browser storage eviction. Export backups regularly and keep them somewhere secure. Data is not automatically transferred from the older SQLite version; export it before switching if the old app/database is still available.
## Using The App

### Header

- **Log Biometric Assay:** Opens the daily entry form. On small screens, the compact plus button is shown near the brand; the full action is shown on larger screens.
- **Date selector:** Chooses the date shown by the daily metric panels. The Today action returns to the current date when another date is selected.
- **AI Consultant:** Opens the local/Gemini advisor.
- **Protocols:** Opens the educational reference library.
- **Theme control:** A sun or moon icon switches between light and dark mode. The current preference is saved to the account profile.
- **Settings:** Opens profile, targets, API key, and log-purge controls.
- **Sign out:** Invalidates the current local session and returns to the account screen.

The top header does not include demo-data or report buttons. The report can be opened using **Print Report** in the dashboard dossier.

### Daily Entry

The entry form stores one log per date in the dashboard. It contains:

| Field | Unit / input | Form range or choices |
| --- | --- | --- |
| Date | `YYYY-MM-DD` | Required date input. |
| Sleep | Hours | 0–14, in 0.5-hour steps. |
| Exercise | Hours and minutes | 0–3 hours, in 0.25-hour steps. The UI also displays minutes. |
| Water | Litres | 0–6 litres, in 0.25-litre steps. |
| Screen time | Hours | 0–16 hours, in 0.5-hour steps. |
| Mood | Category | Energized, Good, Neutral, Tired, Stressed, Burnout Alert. |
| Diet | Category | Healthy, Balanced, Average, Fast Food, Irregular. |
| Notes | Free text | Optional personal notes. |

Saving calculates and stores `wellness_score` with the record. Reaching a composite score of 80 or more triggers a small confetti animation. Saving another entry for the same date replaces the previous date's entry.

### Dashboard Sections

1. **Dossier and daily status:** Displays the selected date, profile name/ID, a rule-based triage status, a print-report action, and a few illustrative status readouts.
2. **Vitality overview:** Displays today's selected log scores, recent burnout summary, recommendations, and habit-record counts.
3. **Metric cards:** Shows sleep, exercise, water, screen exposure, mood, and diet for the selected date. The hydration card includes a `+250 ml` action.
4. **Trend and mood charts:** Provides 7-day, 14-day, 30-day, and all-record views for sleep, screen time, and water, plus mood distribution and average values for the selected chart window.
5. **Six-axis radar:** Plots sleep, water, exercise, screen-time, mood, and diet scores on a polygon.
6. **35-day heatmap:** Shows the last 35 dates, color-coded by score. Selecting a day changes the dashboard's selected date.
7. **History manager:** Lists records with score, search by date or notes, mood filtering, edit/delete actions, CSV export, JSON backup/restore, and a new-entry action.

### Quick Hydration

The hydration card in the metric panel adds 0.25 litres to the selected date. The separate water-glass control allows direct adjustment and routes the difference through the same daily log update. If that date has no saved log yet, quick hydration creates one with default values for the other fields.

### Settings

Settings save these profile values:

| Setting | Default | UI range |
| --- | ---: | --- |
| Display name | Account registration name | Required text. |
| MRN / `user_id` | Database account ID | Required number. |
| Target sleep | 8 hours | 4–12 hours, 0.5-hour steps. |
| Target water | 3 litres | 1–8 litres, 0.25-litre steps. |
| Target exercise | 0.75 hours (45 minutes) | 0.25–4 hours, 0.25-hour steps. |
| Maximum screen time | 5 hours | 2–14 hours, 0.5-hour steps. |
| Gemini API key | Empty | Optional password input. |

The **Purge Dossier Ledger** action clears the current account's logs after confirmation. It does not remove the account, password hash, or profile settings.

### Print Report

The dossier's Print Report action opens a summary with averages, triage summary, alerts, recommendations, and up to 10 recent records. **Print Clinical PDF** invokes the browser print dialog; select the browser's save-as-PDF destination to create a PDF. Hnazer does not directly generate or download a PDF file.

## Daily Record Schema

The daily log object uses these fields:

| Property | Type / meaning |
| --- | --- |
| `id` | String record identifier, generally `log_YYYY-MM-DD`. |
| `user_id` | Numeric profile/MRN identifier. |
| `name` | Profile display name copied into the record when saved. |
| `date` | Date string in `YYYY-MM-DD` format; the app uses this to find/replace the day's entry. |
| `sleep_hour` | Sleep duration in hours. |
| `exercise_time` | Exercise duration in hours. |
| `water_intake` | Water intake in litres. |
| `screen_time` | Screen exposure in hours. |
| `mood` | One of the six mood categories. |
| `diet` | One of the five diet categories. |
| `notes` | Optional free text. |
| `wellness_score` | Composite score calculated when the entry is saved. |

The default account profile contains `user_id`, `name`, `target_sleep`, `target_water`, `target_exercise`, `max_screen_time`, `theme`, `ai_provider`, `gemini_api_key`, and `created_at`. Current default targets are 8 hours sleep, 3 litres water, 0.75 hours exercise, and 5 hours maximum screen time. Theme defaults to dark.

## Scores And Analysis

These calculations are implemented in `src/utils/scoring.js`; they are fixed heuristics rather than a clinically validated model.

### Per-Record Metric Scores

Each component score is between 0 and 100 before the weighted composite is computed.

| Metric | Scoring rule |
| --- | --- |
| Sleep | 7–9 h: 100; 6–under 7 h: 80; over 9–10 h: 85; 5–under 6 h: 60; 4–under 5 h: 35; under 4 h: 15; over 10 h: 65. |
| Water | `water_intake / target_water * 100`, rounded and capped at 100. |
| Exercise | `exercise_time / target_exercise * 100`, rounded and capped at 100. |
| Screen | At most 3.5 h: 100; through configured maximum: 85; through max + 2 h: 60; through max + 4 h: 35; higher: 15. |
| Mood | Energized: 100; Good: 85; Neutral: 70; Tired: 45; Stressed: 35; Burnout Alert: 15. |
| Diet | Healthy: 100; Balanced: 85; Average: 65; Fast Food: 40; Irregular: 30. |

Weighted composite:

```text
sleep 25% + exercise 20% + screen 20% + water 15% + mood 10% + diet 10%
```

The result is rounded and clamped to 0–100. The configurable target sleep affects the progress display, but the sleep score itself uses the fixed bands above.

### Recent Burnout Heuristic

The risk calculation uses up to the seven most recent **saved records** (not necessarily seven distinct consecutive calendar dates). Points are accumulated when a condition is met:

| Condition over recent records | Points |
| --- | ---: |
| Average sleep below 6 hours | 30 |
| Average screen time above 7 hours | 25 |
| Average water below 2 litres | 15 |
| Average exercise below 0.3 hours (18 minutes) | 20 |
| At least 3 records marked Tired, Stressed, or Burnout Alert | 20 |

The total is capped at 100. Under 25 points is Low, 25–49 is Moderate, and 50 or more is Critical. The engine also creates text alerts and recommendations for triggered conditions. With no logs, it returns `No Data` plus a prompt to create an entry; averages are not available in that state.

### Streak And Chart Notes

- The displayed streak/active-day helpers currently count qualifying saved records, not strictly consecutive calendar days.
- The chart's water line is scaled by 2.5 to visually compare litres to hour-scale lines; its legend calls this out.
- Heatmap values are per-record composite scores for dates in its 35-day window.
- Missing days are not generated as log records.

## Backup, Restore, And Export

### JSON Backup

The **Backup JSON** action downloads an unencrypted JSON document containing:

- app name and version;
- export timestamp;
- complete profile object;
- current account's log array.

Because the profile includes `gemini_api_key`, a JSON backup can contain that API key. Store the file securely and do not share it without removing sensitive values.

### JSON Restore

**Restore JSON** accepts either a raw array of log records or an object containing a `logs` array. Import replaces the active account's entire log array. It does not restore the profile or targets from the JSON object, and it does not validate individual record fields. Create a backup first if you need to keep the current logbook.

There is no CSV import function.

### CSV Export

CSV export includes these columns:

```text
user_id,name,date,sleep_hour,exercise_time_hours,water_intake_litres,screen_time_hours,mood,diet,notes
```

If there are no saved logs, the CSV export action does nothing. CSV export contains logs only, not account credentials or profile targets.

## AI And Privacy

### Built-In Advisor

The built-in advisor is local JavaScript rule-based analysis. It derives a recent-record summary, displays alerts, and presents a fixed action plan. It does not use a machine-learning model or send records to an account API.

### Optional Gemini Advisor

Gemini is an explicit opt-in path. When run, the browser sends the API key and a prompt to Google's Generative Language API. The prompt includes the profile name, configured targets, and up to seven recent records' dates, sleep, exercise, water, screen time, mood, and diet. It does not include the notes field. The API key is stored in the profile when saved and is included in JSON backups. Use this option only if comfortable sharing those prompt fields with Google under Google's applicable terms and privacy practices.

### Browser-Local Does Not Mean Encrypted

- Account records are stored in IndexedDB for the current browser profile and site origin. They are not sent to an app backend or shared across devices.
- Browser profile data is not encrypted at rest by this app. Someone with access to the browser profile or developer tools can inspect or change local data.
- The administrator view only sees accounts in the same browser profile. It does not provide a central admin view of visitors to a deployed site.
- `index.html` references Google Fonts, so loading the frontend may make a request to Google's font hosting service.
- The optional Gemini path sends health-related prompt data and the API key to Google.
- Exports are ordinary unencrypted files.

## Browser Storage

Account and record data are persisted in the browser's IndexedDB database named `hnazer-browser-data`. The active account identifier is kept in local storage to restore the current browser session. Password verification uses a salted PBKDF2 hash through Web Crypto. No account API or server-side database is used.

## Build And Deployment Notes

```bash
npm run build
```

Vite writes static frontend assets to `../site` relative to this project directory, normally a sibling `site` directory next to `codes`. The Vite configuration has `emptyOutDir: true`, so a build clears that output directory before writing the new build.

The build is a static frontend and can be deployed to static hosting such as Vercel. Each visitor's data remains in that visitor's browser profile and is not visible to other users or to the site owner. Changing the site origin creates a separate browser storage area. Deploying this architecture does not provide shared accounts, centralized administration, or multi-device sync.

## Project Structure

```text
codes/
|-- index.html                    # HTML entrypoint and page metadata/font links
|-- package.json                  # Dependencies and npm scripts
|-- package-lock.json             # Locked npm dependency graph
|-- vite.config.js                # Vite development server and build output
|-- tailwind.config.js            # Tailwind theme/content configuration
|-- postcss.config.js             # Tailwind and Autoprefixer processing
`-- src/
    |-- main.jsx                  # React root mount
    |-- App.jsx                   # Session gate, dashboard state and orchestration
    |-- index.css                 # Tailwind, themes, panels, animations and print styles
    |-- components/
    |   |-- AccountGate.jsx       # Sign-in and account-creation form
    |   |-- Header.jsx            # Date control, navigation, theme toggle and sign-out
    |   |-- VitalityOverview.jsx  # Composite score, risk and record-count summary
    |   |-- MetricCards.jsx       # Six daily metric summaries and quick hydration
    |   |-- AnalyticsCharts.jsx   # Trends, selected range and mood distribution
    |   |-- BurnoutRadar.jsx      # Six-axis metric score radar
    |   |-- HabitHeatmap.jsx      # 35-date score grid
    |   |-- QuickWaterLogger.jsx  # Water adjustment control
    |   |-- DailyLogModal.jsx     # Create/edit daily record form
    |   |-- HistoryManager.jsx    # Search, filter, edit/delete, JSON/CSV actions
    |   |-- AiAdvisorModal.jsx    # Built-in and Gemini advisor interface
    |   |-- EducationalHub.jsx    # In-app reference topics
    |   |-- ReportModal.jsx       # Print-formatted report
    |   `-- SettingsModal.jsx     # Profile targets, Gemini key and purge control
    `-- utils/
        |-- localAccount.js       # IndexedDB browser-local accounts, sessions, and admin tools
        |-- scoring.js            # Daily scoring, risk heuristic and recommendations
        |-- sampleData.js         # Default user profile
        |-- storage.js            # JSON/CSV export helpers and legacy localStorage helpers
        `-- aiService.js          # Local analysis and Gemini API client
```

## Known Limitations

- The current account flow has no password recovery, account deletion screen, or multi-device synchronization.
- There is no automated test or lint command in the package scripts; the production build is the available compile check.
- The modal components for daily logging, AI advisor, education, and settings currently return before executing hooks when closed. Opening one may cause a React hook-order error; this should be corrected before relying on those workflows.
- The printable report expects diagnostic averages. A new account with no saved records has no averages, so opening the report before creating a record can fail.
- The report contains illustrative/hard-coded demographic and clinical-style labels, including age/sex and pulse-like values. They are not gathered measurements. Browser printing is formatting, not clinical validation or direct PDF generation.
- Browser account data and JSON exports are not encrypted, the app has not been shown to meet healthcare regulations, and the analysis is heuristic.
- The project README metadata identifies the license as MIT, but the repository currently has no standalone `LICENSE` file. Confirm the intended license text before distributing the project.
- There is no password recovery or multi-device synchronization. Browser-local admin roles are not a security boundary against a device owner.
- Gemini is an external service and Google Fonts are remotely hosted. The application is local-first, but it is not fully network-independent in every configuration.
- Existing SQLite accounts from the earlier app version are not migrated automatically. Newly registered browser accounts start with an empty logbook.

## Troubleshooting

### Vite chooses a different port

If port 5173 is occupied, Vite reports a different local URL. Open that URL.

### The account sign-in screen cannot access storage

Use a modern browser with IndexedDB and Web Crypto enabled. If deployed, serve the site over HTTPS. Browser privacy settings or private browsing may block or clear persistent storage.

### Forgot a local password

There is no password recovery flow for browser-local accounts. The password cannot be retrieved from its hash. If you cannot sign in, you may clear this site's browser storage, but this permanently removes the accounts and records stored there.
