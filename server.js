import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';
import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';
import sqlite3 from 'sqlite3';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================================
// CONFIGURATION
// ============================================================================
const PORT = process.env.PORT || 3000;
const SERIAL_PORT = process.env.SERIAL_PORT || 'COM3';
const BAUD_RATE = parseInt(process.env.SERIAL_BAUD || '115200', 10);
const NODE_ENV = process.env.NODE_ENV || 'development';
const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'puf.db');
const STATIC_DIR = path.join(__dirname, 'Dashboard', 'dist');

// ============================================================================
// EXPRESS & HTTP SETUP
// ============================================================================
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
  transports: ['websocket', 'polling'],
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Serve static frontend if built
if (fs.existsSync(STATIC_DIR)) {
  app.use(express.static(STATIC_DIR));
}

// ============================================================================
// DATABASE SETUP
// ============================================================================
const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE, err => {
  if (err) console.error('Database error:', err);
  else console.log(`Database ready: ${DB_PATH}`);
});

db.serialize(() => {
  // Measurements table
  db.run(`
    CREATE TABLE IF NOT EXISTS measurements (
      id TEXT PRIMARY KEY,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      puf_key TEXT NOT NULL,
      avg_value REAL NOT NULL,
      high_percentage REAL NOT NULL,
      sample_count INTEGER DEFAULT 1000,
      raw_line TEXT
    )
  `);

  // Device metadata table
  db.run(`
    CREATE TABLE IF NOT EXISTS device_metadata (
      id TEXT PRIMARY KEY DEFAULT '1',
      device_name TEXT DEFAULT 'PUF Device',
      serial_number TEXT,
      firmware_version TEXT DEFAULT '1.0.0',
      uptime_seconds INTEGER DEFAULT 0,
      last_measurement DATETIME,
      total_measurements INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Alerts table
  db.run(`
    CREATE TABLE IF NOT EXISTS alerts (
      id TEXT PRIMARY KEY,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      alert_type TEXT NOT NULL,
      message TEXT NOT NULL,
      severity TEXT DEFAULT 'info',
      resolved BOOLEAN DEFAULT 0
    )
  `);

  // Initialize device metadata if not present
  db.get('SELECT COUNT(*) as count FROM device_metadata', (err, row) => {
    if (err) console.error('Metadata query error:', err);
    else if (row.count === 0) {
      const deviceId = uuidv4();
      db.run(
        'INSERT INTO device_metadata (id, device_name, serial_number) VALUES (?, ?, ?)',
        [deviceId, 'PUF Device', `PUF-${Date.now()}`],
        err => {
          if (err) console.error('Failed to initialize device metadata:', err);
          else console.log('Device metadata initialized');
        }
      );
    }
  });
});

function dbRun(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

function dbGet(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function dbAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// ============================================================================
// SERIAL PORT MANAGEMENT
// ============================================================================
let serialPort = null;
let serialConnected = false;
let lastMeasurement = null;
let measurementCount = 0;

async function startSerial() {
  try {
    if (serialPort && serialPort.isOpen) {
      console.log('Serial port already open');
      return;
    }

    serialPort = new SerialPort({
      path: SERIAL_PORT,
      baudRate: BAUD_RATE,
      autoOpen: false,
    });

    const parser = serialPort.pipe(new ReadlineParser({ delimiter: '\r\n' }));

    serialPort.open(err => {
      if (err) {
        console.error('Serial open error:', err.message);
        serialConnected = false;
        io.emit('device-status', {
          connected: false,
          error: err.message,
          port: SERIAL_PORT,
        });
        return;
      }

      serialConnected = true;
      console.log(`Serial port opened: ${SERIAL_PORT} @ ${BAUD_RATE} baud`);
      io.emit('device-status', {
        connected: true,
        port: SERIAL_PORT,
        baudRate: BAUD_RATE,
        timestamp: new Date().toISOString(),
      });
    });

    parser.on('data', async (line) => {
      await processSerialLine(line);
    });

    serialPort.on('error', err => {
      console.error('Serial error:', err.message);
      serialConnected = false;
      io.emit('device-alert', {
        type: 'serial-error',
        message: 'Serial port error: ' + err.message,
        severity: 'error',
      });
    });

    serialPort.on('close', () => {
      console.log('Serial port closed');
      serialConnected = false;
      io.emit('device-status', { connected: false, reason: 'port-closed' });
    });
  } catch (e) {
    console.error('Failed to start serial:', e.message);
    serialConnected = false;
    io.emit('device-alert', {
      type: 'serial-init-error',
      message: 'Failed to initialize serial: ' + e.message,
      severity: 'error',
    });
  }
}

async function stopSerial() {
  return new Promise((resolve) => {
    if (serialPort && serialPort.isOpen) {
      serialPort.close(() => {
        serialConnected = false;
        console.log('Serial port closed');
        resolve();
      });
    } else {
      resolve();
    }
  });
}

async function processSerialLine(line) {
  // Emit raw log for display
  io.emit('serial-log', { line, timestamp: new Date().toISOString() });

  try {
    // Extract PUF Key
    const keyMatch = line.match(/PUF Key \(hex\): 0x([0-9A-Fa-f]+)/);
    const avgMatch = line.match(/Avg:\s*([0-9.]+)/);
    const samplesMatch = line.match(/Samples:\s*([0-9]+)/);
    const highMatch = line.match(/High%:\s*([0-9.]+)/);

    if (keyMatch && avgMatch && highMatch) {
      const measurement = {
        id: uuidv4(),
        pufKey: keyMatch[1].toUpperCase(),
        avgValue: parseFloat(avgMatch[1]),
        highPercentage: parseFloat(highMatch[1]),
        sampleCount: parseInt(samplesMatch[1] || 1000),
        rawLine: line,
        timestamp: new Date().toISOString(),
      };

      lastMeasurement = measurement;
      measurementCount++;

      // Store to database
      try {
        await dbRun(
          `INSERT INTO measurements (id, puf_key, avg_value, high_percentage, sample_count, raw_line)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            measurement.id,
            measurement.pufKey,
            measurement.avgValue,
            measurement.highPercentage,
            measurement.sampleCount,
            measurement.rawLine,
          ]
        );

        // Update device metadata
        await dbRun(
          `UPDATE device_metadata SET last_measurement = ?, total_measurements = ?, updated_at = CURRENT_TIMESTAMP
           WHERE id = '1'`,
          [measurement.timestamp, measurementCount]
        );
      } catch (dbErr) {
        console.error('Database error storing measurement:', dbErr.message);
      }

      // Check for anomalies
      const isGoodKey = measurement.highPercentage > 35 && measurement.highPercentage < 50;
      const statusMessage = isGoodKey
        ? '✓ AUTHENTIC DEVICE - Good key detected'
        : '⚠ UNSTABLE READING - Key quality degraded';

      // Emit measurement to all connected clients
      io.emit('puf-measurement', {
        ...measurement,
        isGoodKey,
        statusMessage,
      });

      // Log status
      console.log(`[PUF] Key: ${measurement.pufKey} | Avg: ${measurement.avgValue.toFixed(1)} | High%: ${measurement.highPercentage.toFixed(1)}% | ${statusMessage}`);
    }
  } catch (err) {
    console.error('Error processing serial line:', err.message);
  }
}

