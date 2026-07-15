// Minimal server: serves static UI and relays serial data via Socket.IO
const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const STATIC_DIR = path.join(__dirname, 'src');
app.use(express.static(STATIC_DIR));

const PORT = process.env.PORT || 3000;
const SERIAL_PORT = process.env.SERIAL_PORT || 'COM3';
const BAUD = parseInt(process.env.SERIAL_BAUD || '115200', 10);

let serial;

function startSerial() {
  try {
    serial = new SerialPort({ path: SERIAL_PORT, baudRate: BAUD, autoOpen: false });
    const parser = serial.pipe(new ReadlineParser({ delimiter: '\r\n' }));
    serial.open(err => {
      if (err) {
        console.error('Serial open error:', err.message);
        io.emit('status', { ok: false, message: 'Serial open error: ' + err.message });
        return;
      }
      console.log('Serial port opened', SERIAL_PORT, BAUD);
      io.emit('status', { ok: true, message: `Connected to ${SERIAL_PORT} @ ${BAUD}` });
    });

    parser.on('data', line => {
      // Emit raw line
      io.emit('serial-line', line);

      // Try to extract PUF key and stats
      const keyMatch = line.match(/PUF Key \(hex\): 0x([0-9A-Fa-f]+)/);
      const avgMatch = line.match(/Avg:\s*([0-9.]+)/);
      const highMatch = line.match(/High%:\s*([0-9.]+)/);
      if (keyMatch) {
        const key = keyMatch[1].toUpperCase();
        io.emit('puf', { key, raw: line, avg: avgMatch ? parseFloat(avgMatch[1]) : null, highPct: highMatch ? parseFloat(highMatch[1]) : null });
      }
    });

    serial.on('error', err => {
      console.error('Serial error', err.message);
      io.emit('status', { ok: false, message: 'Serial error: ' + err.message });
    });
  } catch (e) {
    console.error('Failed to start serial:', e.message);
    io.emit('status', { ok: false, message: 'Failed to start serial: ' + e.message });
  }
}

io.on('connection', socket => {
  socket.emit('status', { ok: !!serial && serial.isOpen, message: `Server connected. Serial port: ${SERIAL_PORT}` });
  socket.on('restart-serial', () => {
    if (serial && serial.isOpen) serial.close(() => startSerial());
    else startSerial();
  });
});

server.listen(PORT, () => {
  console.log(`Dashboard available: http://localhost:${PORT}`);
  startSerial();
});
