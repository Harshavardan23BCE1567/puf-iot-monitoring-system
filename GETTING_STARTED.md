# 🚀 Getting Started with PUF IoT System

Welcome! This guide will walk you through setting up and running the complete PUF IoT monitoring system.

## 📋 What You'll Need

- **Computer**: Windows, macOS, or Linux
- **Node.js**: Version 18 or higher ([Download](https://nodejs.org))
- **Arduino IDE**: Latest version ([Download](https://www.arduino.cc/en/software))
- **Your PUF Hardware**: Arduino board with connected hardware

## ⏱️ Time Required

- Installation: **5-10 minutes**
- First data collection: **2-3 minutes**

---

## 🔧 Step 1: Install Node.js

### Windows
1. Download from nodejs.org
2. Run the installer
3. Accept defaults
4. Restart your computer

### macOS
```bash
# Using Homebrew
brew install node
```

### Linux (Ubuntu/Debian)
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Verify installation:**
```bash
node --version
npm --version
```

---

## 🔌 Step 2: Upload Hardware Sketch

1. Open Arduino IDE
2. Connect your PUF hardware via USB
3. Select: `File` → `Open` → `hardware.ino`
4. Select the correct board and COM port from Tools menu
5. Click `Upload`
6. Wait for success message

---

## 💻 Step 3: Install Project Dependencies

Open terminal/PowerShell in the project folder:

```bash
# Install backend dependencies
npm install

# Install frontend dependencies  
cd Dashboard
npm install
cd ..
```

**This may take 2-3 minutes** ☕

---

## ⚙️ Step 4: Configure Serial Port (Optional)

Create a `.env` file in the project root:

```bash
# Windows
SERIAL_PORT=COM3
SERIAL_BAUD=115200

# Linux/macOS
SERIAL_PORT=/dev/ttyUSB0
SERIAL_BAUD=115200
```

**Need to find your port?**
- Windows: Check Device Manager for COM ports
- Linux: Run `ls /dev/tty*`
- macOS: Run `ls /dev/cu.*`

---

## 🎬 Step 5: Run the System

### Option A: Development Mode (Recommended)

**Open 2 terminals in the project folder:**

**Terminal 1 - Start Backend:**
```bash
npm start
```

You should see:
```
╔════════════════════════════════════════════════════════════════════╗
║          PUF IoT System - Server Started                           ║
╠════════════════════════════════════════════════════════════════════╣
║ API Server:      http://localhost:3000
║ WebSocket:       ws://localhost:3000
║ Serial Port:     COM3 @ 115200 baud
║ Database:        ./puf.db
║ Environment:     development
╚════════════════════════════════════════════════════════════════════╝
```

**Terminal 2 - Start Frontend:**
```bash
npm run dev:frontend
```

You should see:
```
VITE v5.0.8  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

### Option B: Production Mode

```bash
# Build frontend first
npm run build

# Start server (includes built frontend)
npm start
```

Open browser to: **http://localhost:3000**

---

## 🌍 Access the Dashboard

1. Open your browser
2. Go to: **http://localhost:5173** (dev mode) or **http://localhost:3000** (production)
3. You should see the PUF monitoring dashboard
4. Wait for the first measurement from your hardware

---

## 📊 First Data Collection

1. Check that your hardware is connected (you should see serial data in Terminal 1)
2. Dashboard shows "Waiting for PUF key..."
3. Hardware automatically samples every 3 seconds
4. First measurement appears on dashboard
5. Data is automatically saved to the database

---

## ✅ What You Should See

### Dashboard View
- ✅ PUF Key display (hex value)
- ✅ Current system health metrics
- ✅ Serial port connection status
- ✅ Real-time measurements list

### Measurements View
- ✅ Paginated history of all measurements
- ✅ Filter by key quality
- ✅ Export to CSV button

### Analytics View
- ✅ Time-series charts
- ✅ Distribution analysis
- ✅ Quality statistics

### System Logs
- ✅ Real-time serial port output
- ✅ Download/copy functionality

---

## 🐛 Troubleshooting

### "Serial port not found" error

**Solution:**
1. Verify hardware is plugged in
2. Check correct COM port in `.env`
3. Try a different USB cable

```bash
# Windows - List ports
wmic logicaldisk get name

# Linux  
ls /dev/tty*

# macOS
ls /dev/cu.*
```

### "Cannot find module" error

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules Dashboard/node_modules
npm install
cd Dashboard && npm install && cd ..
```

### Dashboard shows 404

**Solution:**
1. Make sure both Terminal 1 and 2 are running
2. Frontend on port 5173 (dev) or 3000 (production)
3. Try clearing browser cache (Ctrl+Shift+Delete)

### Database "already in use" error

**Solution:**
```bash
# Stop server and delete database
rm puf.db

# Restart server
npm start
```

---

## 📱 Next Steps

Once everything is running:

1. **Collect more measurements** - Let it run for a few minutes
2. **Check Analytics** - View charts and statistics
3. **Export Data** - Download measurements as CSV
4. **Customize** - Edit dashboard colors in `tailwind.config.js`
5. **Deploy** - See README.md for production deployment

---

## 🚀 Advanced: Production Deployment

For always-on monitoring:

### Using PM2 (Recommended)
```bash
npm install -g pm2
pm2 start server.js
pm2 startup
pm2 save
```

### Using Docker
```bash
docker pull node:18-alpine
# See README.md for Dockerfile
```

---

## 📚 Learn More

- **Full documentation**: Read `README.md`
- **API reference**: See "API Endpoints" in README
- **Hardware code**: Check `hardware.ino` comments
- **React components**: Browse `Dashboard/src/components/`

---

## 💡 Tips

🎯 **Pro Tips:**
1. Keep hardware stable - avoid vibrations
2. Let system warm up for first 5-10 measurements
3. High % range 35-50% indicates good keys
4. Export data regularly for backup
5. Check System Logs for any errors

---

## ✨ Features at a Glance

| Feature | Location |
|---------|----------|
| Real-time monitoring | Dashboard view |
| Historical data | Measurements view |
| Charts & analytics | Analytics view |
| Raw logs | System Logs view |
| Device info | Settings view |
| CSV export | Measurements view |
| Database persistence | `puf.db` |
| REST API | `http://localhost:3000/api` |

---

## 🎯 Success Checklist

- [ ] Node.js installed
- [ ] Hardware sketch uploaded
- [ ] Dependencies installed
- [ ] Serial port configured
- [ ] Backend running (npm start)
- [ ] Frontend running (npm run dev:frontend)
- [ ] Dashboard accessible (localhost:5173)
- [ ] First measurement received
- [ ] Data visible on dashboard

---

## 🆘 Still Need Help?

1. **Check logs** - Look at Terminal 1 output
2. **Verify connections** - USB and hardware pins
3. **Try restarting** - Stop and restart both terminals
4. **Check firewall** - Ports 3000 and 5173 may need access
5. **Review README.md** - Full documentation

---

## 🎉 Congratulations!

You now have a professional PUF monitoring system running! 

Enjoy collecting and analyzing your PUF data! 🚀

---

**Questions?** Check the troubleshooting section or review the detailed README.md file.
