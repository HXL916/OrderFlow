# 🧾 OrderFlow

OrderFlow is a lightweight, local web app that lets the **cashier** send
orders to the **kitchen** in **real time**. The kitchen runs the
**Kitchen View** and sees new orders instantly; when an order is marked
**Completed**, everyone on the local instance sees it.

## What it does

-   **Two screens**:
    -   **Take Orders** (cashier) → place orders, pick extras, set
        payment\
    -   **Kitchen View** (kitchen) → large, readable cards, live
        updates, completion status
-   **Real-time sync** on the local network (Socket.IO)
-   **Menu management**: import, export, and edit items/extras
-   **End of day**: saves daily stats + full orders to `Dailys/`
-   **Bilingual UI** (EN/FR); language choice is remembered locally

## Quick start

``` bash
# 1) install deps
npm install

# 2) run the app
npm start
# then open http://localhost:8000
```

> To use across devices on the same network, open the shown URL from
> other machines (replace `localhost` with your computer's IP).

## Basic flow

1.  Open **Take Orders** on the cashier screen, add items/extras,
    submit.
2.  Open **Kitchen View** on the kitchen screen (F11 full screen helps).
3.  When the kitchen finishes an order, click **Complete** → all screens
    update instantly.

## Menu

-   **Import/Export** JSON from the **Menu Management** tab\
-   Server keeps the current menu in `data/menu.json`

## End of Day

When you click **End of Day**: - Saves two files in `Dailys/`: -
`items-YYYY-MM-DD.json` (counts per item & extras) -
`orders-YYYY-MM-DD.json` (full list of orders) - Resets counters and
clears active orders

## Files & folders

    OrderFlow/
    ├─ index.html
    ├─ css/styles.css
    ├─ js/app.js
    ├─ server.js          # Express + Socket.IO + API
    ├─ data/menu.json     # current menu (created after first save)
    └─ Dailys/            # auto-created daily reports

## Notes

-   Designed to run **locally**; no cloud or external DB.
-   If you change menu items often, use **Export** to keep backups.
-   Best viewed on desktop screens (especially the Kitchen View).

--- End ---
