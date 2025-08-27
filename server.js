// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server); // Socket.IO sur le même port

// === Paths ===
const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, 'data');
const DAILYS_DIR = path.join(ROOT, 'Dailys');
const MENU_JSON = path.join(DATA_DIR, 'menu.json');
const ORDERS_JSON = path.join(DATA_DIR, 'orders.json');

// === Utils ===
function readJsonSafe(file, fallback) {
  try {
    if (!fs.existsSync(file)) return fallback;
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch (e) {
    console.error('readJsonSafe error:', e);
    return fallback;
  }
}
function writeJsonSafe(file, data) {
  try {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('writeJsonSafe error:', e);
    throw e;
  }
}

// === Middlewares ===
app.use(express.json({ limit: '2mb' }));
app.use(express.static(ROOT, { etag: false, lastModified: true, maxAge: 0 }));

// === MENU ===
// GET current menu
app.get('/menu', (req, res) => {
  try {
    if (!fs.existsSync(MENU_JSON)) return res.json({ menuItems: [], extraItems: [] });
    res.sendFile(MENU_JSON);
  } catch (e) {
    console.error('GET /menu', e);
    res.status(500).json({ error: 'server_error' });
  }
});

// POST updated menu
app.post('/menu', (req, res) => {
  const { menuItems, extraItems, restaurantName = 'Cuisine de Lin', version = '1.0' } = req.body || {};
  if (!Array.isArray(menuItems) || !Array.isArray(extraItems)) {
    return res.status(400).json({ error: 'invalid schema: need menuItems[], extraItems[]' });
  }
  try {
    writeJsonSafe(
      MENU_JSON,
      { restaurantName, version, lastUpdated: new Date().toISOString(), menuItems, extraItems }
    );
    res.json({ ok: true });
  } catch (e) {
    console.error('POST /menu', e);
    res.status(500).json({ error: 'server_error' });
  }
});

// === DAILY FILES ===
// Save daily stats + orders into Dailys/
app.post('/daily/save', (req, res) => {
  try {
    const { date, itemsStats, extrasStats, orders } = req.body || {};
    if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ error: 'invalid date (YYYY-MM-DD)' });
    }
    if (typeof itemsStats !== 'object' || typeof extrasStats !== 'object' || !Array.isArray(orders)) {
      return res.status(400).json({ error: 'invalid payload' });
    }
    fs.mkdirSync(DAILYS_DIR, { recursive: true });

    const itemsFile = path.join(DAILYS_DIR, `items-${date}.json`);
    const ordersFile = path.join(DAILYS_DIR, `orders-${date}.json`);

    writeJsonSafe(itemsFile, {
      date,
      itemsStats,
      extrasStats,
      savedAt: new Date().toISOString()
    });

    writeJsonSafe(ordersFile, {
      date,
      orders,
      savedAt: new Date().toISOString()
    });

    // (optionnel) on vide le fichier des commandes du jour courant côté serveur ici si besoin
    res.json({ ok: true, itemsFile, ordersFile });
  } catch (e) {
    console.error('POST /daily/save', e);
    res.status(500).json({ error: 'server_error' });
  }
});

// === ORDERS (partagé) ===
// Lister toutes les commandes
app.get('/orders', (req, res) => {
  const orders = readJsonSafe(ORDERS_JSON, []);
  res.json({ orders });
});

// Créer une commande
app.post('/orders', (req, res) => {
  const order = req.body;
  if (!order || typeof order.id !== 'number' || !Array.isArray(order.items)) {
    return res.status(400).json({ error: 'invalid order' });
  }
  const orders = readJsonSafe(ORDERS_JSON, []);
  // éviter doublon par ID
  const exists = orders.find(o => o.id === order.id);
  if (!exists) orders.unshift(order);
  writeJsonSafe(ORDERS_JSON, orders);

  // push en temps réel
  io.emit('order:created', order);
  res.json({ ok: true });
});

// Marquer une commande terminée
app.post('/orders/:id/complete', (req, res) => {
  const id = Number(req.params.id);
  const orders = readJsonSafe(ORDERS_JSON, []);
  const o = orders.find(x => x.id === id);
  if (!o) return res.status(404).json({ error: 'not found' });
  o.status = 'completed';
  writeJsonSafe(ORDERS_JSON, orders);

  // push en temps réel
  io.emit('order:completed', { id });
  res.json({ ok: true });
});

// Réinitialiser toutes les commandes (utilisé à la fin de journée)
app.post('/orders/reset', (req, res) => {
  writeJsonSafe(ORDERS_JSON, []);
  io.emit('orders:reset');
  res.json({ ok: true });
});

// === WebSockets ===
io.on('connection', (socket) => {
  // envoyer l'état initial des commandes au nouvel écran
  const orders = readJsonSafe(ORDERS_JSON, []);
  socket.emit('orders:init', orders);
});

// === Start ===
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Order app at http://localhost:${PORT}/`);
  console.log(`Static root: ${ROOT}`);
});
