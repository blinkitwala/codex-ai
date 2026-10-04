# Codex_AI - Production-Ready AI Assistant Web App
**Created by Shreyash and Sibtain**

![Codex_AI Banner](/public/icon-512.png)

Codex_AI is a complete, production-ready AI assistant web app built with Next.js, React, Tailwind CSS, Framer Motion, and Node.js. It works seamlessly across both desktop and mobile devices and is fully installable as a Progressive Web App (PWA).

---

## 🌟 Key Features

1. **Top Header & Branding**:
   - Displays **"Created by Shreyash and Sibtain"** at the very top of every page with **"Codex_AI"** directly below it as the main title.

2. **UI & Aesthetic Design**:
   - Dark yellow/gold/cyan mesh gradient ambient background.
   - Glassmorphic card containers (`backdrop-blur-2xl bg-black/60`).
   - Central animated iridescent multi-color orb ball (with glowing white eyes) for thinking, loading, and voice mode.
   - Large rounded frosted capsule input box with attachment handler, model selector badge, search toggles, and send button.
   - 4 glassmorphic feature quick cards ("Multi-Engine Web Search", "Deep Research Mode", "Code & Math Solution", "Deep Male Voice Chat").
   - Collapsible desktop sidebar & mobile drawer with date categories (*Today*, *Yesterday*, *3 days ago*, *7 days ago*, *Last 30 days*).

3. **Authentication & Security**:
   - Email/Password sign up and log in with bcrypt password hashing and JWT cookie sessions.
   - Google login single-click integration.
   - Zero API key prompt in UI! All API keys are securely managed on the backend via environment variables.

4. **AI Engine & Streaming**:
   - Typewriter server-sent streaming responses (ReadableStream).
   - Multi-provider support (Gemini, OpenAI, Anthropic, Groq) with an intelligent built-in fallback streaming engine that works out-of-the-box even without paid keys.
   - Handles code, general knowledge, math equations, document attachments, and image analysis.
   - Markdown formatting with code syntax highlighting, copy code buttons, and LaTeX math formatting.

5. **Multi-Engine Search & Deep Search System**:
   - Backend search integration across Google, Bing, DuckDuckGo, and Brave.
   - Search tabs for **Web**, **Images**, **News**, and **Videos**.
   - Direct answers with inline citations `[1]`, `[2]` and source preview cards.
   - **Deep Search** toggle: runs multi-step search queries, reads top pages, and writes a detailed sourced report.

6. **Hands-Free Deep Natural Male Voice**:
   - Speech-to-Text (STT) microphone input via Web Speech API.
   - Text-to-Speech (TTS) output in a **deep, natural male voice** (pitch 0.75, speed 0.92x).
   - Voice Mode overlay with the glowing animated orb ball reacting to audio.
   - Controls for pitch, speech rate, pause, resume, and stop.

7. **PWA (Progressive Web App)**:
   - `manifest.json`, Service Worker (`sw.js`), custom 192x192 & 512x512 icons, and direct PWA installation prompt.

---

## 🚀 Local Setup Instructions

### Prerequisites:
- Node.js (v18+ or v20+ recommended)
- npm or yarn

### Steps:
1. **Clone or Navigate to Project Directory**:
   ```bash
   cd excited-planck
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   *(Optional: Add your `GEMINI_API_KEY`, `OPENAI_API_KEY`, or `SERPER_API_KEY` in `.env.local`. If left empty, Codex_AI uses its intelligent fallback engine.)*

4. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

5. **Build for Production**:
   ```bash
   npm run build
   npm start
   ```

---

## 🌐 Deployment Instructions

### Option A: Deploy on Vercel (Recommended)
1. Push this repository to GitHub / GitLab / Bitbucket.
2. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your repository.
4. Set Framework Preset to **Next.js**.
5. Add Environment Variables (from `.env.example`):
   - `JWT_SECRET`: (e.g. `your_secret_key`)
   - `GEMINI_API_KEY` (Optional)
   - `OPENAI_API_KEY` (Optional)
   - `SERPER_API_KEY` (Optional)
6. Click **Deploy**. Vercel will automatically build and deploy your PWA!

### Option B: Deploy on Render
1. Go to [Render.com](https://render.com) and create a **Web Service**.
2. Connect your GitHub repository.
3. Configure settings:
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. Add Environment Variables under **Environment**:
   - `NODE_ENV`: `production`
   - `JWT_SECRET`: `your_random_secret_string`
5. Click **Create Web Service**.

---

## 📱 PWA App Installation Steps

### 1. Android Phone (Chrome / Brave / Edge)
1. Open the deployed **Codex_AI** web app link in Chrome on your Android device.
2. Click the top-right menu (⋮) or tap the **"Install App"** button at the top header of Codex_AI.
3. Select **"Install App"** / **"Add to Home screen"**.
4. Codex_AI will be added to your app drawer and home screen as a standalone app!

### 2. iPhone / iPad (Safari)
1. Open the **Codex_AI** web app link in **Safari**.
2. Tap the **Share** button (box with an arrow pointing up at the bottom bar).
3. Scroll down and tap **"Add to Home Screen"**.
4. Confirm by tapping **"Add"**. Codex_AI will open fullscreen without Safari browser bars!

### 3. Windows / Mac (Chrome / Edge / Brave Desktop)
1. Open **Codex_AI** in Chrome, Microsoft Edge, or Brave.
2. Click the **"Install App"** button in the header OR click the install icon (⬇️) on the right side of the browser address bar.
3. Click **Install**. Codex_AI will launch in its own window and get added to your Start Menu / Launchpad!

---

## 👨‍💻 Author & Credits
- **Developers**: Shreyash and Sibtain
- **App Name**: Codex_AI
