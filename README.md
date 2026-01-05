# AI Email Assistant ✉️🤖

A full-stack AI Email Assistant that generates professional email replies directly inside **Gmail** using AI.

This project is implemented as a **private Chrome Extension (Manifest v3)** backed by a **Spring Boot AI backend** and an optional **React frontend**.

> ⚠️ Current distribution: **Private build (Developer Mode installation)**  
> Public Chrome Web Store release planned later.

---

## ✨ Features

- Generate AI-powered email replies inside Gmail
- Auto tone detection (professional, friendly, etc.)
- Regenerate replies with different tones
- Clean UI injected directly into Gmail
- Backend deployed in production (no localhost dependency)
- Rate-limited and secure API access

---

## 🧱 Project Architecture

```
email-assistant/
├─ email-writer-ext/        # Chrome Extension (Manifest v3)
├─ email-writer-frontend/  # React + Vite frontend
├─ email-writer-sb/        # Spring Boot backend
├─ docker-compose.yml
├─ .env
└─ README.md
```


## 🧩 Components

### 1️⃣ Chrome Extension (Private Build)

- Injects UI into Gmail
- Calls backend APIs directly
- Uses Manifest V3
- Installed via Chrome Developer Mode

📦 **Download (Private ZIP):**  
👉 https://drive.google.com/file/d/1LaRMbH8Bx6ApI71e3OSXd3AreJSFpRci/view

---

### 2️⃣ Frontend (React + Vite)

- Used for testing and UI experimentation
- Deployed on Netlify
- Uses environment-based API configuration

🌐 **Live Frontend:**  
👉 https://ai-email-assistant-frontend.netlify.app/

---

### 3️⃣ Backend (Spring Boot)

- Deployed on Render
- Handles:
  - Email generation
  - Tone detection
  - Rate limiting
- Secured via client key headers

---

## ⏳ Note on Loading Time

The backend is deployed on **Render’s free plan**.  
Because of this, the first request may take **some time to load** if the service is idle.

Please **wait patiently** during initial loading — subsequent requests will be faster.

---

## 🔐 Chrome Extension Installation (Private)

This extension is **not yet published** on the Chrome Web Store.

### Installation Steps:

1. Download the ZIP from Google Drive
2. Unzip the file
3. Open Chrome and go to:
            **chrome://extensions**
4. Enable **Developer Mode**
5. Click **Load unpacked**
6. Select the unzipped `email-writer-ext` folder

✅ The extension will now be available inside Gmail

---

## 🌐 Deployment Status

| Component | Status |
|---------|--------|
| Backend (Spring Boot) | ✅ Live (Render) |
| Frontend (React) | ✅ Live (Netlify) |
| Chrome Extension | 🟡 Private (Developer Mode) |

---

## 🛡️ Privacy & Security

- Email content is sent **only** for reply generation
- No emails are permanently stored
- No data is sold or shared with third parties
- API access is restricted using client keys
- Built following Chrome Extension security best practices

---
## 🧪 Local Development (Optional)

### Backend
```bash
cd email-writer-sb
./mvnw spring-boot:run
```

### Frontend
```bash
cd email-writer-frontend
npm install
npm run dev
```

### Extension
```text
Load email-writer-ext via chrome://extensions → Developer Mode
```

---

## 📌 Current Status

✔ End-to-end system complete  
✔ Production backend running  
✔ Private Chrome extension build ready  

---

## ⚠️ Disclaimer

This project is currently distributed as a **private Chrome extension** and is not yet published on the Chrome Web Store.

