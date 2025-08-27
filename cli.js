#!/usr/bin/env node
const { exec } = require('child_process');
const net = require('net');

// 1) Start the backend server
require('./server.js');

// 2) Wait for the server to be reachable, then open the browser
const PORT = process.env.PORT || 8000;
const URL = `http://localhost:${PORT}`;

function openURL(url) {
  const plat = process.platform;
  if (plat === 'win32') {
    // Works in packaged EXE
    exec(`start "" "${url}"`, { shell: 'cmd.exe' });
  } else if (plat === 'darwin') {
    exec(`open "${url}"`);
  } else {
    exec(`xdg-open "${url}"`);
  }
}

function waitForPort(port, { retries = 40, intervalMs = 250 } = {}) {
  return new Promise((resolve) => {
    let attempts = 0;
    const tryConnect = () => {
      const socket = net.connect(port, '127.0.0.1', () => {
        socket.end();
        resolve(true);
      });
      socket.on('error', () => {
        attempts++;
        if (attempts >= retries) return resolve(false);
        setTimeout(tryConnect, intervalMs);
      });
    };
    tryConnect();
  });
}

(async () => {
  const ok = await waitForPort(PORT);
  if (ok) openURL(URL);
  else {
    // Fallback: still try to open; maybe the port is proxied
    openURL(URL);
  }
})();
