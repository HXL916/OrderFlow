# 🧾 OrderFlow

OrderFlow is a lightweight, local web app that lets the **cashier** send
orders to the **kitchen** in **real time**.  
The kitchen runs the **Kitchen View** and sees new orders instantly; when
an order is marked **Completed**, everyone on the local instance sees it.

---

## ✨ Features

- **Two screens**:
  - **Take Orders** (cashier) → place orders, pick extras, set payment
  - **Kitchen View** (kitchen) → large, readable cards, live updates, completion status
- **Real-time sync** on the local network (via Socket.IO)
- **Menu management**: import, export, and edit items/extras
- **End of day**: saves daily stats + full orders into `Dailys/`
- **Bilingual UI** (EN/FR); language choice is remembered locally
- **Packaged EXE**: run as a standalone app (no need for Node.js)

---

## 🚀 Quick start (Development)

```bash
# 1) install dependencies
npm install

# 2) run the app
npm start
# then open http://localhost:8000
```

👉 To use across devices on the same network, open the shown URL from
other machines (replace `localhost` with your computer's IP).

---

## 📦 Packaged App

You can build a **standalone executable** for Windows:

```bash
npm run exe
```

This will generate:

```
dist/
 ├─ OrderFlow.exe       # the app
 ├─ data/               # menu + storage
 └─ Dailys/             # daily reports
```

➡️ Distribute the whole `dist/` folder.  
Users just double-click **OrderFlow.exe** to run the app.  
All orders, menu configs, and daily files are saved inside `data/` and `Dailys/`.

---

## 📋 Basic flow

1. Open **Take Orders** on the cashier screen, add items/extras, submit.
2. Open **Kitchen View** on the kitchen screen (F11 full screen helps).
3. When the kitchen finishes an order, click **Complete** → all screens update instantly.

---

## 📂 Project structure

```
OrderFlow/
├─ index.html
├─ css/styles.css
├─ js/app.js
├─ server.js            # Express + Socket.IO server
├─ data/menu.json       # current menu (created after first save)
├─ Dailys/              # auto-created daily reports
├─ dist/                # packaged exe + runtime data
└─ package.json
```

---

## 📊 End of Day

Click **End of Day** to:
- Save two files in `Dailys/`:
  - `items-YYYY-MM-DD.json` → item & extras counts
  - `orders-YYYY-MM-DD.json` → full list of orders
- Reset counters and clear active orders

---

## 📝 Notes

- Runs **locally only**; no internet or external DB required.
- If you change the menu often, use **Export** to keep backups.
- Works best on desktop monitors (especially for Kitchen View).
- Multi-device sync works as long as devices are on the same local network.

---
