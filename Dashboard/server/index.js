const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');

const DEFAULT_PORT = 3000;
const PORT = parseInt(process.env.PORT || DEFAULT_PORT, 10);
const SERIAL_PORT = process.env.SERIAL_PORT || 'COM3';
const SERIAL_BAUD = parseInt(process.env.SERIAL_BAUD || '115200', 10);
const AUTH_TOKEN = process.env.ADMIN_TOKEN || 'changeme';

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json());

// Static client build (optional) - serve if present
const clientBuild = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientBuild));

// Setup lowdb for simple persistence
const dbFile = path.join(__dirname, 'puf-db.json');
const adapter = new JSONFile(dbFile);
const db = new Low(adapter);

async function initDb() {
  await db.read();
  db.data = db.data || { keys: [], meta: {} };
  await db.write();
}

// Serial handling
let serial;
let parser;

function openSerial(portPath = SERIAL_PORT, baud = SERIAL_BAUD) {
  if (serial && serial.isOpen) {
    try { serial.close(); } catch (e) {}
  }
  serial = new SerialPort({ path: portPath, baudRate: baud, autoOpen: false });
  parser = serial.pipe(new ReadlineParser({ delimiter: '\r\n' }));

  serial.open(err => {
    if (err) {
      console.error('Serial open error:', err.message);
      io.emit('status', { ok: false, message: 'Serial open error: ' + err.message });
      return;
    }
    console.log('Serial opened', portPath, baud);
    io.emit('status', { ok: true, message: `Serial ${portPath} @ ${baud}` });
  });

  parser.on('data', async (line) => {
    io.emit('serial-line', line);
    // extract data
    const keyMatch = line.match(/PUF Key \(hex\): 0x([0-9A-Fa-f]+)/);
    const avgMatch = line.match(/Avg:\s*([0-9.]+)/);
    const highMatch = line.match(/High%:\s*([0-9.]+)/);
    if (keyMatch) {
      const key = keyMatch[1].toUpperCase();
      const entry = { key, avg: avgMatch ? parseFloat(avgMatch[1]) : null, highPct: highMatch ? parseFloat(highMatch[1]) : null, ts: new Date().toISOString() };
      db.data.keys.unshift(entry);
      // keep last 500 entries
      db.data.keys = db.data.keys.slice(0, 500);
      await db.write();
      io.emit('puf', entry);
    }
  });

  serial.on('error', err => {
    console.error('Serial error', err.message);
    io.emit('status', { ok: false, message: 'Serial error: ' + err.message });
  });
}

io.on('connection', socket => {
  console.log('ws connect');
  socket.emit('status', { ok: !!(serial && serial.isOpen), message: serial && serial.isOpen ? 'Serial connected' : 'Serial disconnected' });
  socket.on('restart-serial', ({ port, baud }) => {
    if (port) openSerial(port, baud || SERIAL_BAUD);
    else openSerial();
  });
});

// REST endpoints
app.get('/api/status', (req, res) => {
  res.json({ ok: true, serial: !!(serial && serial.isOpen) });
});

app.get('/api/keys', async (req, res) => {
  await db.read();
  res.json({ keys: db.data.keys });
});

app.post('/api/clear', (req, res) => {
  const token = req.headers['x-admin-token'] || req.query.token;
  if (token !== AUTH_TOKEN) return res.status(401).json({ error: 'unauthorized' });
  db.data.keys = [];
  db.write();
  res.json({ ok: true });
});

// Fallback to client app
app.get('*', (req, res) => {
  res.sendFile(path.join(clientBuild, 'index.html'));
});

async function start() {
  await initDb();
  openSerial();
  server.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

start();
