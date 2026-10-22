<div align="center">
  <h1>🎓 Smart Campus Solution</h1>
  <p><strong>A full-stack prototype modernizing campus life with smart printing, dining, and role-based access control.</strong></p>

  <p>
    <img src="https://img.shields.io/badge/Frontend-React%20%7C%20Vite-blue?style=for-the-badge&logo=react" alt="Frontend" />
    <img src="https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-success?style=for-the-badge&logo=nodedotjs" alt="Backend" />
    <img src="https://img.shields.io/badge/Auth-JWT-orange?style=for-the-badge&logo=jsonwebtokens" alt="Auth" />
    <img src="https://img.shields.io/badge/Architecture-PWA--Style-purple?style=for-the-badge" alt="PWA" />
  </p>
</div>

---

## 🌟 Overview

The **Smart Campus Solution** is a full-stack digital platform that streamlines essential university services through a unified ecosystem, enabling seamless interaction between students, administrators, and vendors via a modern Progressive Web App (PWA).

## ✨ Key Features

- **🖨️ Smart Printing System:** Upload documents securely, customize print settings (copies, format), process mock payments, and track the real-time queue status (`Queued` ➡️ `Printing` ➡️ `Ready`).
- **🍔 Campus Dining Kiosk:** Browse rich digital menus, customize orders, process transactions, and monitor live estimated wait times and queue positions.
- **🔐 Role-Based Authentication:** Secure JWT-based access with tailored dashboards for three distinct roles:
  - 🎓 **Student:** Access services, place orders, and track print jobs.
  - 🏪 **Vendor:** Manage live order queues and update dining requests.
  - 🛡️ **Admin:** Oversee system operations and campus logs.

---

## 🛠️ Tech Stack & Architecture

### Frontend (Client)
- **Framework:** React.js powered by Vite
- **Styling:** Custom CSS (`index.css`)
- **State Management:** React Context API (`AuthContext`)
- **PWA Features:** Web App Manifest (`manifest.webmanifest`), Service Worker (`sw.js`)

### Backend (API)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Authentication:** JSON Web Tokens (JWT)
- **Data Layer:** In-memory transient storage (for prototyping ease)

---

## 📁  Repository Structure

```text
smart-campus-solution/
├── backend/                  # Node/Express API Server
│   ├── src/
│   │   ├── middleware/       # JWT Auth verification
│   │   ├── routes/           # API Endpoints (auth, print, dining, dashboard)
│   │   ├── services/         # Business logic and simulators
│   │   ├── data.js           # In-memory database models
│   │   └── server.js         # Entry point (localhost:5000)
│   ├── uploads/              # Transient file storage for print jobs
│   └── package.json
│
└── frontend/                 # React/Vite PWA Client
    ├── public/
    │   ├── manifest.webmanifest
    │   └── sw.js             # Service Worker
    ├── src/
    │   ├── api.js            # Axios/Fetch API interceptors
    │   ├── context/          # Global Auth context
    │   ├── components/       # Reusable UI (Shell, StatusBadge, ProtectedRoutes)
    │   ├── pages/            # Role-specific Views
    │   ├── App.jsx           # Routing definition
    │   ├── main.jsx          # DOM Entry
    │   └── index.css         # Global Styles & Theming
    ├── vite.config.js
    └── package.json
```

---

## 🚀 Getting Started

Follow these steps to run the application locally on your machine.

### 1. Start the Backend API

```bash
cd smart-campus-solution/backend
npm install
npm run dev
```
> **Note:** The backend API will start on **`http://localhost:5000`**.

### 2. Start the Frontend Client

Open a native new terminal window:

```bash
cd smart-campus-solution/frontend
npm install
npm run dev
```
> **Note:** The frontend application will start on **`http://localhost:5173`**.

---

## 🧪 Testing the Prototype

The system is pre-seeded with sample data to help you test different role-based workflows immediately.

### 👥 Demo Accounts

| Role | Email | Password |
| :--- | :--- | :--- |
| **Student** | `student@campus.local` | `student123` |
| **Vendor** | `vendor@campus.local` | `vendor123` |
| **Admin** | `admin@campus.local` | `admin123` |

### 🖨️ Workflow 1: Smart Printing
1. Go to `http://localhost:5173` and log in as a **Student**.
2. Navigate to the **Print** module.
3. Upload any test PDF file.
4. Configure your print job (e.g., set the number of copies) and click **"Pay & Print"**.
5. Observe the live status tracker as your document moves from `Queued` to `Printing` and finally to `Ready`.

### 🍔 Workflow 2: Campus Dining
1. Log in as a **Student**.
2. Open the **Dining** menu, select your preferred items, and place an order.
3. Check your position in the live queue and the estimated wait time on your **Status Page**.
4. Open an incognito window, log in as a **Vendor**, and update the order status to simulate kitchen progress. Watch the student's status update dynamically!

---

## ⚠️ Important Notes

- **Volatile Storage:** This prototype uses **in-memory data structures**. Any simulated data (new sign-ups, print queues, dining orders) will reset if the Node backend is restarted. 
- **Mock Payments:** The payment gateway is purely simulated and does not connect to any real financial APIs.
- **File Uploads:** Print documents are stored locally in the `/backend/uploads` directory.

---

<div align="center">
  <i>Built to optimize campus life with clean, modern web technologies.</i>
</div>
