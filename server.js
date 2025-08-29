// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const os = require('os');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// ---------- Get Network IP ----------
function getNetworkIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip internal (loopback) and non-IPv4 addresses
      if (!iface.internal && iface.family === 'IPv4') {
        return iface.address;
      }
    }
  }
  return 'localhost'; // fallback
}

// ---------- Writable root ----------
// For packaged EXE, write beside the EXE (dist/)
// For dev, write into project folder (__dirname)
function resolveWritableRoot() {
  if (process.env.ORDERFLOW_DATA_DIR) return path.resolve(process.env.ORDERFLOW_DATA_DIR);
  if (process.pkg) return path.dirname(process.execPath);
  return __dirname;
}
const WRITABLE_ROOT = resolveWritableRoot();
fs.mkdirSync(WRITABLE_ROOT, { recursive: true });

// Snapshot (read-only) root for static assets:
const ROOT = __dirname;

// Paths under the writable root (beside EXE in dist/)
const DATA_DIR   = path.join(WRITABLE_ROOT, 'data');
const DAILYS_DIR = path.join(WRITABLE_ROOT, 'Dailys');
const MENU_JSON  = path.join(DATA_DIR, 'menu.json');
const ORDERS_JSON= path.join(DATA_DIR, 'orders.json');

// ---------- helpers ----------
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
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
}

// Seed writable /data from snapshot's /data (first run only)
function seedDataIfMissing() {
  try {
    if (fs.existsSync(MENU_JSON)) return; // already seeded
    const snapshotDataDir = path.join(ROOT, 'data');
    const snapshotMenu = path.join(snapshotDataDir, 'menu.json');
    if (fs.existsSync(snapshotMenu)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
      fs.copyFileSync(snapshotMenu, MENU_JSON);
      console.log('Seeded data/menu.json to writable area.');
    } else {
      // create a minimal default
      writeJsonSafe(MENU_JSON, {
        restaurantName: 'Cuisine de Lin',
        version: '1.0',
        lastUpdated: new Date().toISOString(),
        menuItems: ['Poutine','Burger','Chicken Wings'],
        extraItems: ['Extra Sauce','Extra Cheese']
      });
      console.log('Created default menu.json in writable area.');
    }
  } catch (e) {
    console.warn('Failed to seed data:', e.message);
  }
}
seedDataIfMissing();

// Optional: clear orders on start (set env CLEAR_ORDERS_ON_START=1)
if (process.env.CLEAR_ORDERS_ON_START === '1') {
  try { writeJsonSafe(ORDERS_JSON, []); } catch {}
}

// ---------- middleware ----------
app.use(express.json({ limit: '2mb' }));
// Serve static app (from snapshot / project)
app.use(express.static(ROOT, { etag:false, lastModified:true, maxAge:0 }));

// Debug: see where files go
app.get('/where', (req, res) => {
  res.json({
    snapshotRoot: ROOT,
    exeDir: process.pkg ? path.dirname(process.execPath) : null,
    writableRoot: WRITABLE_ROOT,
    dataDir: DATA_DIR,
    dailysDir: DAILYS_DIR
  });
});

// ---------- MENU ----------
app.get('/menu', (req, res) => {
  try {
    if (!fs.existsSync(MENU_JSON)) return res.json({ menuItems: [], extraItems: [] });
    res.sendFile(MENU_JSON);
  } catch (e) {
    console.error('GET /menu', e);
    res.status(500).json({ error: 'server_error' });
  }
});

app.post('/menu', (req, res) => {
  const { menuItems, extraItems, restaurantName='Cuisine de Lin', version='1.0' } = req.body || {};
  if (!Array.isArray(menuItems) || !Array.isArray(extraItems)) {
    return res.status(400).json({ error: 'invalid schema: need menuItems[], extraItems[]' });
  }
  try {
    writeJsonSafe(MENU_JSON, {
      restaurantName, version, lastUpdated: new Date().toISOString(), menuItems, extraItems
    });
    res.json({ ok: true });
  } catch (e) {
    console.error('POST /menu', e);
    res.status(500).json({ error: 'server_error' });
  }
});

// ---------- DAILYS ----------
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

    const itemsFile  = path.join(DAILYS_DIR, `items-${date}.json`);
    const ordersFile = path.join(DAILYS_DIR, `orders-${date}.json`);

    writeJsonSafe(itemsFile,  { date, itemsStats, extrasStats, savedAt: new Date().toISOString() });
    writeJsonSafe(ordersFile, { date, orders,      savedAt: new Date().toISOString() });

    res.json({ ok: true, itemsFile, ordersFile });
  } catch (e) {
    console.error('POST /daily/save', e);
    res.status(500).json({ error: 'server_error' });
  }
});

// ---------- ORDERS ----------
app.get('/orders', (req, res) => {
  res.json({ orders: readJsonSafe(ORDERS_JSON, []) });
});

app.post('/orders', (req, res) => {
  const order = req.body;
  if (!order || !Array.isArray(order.items) || !order.items.length) {
    return res.status(400).json({ error: 'invalid order' });
  }
  const orders = readJsonSafe(ORDERS_JSON, []);
  // assign ID if missing or colliding
  if (typeof order.id !== 'number' || orders.some(o => o.id === order.id)) {
    const max = orders.reduce((m, o) => Math.max(m, o.id || 0), 0);
    order.id = max + 1;
  }
  orders.unshift(order);
  writeJsonSafe(ORDERS_JSON, orders);

  io.emit('order:created', order);
  res.json({ ok: true, order });
});

app.post('/orders/:id/complete', (req, res) => {
  const id = Number(req.params.id);
  const orders = readJsonSafe(ORDERS_JSON, []);
  const o = orders.find(x => x.id === id);
  if (!o) return res.status(404).json({ error: 'not found' });
  o.status = 'completed';
  writeJsonSafe(ORDERS_JSON, orders);
  io.emit('order:completed', { id });
  res.json({ ok: true });
});

app.post('/orders/reset', (req, res) => {
  writeJsonSafe(ORDERS_JSON, []);
  io.emit('orders:reset');
  res.json({ ok: true });
});

// ---------- sockets ----------
io.on('connection', (socket) => {
  socket.emit('orders:init', readJsonSafe(ORDERS_JSON, []));
});

// ---------- start ----------
const PORT = process.env.PORT || 8000;
const HOST = '0.0.0.0'; // Listen on all network interfaces

server.listen(PORT, HOST, () => {
  const networkIP = getNetworkIP();
  const localURL = `http://localhost:${PORT}/`;
  const networkURL = `http://${networkIP}:${PORT}/`;
  
  console.log('========================================');
  console.log('🍔 OrderFlow Server Started Successfully!');
  console.log('========================================');
  console.log(`📍 Local access:   ${localURL}`);
  console.log(`🌐 Network access: ${networkURL}`);
  console.log('----------------------------------------');
  console.log('💡 Other devices can connect using:');
  console.log(`   ${networkURL}`);
  console.log('========================================');
  console.log(`📁 Static files:   ${ROOT}`);
  console.log(`💾 Data directory: ${WRITABLE_ROOT}`);
  console.log('========================================');
});