// ============================================================================
// REST API ENDPOINTS
// ============================================================================

// Get device metadata
app.get('/api/device', async (req, res) => {
  try {
    const device = await dbGet('SELECT * FROM device_metadata WHERE id = ?', ['1']);
    res.json(device || { error: 'Device not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get measurements with pagination
app.get('/api/measurements', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit || '100'), 1000);
    const offset = parseInt(req.query.offset || '0');

    const measurements = await dbAll(
      `SELECT * FROM measurements ORDER BY timestamp DESC LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    const total = await dbGet('SELECT COUNT(*) as count FROM measurements');

    res.json({
      data: measurements,
      total: total.count,
      limit,
      offset,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get stats
app.get('/api/stats', async (req, res) => {
  try {
    const stats = await dbGet(`
      SELECT
        COUNT(*) as total_measurements,
        AVG(avg_value) as avg_analog_value,
        AVG(high_percentage) as avg_high_percent,
        MIN(high_percentage) as min_high_percent,
        MAX(high_percentage) as max_high_percent,
        MAX(timestamp) as last_measurement_time
      FROM measurements
    `);

    // Good keys: high% between 35-50
    const goodKeys = await dbGet(
      'SELECT COUNT(*) as count FROM measurements WHERE high_percentage > 35 AND high_percentage < 50'
    );

    res.json({
      ...stats,
      good_keys_count: goodKeys.count,
      good_keys_percentage: stats.total_measurements > 0
        ? ((goodKeys.count / stats.total_measurements) * 100).toFixed(2)
        : 0,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get alerts
app.get('/api/alerts', async (req, res) => {
  try {
    const alerts = await dbAll(
      'SELECT * FROM alerts ORDER BY timestamp DESC LIMIT 100'
    );
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get recent measurements (last N)
app.get('/api/measurements/recent/:count', async (req, res) => {
  try {
    const count = Math.min(parseInt(req.params.count || '20'), 500);
    const recent = await dbAll(
      `SELECT * FROM measurements ORDER BY timestamp DESC LIMIT ?`,
      [count]
    );
    res.json(recent.reverse()); // Return in chronological order
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    serial_connected: serialConnected,
    last_measurement: lastMeasurement,
    timestamp: new Date().toISOString(),
  });
});

// ============================================================================
// SOCKET.IO EVENTS
// ============================================================================
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Send current status
  socket.emit('device-status', {
    connected: serialConnected,
    port: SERIAL_PORT,
    baudRate: BAUD_RATE,
  });

  // Send last measurement if available
  if (lastMeasurement) {
    socket.emit('puf-measurement', lastMeasurement);
  }

  // Restart serial connection
  socket.on('restart-serial', async () => {
    console.log('Restarting serial connection...');
    await stopSerial();
    setTimeout(() => startSerial(), 1000);
    socket.emit('serial-restarting');
  });

  // Get device info
  socket.on('request-device-info', async () => {
    try {
      const device = await dbGet('SELECT * FROM device_metadata WHERE id = ?', ['1']);
      socket.emit('device-info', device);
    } catch (err) {
      socket.emit('device-info-error', { error: err.message });
    }
  });

  // Get measurement history
  socket.on('request-history', async (params) => {
    try {
      const limit = Math.min(params.limit || 100, 500);
      const measurements = await dbAll(
        `SELECT * FROM measurements ORDER BY timestamp DESC LIMIT ?`,
        [limit]
      );
      socket.emit('measurement-history', measurements.reverse());
    } catch (err) {
      socket.emit('history-error', { error: err.message });
    }
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// ============================================================================
// ERROR HANDLING
// ============================================================================
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  await stopSerial();
  db.close();
  server.close(() => {
    process.exit(0);
  });
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// ============================================================================
// START SERVER
// ============================================================================
server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════════════╗
║          PUF IoT System - Server Started                           ║
╠════════════════════════════════════════════════════════════════════╣
║ API Server:      http://localhost:${PORT}
║ WebSocket:       ws://localhost:${PORT}
║ Serial Port:     ${SERIAL_PORT} @ ${BAUD_RATE} baud
║ Database:        ${DB_PATH}
║ Environment:     ${NODE_ENV}
╚════════════════════════════════════════════════════════════════════╝
  `);

  // Start serial after a small delay
  setTimeout(() => startSerial(), 500);
});
