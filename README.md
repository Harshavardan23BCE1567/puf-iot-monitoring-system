# PUF IoT Monitoring System

A professional-grade, full-stack application for monitoring Physically Unclonable Function (PUF) ring oscillator hardware. Built with Node.js backend and a modern React dashboard with real-time data visualization.

![PUF IoT System](https://img.shields.io/badge/version-2.0.0-blue)
![License: MIT](https://img.shields.io/badge/license-MIT-green)
![Node.js](https://img.shields.io/badge/node-18%2B-brightgreen)
![React](https://img.shields.io/badge/react-18-blue)

## 📋 Project Overview

This project consists of:

- **Hardware**: Arduino sketch (`hardware.ino`) for PUF ring oscillator measurements
- **Backend**: Robust Node.js/Express server with:
  - Serial port communication
  - Real-time Socket.IO updates
  - REST API endpoints
  - SQLite3 database for persistence
  - Comprehensive error handling
  
- **Frontend**: Modern React dashboard (Vite + Tailwind CSS) with:
  - Real-time PUF key monitoring
  - Advanced analytics and visualization
  - Measurement history and filtering
  - System logs and device information
  - Professional UI/UX with dark theme

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Arduino IDE** (for uploading hardware.ino)
- USB connection to your PUF hardware device

### Installation

1. **Clone or extract the project** and navigate to the root directory:

```bash
cd "d:/Downloads/IoT Project"
```

2. **Install root dependencies**:

```bash
npm install
```

3. **Install frontend dependencies**:

```bash
cd Dashboard
npm install
cd ..
```

4. **Configure environment** (optional):

```bash
cp .env.example .env
# Edit .env to match your serial port configuration
```

### Running the System

#### Option 1: Separate terminals (recommended for development)

**Terminal 1 - Backend Server:**
```bash
# From project root
npm start
```

**Terminal 2 - Frontend Development Server:**
```bash
npm run dev:frontend
```

Then open http://localhost:5173 in your browser.

#### Option 2: Build and Run Production

```bash
# Build the frontend
npm run build

# Start the server (includes built frontend)
PORT=3000 npm start
```

Then open http://localhost:3000 in your browser.

---

## 🛠️ Configuration

### Serial Port Settings

Update the port and baud rate in `.env`:

```bash
SERIAL_PORT=COM3      # Windows: COM3, COM4, etc.
                      # Linux: /dev/ttyUSB0, /dev/ttyACM0
                      # macOS: /dev/cu.usbserial-*
SERIAL_BAUD=115200
```

### Windows Example

```bash
SERIAL_PORT=COM3
SERIAL_BAUD=115200
```

### Linux Example

```bash
SERIAL_PORT=/dev/ttyUSB0
SERIAL_BAUD=115200
```

### macOS Example

```bash
SERIAL_PORT=/dev/cu.usbserial-14210
SERIAL_BAUD=115200
```

---

## 📊 Dashboard Features

### Dashboard View
- Real-time PUF key display
- System health metrics
- Serial connection status
- Recent measurements list
- Device connectivity indicator

### Measurements View
- Paginated measurement history
- Filter by key quality (all, good, unstable)
- Export to CSV
- Detailed metrics (timestamp, avg value, high %)

### Analytics View
- Time-series charts (analog value, high %)
- Distribution Analysis
- Key quality pie chart
- Statistical ranges and insights

### System Logs
- Real-time serial port logging
- Auto-scroll functionality
- Copy/download log functionality
- Timestamp for each entry

### Settings
- Device information display
- Connection settings
- Advanced options (backup, factory reset)
- System about information

---

## 🔌 API Endpoints

### Device Information
```
GET /api/device
```
Returns device metadata, serial number, firmware version, etc.

### Measurements
```
GET /api/measurements?limit=100&offset=0
```
Get paginated measurement history.

### Statistics
```
GET /api/stats
```
Get aggregated statistics (totals, averages, quality metrics).

### Alerts
```
GET /api/alerts
```
Get system alerts and warnings.

### Recent Measurements
```
GET /api/measurements/recent/{count}
```
Get the last N measurements (max 500).

### Health Check
```
GET /api/health
```
Get system health and connection status.

---

## 🔄 Real-Time Socket.IO Events

### Server → Client

- **device-status**: Device connection status
- **puf-measurement**: New PUF key measurement
- **serial-log**: Serial port log entry
- **device-info**: Device information
- **measurement-history**: Historical measurements

### Client → Server

- **restart-serial**: Restart serial connection
- **request-device-info**: Request device information
- **request-history**: Request measurement history

---

## 📁 Project Structure

```
IoT Project/
├── hardware.ino                 # Arduino sketch (PUF hardware)
├── server.js                    # Node.js/Express backend
├── package.json                 # Root dependencies
├── .env.example                 # Environment template
├── puf.db                       # SQLite database (auto-created)
├── Dashboard/
│   ├── package.json             # Frontend dependencies
│   ├── vite.config.js           # Vite configuration
│   ├── tailwind.config.js       # Tailwind CSS configuration
│   ├── postcss.config.js        # PostCSS configuration
│   ├── src/
│   │   ├── index.jsx            # React entry point
│   │   ├── index.html           # HTML template
│   │   ├── index.css            # Global styles
│   │   ├── App.jsx              # Main app component
│   │   └── components/
│   │       ├── Header.jsx       # Top navigation
│   │       ├── Sidebar.jsx      # Navigation sidebar
│   │       ├── DashboardView.jsx
│   │       ├── MeasurementsView.jsx
│   │       ├── AnalyticsView.jsx
│   │       ├── LogsView.jsx
│   │       ├── SettingsView.jsx
│   │       ├── StatCard.jsx
│   │       └── KeyDisplay.jsx
│   └── dist/                    # Built frontend (after build)
└── README.md                    # This file
```

---

## 🗄️ Database Schema

### measurements table
- `id` (TEXT, PRIMARY KEY)
- `timestamp` (DATETIME)
- `puf_key` (TEXT) - Hex value of PUF key
- `avg_value` (REAL) - Average analog value
- `high_percentage` (REAL) - Percentage of high readings
- `sample_count` (INTEGER)
- `raw_line` (TEXT)

### device_metadata table
- `id` (TEXT, PRIMARY KEY)
- `device_name` (TEXT)
- `serial_number` (TEXT)
- `firmware_version` (TEXT)
- `uptime_seconds` (INTEGER)
- `last_measurement` (DATETIME)
- `total_measurements` (INTEGER)
- `created_at` (DATETIME)
- `updated_at` (DATETIME)

### alerts table
- `id` (TEXT, PRIMARY KEY)
- `timestamp` (DATETIME)
- `alert_type` (TEXT)
- `message` (TEXT)
- `severity` (TEXT)
- `resolved` (BOOLEAN)

---

## 🔍 Key Quality Criteria

The system classifies PUF keys based on the "High %" metric:

- **GOOD KEY**: 35% < High% < 50% ✅
- **UNSTABLE**: Outside the good range ⚠️

These thresholds are defined in `hardware.ino` and can be adjusted based on your hardware calibration.

---

## 📈 Development Guide

### Adding New Components

1. Create component in `Dashboard/src/components/`
2. Import in `App.jsx`
3. Add route/view handling
4. Styling with Tailwind CSS classes

### Extending the Backend

1. Add new endpoints in `server.js`
2. Follow existing patterns (dbRun, dbGet, dbAll)
3. Emit Socket.IO events as needed
4. Test with REST client (Postman, curl, etc.)

### Customizing Styling

Edit `Dashboard/tailwind.config.js` to customize:
- Colors
- Animations
- Typography
- Responsive breakpoints

---

## 🐛 Troubleshooting

### Serial Port Not Found

```bash
# Windows - List COM ports
wmic logicaldisk get name

# Linux - List serial devices
ls /dev/tty*

# macOS - List serial devices
ls /dev/cu.*
```

### Module Not Found Errors

```bash
# Reinstall dependencies
npm install
cd Dashboard && npm install && cd ..
```

### Build Fails

```bash
# Clear Vite cache
rm -rf Dashboard/dist Dashboard/node_modules/.vite

# Rebuild
npm run build
```

### Database Lock Error

Delete the database and let it auto-recreate:

```bash
rm puf.db
npm start
```

---

## 📊 Example API Usage

### Get Statistics (curl)

```bash
curl http://localhost:3000/api/stats
```

### Get Last 10 Measurements (JavaScript)

```javascript
fetch('http://localhost:3000/api/measurements/recent/10')
  .then(r => r.json())
  .then(data => console.log(data));
```

### Export Measurements (Node.js)

```javascript
const fs = require('fs');
const https = require('https');

https.request('http://localhost:3000/api/measurements?limit=10000', (res) => {
  const file = fs.createWriteStream('measurements.json');
  res.pipe(file);
}).end();
```

---

## 🚀 Production Deployment

### Using PM2 (Recommended)

```bash
# Install PM2 globally
npm install -g pm2

# Start with PM2
pm2 start server.js --name puf-system

# Enable auto-restart on reboot
pm2 startup
pm2 save
```

### Using Docker (Optional)

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install && cd Dashboard && npm install && npm run build && cd ..
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t puf-iot-system .
docker run -p 3000:3000 -e SERIAL_PORT=/dev/ttyUSB0 puf-iot-system
```

---

## 📝 Logging & Monitoring

### Server Logs

The server logs to console. For persistent logging:

```bash
npm start > logs/server.log 2>&1 &
```

### Level Logging

Consider adding Winston or Pino for structured logging:

```bash
npm install winston
```

---

## 🔐 Security Considerations

For production deployment:

1. **Enable HTTPS**: Use nginx or Apache reverse proxy with SSL
2. **Authentication**: Add user authentication to API endpoints
3. **Rate Limiting**: Implement rate limiting on API endpoints
4. **Input Validation**: Validate all incoming data
5. **CORS**: Restrict CORS origins to trusted domains
6. **Environment Variables**: Use `.env` file, never commit secrets

---

## 📄 License

MIT License - See LICENSE file for details

---

## 👤 Author

**Muthuram** - PUF Security Researcher

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📞 Support

For issues, feature requests, or general questions:

1. Check the troubleshooting section
2. Review example API usage
3. Check server logs for errors
4. Verify hardware connections and serial port settings

---

## 🗺️ Roadmap

- [ ] User authentication and multi-user support
- [ ] Cloud synchronization (AWS/Azure)
- [ ] Mobile app (React Native)
- [ ] Advanced ML anomaly detection
- [ ] Email/SMS alerts
- [ ] Historical data export (large datasets)
- [ ] Grafana integration
- [ ] Prometheus metrics

---

**Version**: 2.0.0  
**Last Updated**: March 2026  
**Maintained By**: Muthuram
