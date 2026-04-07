# GPU Explorer — Setup & Deployment Guide

## 📁 File Structure

```
gpu-explorer/
├── index.html          ← Wormhole intro screen
├── login.html          ← Team + member login
├── rules.html          ← Rules, roles & judging criteria
├── level1.html         ← CPU vs GPU quiz game
├── level2.html         ← Hardware drag-and-drop puzzle
├── final.html          ← Score display + Firebase submit
├── leaderboard.html    ← Live real-time team rankings
├── server.js           ← Express server for Render
├── package.json        ← Node dependencies
├── css/
│   └── style.css       ← Full design system
└── js/
    ├── game.js         ← Shared state, questions, utilities
    └── firebase.js     ← Firebase SDK + all DB functions
```

---

## 🔥 STEP 1: Set Up Firebase

### A. Create Project
1. Go to https://console.firebase.google.com
2. Click **"Create Project"**
3. Name: `gpu-explorer` (or anything)
4. Disable Google Analytics (optional)
5. Click **Create Project**

### B. Create Firestore Database
1. In left sidebar → **Firestore Database**
2. Click **"Create Database"**
3. Choose **"Start in test mode"** ← IMPORTANT for now
4. Select region closest to you (e.g., `asia-south1` for India)
5. Click **Done**

### C. Add Web App
1. Go to **Project Settings** (gear icon, top left)
2. Scroll down → Click **</>** (Web App icon)
3. App nickname: `gpu-game`
4. Click **Register App**
5. You'll get a config block like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "gpu-explorer-xxx.firebaseapp.com",
  projectId: "gpu-explorer-xxx",
  storageBucket: "gpu-explorer-xxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### D. Paste Config into firebase.js
Open `js/firebase.js` and replace the placeholder values:
```javascript
export const firebaseConfig = {
  apiKey:            "PASTE_YOUR_API_KEY",
  authDomain:        "PASTE_YOUR_AUTH_DOMAIN",
  projectId:         "PASTE_YOUR_PROJECT_ID",
  storageBucket:     "PASTE_YOUR_STORAGE_BUCKET",
  messagingSenderId: "PASTE_YOUR_SENDER_ID",
  appId:             "PASTE_YOUR_APP_ID"
};
```

### E. Firestore Security Rules (for demo)
In Firestore → **Rules** tab, paste:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```
Click **Publish**.
> ⚠️ This allows all access — fine for demo. Add auth rules after the event.

---

## 🚀 STEP 2: Deploy to Render

### A. Push to GitHub first
1. Create a new GitHub repository (e.g., `gpu-explorer`)
2. Inside your project folder, run:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/gpu-explorer.git
git push -u origin main
```

### B. Deploy on Render
1. Go to https://render.com and sign up / log in
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub account → select `gpu-explorer` repo
4. Configure:
   - **Name:** `gpu-explorer`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Region:** Choose closest to your users
5. Click **"Create Web Service"**
6. Wait 2–3 minutes for deployment

### C. Your app is live!
Render gives you a URL like: `https://gpu-explorer.onrender.com`

Share this URL with all 70 participants.

---

## 🧪 STEP 3: Test Before the Event

- [ ] Open URL on mobile and desktop
- [ ] Complete a full run (all pages)
- [ ] Check Firebase Firestore for saved data
- [ ] Check the leaderboard page shows your test entry
- [ ] Test drag-and-drop on a touchscreen phone

---

## 📊 Firestore Collections Explained

| Collection  | Contents |
|-------------|----------|
| `sessions`  | One document per completed run — has name, team, score, time |
| `members`   | One document per login (tracks who joined) |
| `teams`     | Best score + best time per team (used for leaderboard) |

To view data: Firebase Console → Firestore Database → Browse collections.

---

## 🎮 Game Flow

```
index.html (wormhole intro)
    ↓
login.html (select team + enter name)
    ↓
rules.html (rules, roles, judging criteria)
    ↓ [Start Mission → 10 min timer starts]
level1.html (5x CPU vs GPU quiz)
    ↓
level2.html (drag GPU + MCQ)
    ↓
final.html (score + Firebase save)
    ↓
leaderboard.html (live rankings)
```

---

## 🏆 Scoring Summary

| Action | Points |
|--------|--------|
| Each correct Level 1 answer | +1 (max 5) |
| GPU placed in PCIe slot | +0.5 |
| MCQ correct | +0.5 |
| Speed bonus (under 5 min) | +1 |
| **Max automated total** | **7** |
| Judge teamwork bonus | +0–4 |
| **Grand total** | **11** |

---

## 👥 Team Setup

Teams are pre-configured in `js/game.js`:
```javascript
const TEAMS = [
  { id: "team1", name: "Team 1 — Alpha Core",   color: "#00f7ff", emoji: "⚡" },
  { id: "team2", name: "Team 2 — Beta Shader",  color: "#a855f7", emoji: "🔮" },
  // ... up to team6
];
```
Each team has up to ~12 members who all log in with the same team selection + their individual name.

---

## 🛠️ Customization

**Change questions (Level 1):** Edit `QUESTIONS` array in `js/game.js`

**Change MCQ (Level 2):** Edit `L2_QUESTION` in `js/game.js`

**Add more teams:** Add entries to `TEAMS` array in `js/game.js`

**Adjust time limit:** Change `LIMIT_MS` in `level1.html` and `level2.html`

---

## ⚠️ Common Issues

**"Firebase not saving"**
→ Check browser console for errors
→ Verify your `firebaseConfig` values are correct
→ Make sure Firestore rules allow write access

**"Drag and drop not working on mobile"**
→ Touch drag is implemented — ensure the browser supports it
→ Test on Chrome mobile

**"Timer not working across pages"**
→ `startTime` is saved in `localStorage` — ensure no private/incognito mode

---

## 📋 Day-of Checklist

- [ ] Firebase config pasted correctly
- [ ] Render deployment live and accessible
- [ ] Tested on all device types in venue
- [ ] Judges have the leaderboard URL
- [ ] Teams briefed on roles before starting
- [ ] Judge observation checklist printed
