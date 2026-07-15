# 📚 PUF IoT System - Documentation Index

Welcome to the complete PUF IoT Monitoring System! This page serves as your navigation hub for all documentation.

## 🚀 Start Here

**New to the project?**
1. Read [GETTING_STARTED.md](GETTING_STARTED.md) (5-10 min read)
2. Run: `npm install && npm start`
3. Open: http://localhost:5173

---

## 📖 Documentation Files

### 🎯 For Quick Setup
- **[GETTING_STARTED.md](GETTING_STARTED.md)** ⭐ START HERE
  - Step-by-step installation guide
  - Configuration instructions
  - Troubleshooting tips
  - First-time user friendly

### 📚 For Complete Reference
- **[README.md](README.md)** - Comprehensive documentation
  - Project overview
  - Installation guide
  - Configuration options
  - API reference
  - Deployment guides
  - Architecture overview

### 📋 For Project Details
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - What was built
  - Complete feature list
  - Technical specifications
  - Project structure
  - Performance metrics
  - What's new in v2.0

### 🔄 For Version History
- **[CHANGELOG.md](CHANGELOG.md)** - Version tracking
  - What's new in v2.0.0
  - New features added
  - Technical stack
  - Upcoming features

### 📄 Legal
- **[LICENSE](LICENSE)** - MIT License

---

## 🛠️ Configuration Files Reference

| File | Purpose |
|------|---------|
| `.env.example` | Environment variable template |
| `package.json` | Root dependencies and scripts |
| `Dashboard/package.json` | Frontend dependencies |
| `vite.config.js` | Vite build configuration |
| `tailwind.config.js` | Tailwind CSS theming |
| `postcss.config.js` | CSS processing |
| `.eslintrc.json` | Code quality rules |
| `.gitignore` | Git exclusions |
| `.nvmrc` | Node.js version |
| `Dockerfile` | Production container image |
| `docker-compose.yml` | Full stack deployment |

---

## 📂 Source Code Structure

### Backend
```
server.js                  # 400+ lines - Main Express server
└─ Features:
   ├─ Serial port management
   ├─ SQLite3 database
   ├─ Socket.IO real-time
   ├─ REST API (6 endpoints)
   ├─ Error handling
   └─ Security middleware
```

### Frontend
```
Dashboard/src/
├── App.jsx                       # Main app component (200+ lines)
├── index.jsx                    # React entry point
├── index.css                    # Tailwind directives
├── index.html                   # HTML template
└── components/
    ├── Header.jsx              # Top navigation (100+ lines)
    ├── Sidebar.jsx             # Menu sidebar (150+ lines)
    ├── DashboardView.jsx       # Main dashboard (200+ lines)
    ├── MeasurementsView.jsx    # Data table (250+ lines)
    ├── AnalyticsView.jsx       # Charts (280+ lines)
    ├── LogsView.jsx            # System logs (150+ lines)
    ├── SettingsView.jsx        # Settings (180+ lines)
    ├── StatCard.jsx            # Reusable card (80+ lines)
    └── KeyDisplay.jsx          # Key showcase (150+ lines)
```

### Hardware
```
hardware.ino                      # Arduino sketch
└─ Features:
   ├─ PUF ring oscillator sampling
   ├─ Serial communication
   ├─ LED/buzzer feedback
   └─ Status reporting
```

---

## 🎯 Quick Navigation by Task

### "I want to..."

**...set up the system**
→ [GETTING_STARTED.md](GETTING_STARTED.md)

**...understand the full architecture**
→ [README.md](README.md)

**...see what was built**
→ [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)

**...deploy to production**
→ [README.md > Production Deployment](README.md#production-deployment)

**...run with Docker**
→ See Dockerfile and docker-compose.yml

**...troubleshoot issues**
→ [GETTING_STARTED.md > Troubleshooting](GETTING_STARTED.md#troubleshooting)

**...understand the API**
→ [README.md > API Endpoints](README.md#api-endpoints)

**...customize the dashboard**
→ `Dashboard/src/components/` & `tailwind.config.js`

**...extend the backend**
→ Edit `server.js` following existing patterns

**...view hardware code**
→ [hardware.ino](hardware.ino)

---

## 🔍 Key Files at a Glance

### Most Important Files
1. **[server.js](server.js)** - Backend logic
2. **[Dashboard/src/App.jsx](Dashboard/src/App.jsx)** - Frontend logic
3. **[hardware.ino](hardware.ino)** - Hardware sketch
4. **[README.md](README.md)** - Full documentation
5. **[GETTING_STARTED.md](GETTING_STARTED.md)** - Quick reference

### Configuration Files
1. **[.env.example](.env.example)** - Environment setup
2. **[package.json](package.json)** - Dependencies
3. **[vite.config.js](Dashboard/vite.config.js)** - Build config
4. **[tailwind.config.js](Dashboard/tailwind.config.js)** - Styling

### Deployment Files
1. **[Dockerfile](Dockerfile)** - Container image
2. **[docker-compose.yml](docker-compose.yml)** - Orchestration

---

## 📊 What Each Component Does

### Backend Server (server.js)
- Listens on port 3000
- Reads serial port data
- Stores in SQLite database
- Broadcasts via Socket.IO
- Provides REST API

### React Dashboard (Frontend)
- Displays real-time data
- Shows analytics charts
- Manages user interactions
- Updates via Socket.IO
- Exports data to CSV

### Arduino Hardware (hardware.ino)
- Samples PUF ring oscillator
- Outputs serial data
- Provides LED/buzzer feedback
- Measures key quality

### Database (SQLite)
- Stores measurements
- Persists device metadata
- Tracks alerts
- Enables historical queries

---

## 🚀 Common Commands

```bash
# Install dependencies
npm install
cd Dashboard && npm install && cd ..

# Development mode (2 terminals)
npm start                    # Terminal 1: Backend
npm run dev:frontend         # Terminal 2: Frontend

# Production mode
npm run build                # Build frontend
PORT=3000 npm start         # Start server

# Docker
docker-compose up           # Start full stack
docker-compose down         # Stop stack

# Linting
npm run lint

# Just the API
npm start

# Just the frontend dev
npm run dev:frontend

# Preview production build
npm run preview
```

---

## 💡 Quick Tips

### To Find Something Specific
- **API reference**: [README.md > API Endpoints](README.md#-api-endpoints)
- **Database schema**: [README.md > Database Schema](README.md#-database-schema)
- **Setup guide**: [GETTING_STARTED.md](GETTING_STARTED.md)
- **Features list**: [PROJECT_SUMMARY.md > Key Features](PROJECT_SUMMARY.md#-key-features)
- **Deploy guides**: [README.md > Production Deployment](README.md#-production-deployment)

### To Customize
- **Colors/theme**: Edit `Dashboard/tailwind.config.js`
- **API endpoints**: Edit `server.js`
- **React components**: Edit files in `Dashboard/src/components/`
- **Hardware behavior**: Edit `hardware.ino`

### To Debug
- **Check server**: Look at output from `npm start`
- **Check frontend**: Open browser DevTools (F12)
- **Check logs**: View [Logs view in dashboard](http://localhost:5173)
- **Check database**: Download from Settings view

---

## 🎓 Learning Path

1. ✅ **Install & Run** (GETTING_STARTED.md)
2. ✅ **Understand Structure** (PROJECT_SUMMARY.md)
3. ✅ **Read Full Docs** (README.md)
4. ✅ **Explore Code** (Browse src/ files)
5. ✅ **Try API** (Use curl or Postman)
6. ✅ **Customize** (Edit components)
7. ✅ **Deploy** (Follow deployment guide)

---

## 📞 Need Help?

1. **Setup issues**: [GETTING_STARTED.md > Troubleshooting](GETTING_STARTED.md#-troubleshooting)
2. **Feature questions**: [README.md > Dashboard Features](README.md#-dashboard-features)
3. **API help**: [README.md > API Documentation](README.md#-api-endpoints)
4. **Deployment**: [README.md > Production Deployment](README.md#-production-deployment)
5. **Code questions**: Check comments in source files

---

## 📈 System Information

| Component | Version | Status |
|-----------|---------|--------|
| Node.js | 18+ | ✅ Required |
| React | 18.2 | ✅ Included |
| Vite | 5.0 | ✅ Included |
| Express | 4.18 | ✅ Included |
| SQLite3 | 11.0 | ✅ Included |
| Socket.IO | 4.7 | ✅ Included |
| Tailwind | 3.3 | ✅ Included |

---

## ✅ Verification Checklist

Before running, ensure:
- [ ] Node.js 18+ installed
- [ ] Hardware connected via USB
- [ ] `npm install` completed
- [ ] `.env` configured (optional but recommended)
- [ ] Serial port correct in `.env`

Before deployment:
- [ ] `npm run build` succeeds
- [ ] `npm start` runs without errors
- [ ] http://localhost:3000 is accessible
- [ ] Data appears in dashboard

---

## 📚 Quick Ref Links

| Topic | Location |
|-------|----------|
| Installation | [GETTING_STARTED.md](GETTING_STARTED.md#-step-3-install-project-dependencies) |
| Configuration | [GETTING_STARTED.md](GETTING_STARTED.md#%EF%B8%8F-step-4-configure-serial-port-optional) |
| API Docs | [README.md](README.md#-api-endpoints) |
| Dashboard Features | [README.md](README.md#-dashboard-features) |
| Architecture | [README.md](README.md#-project-structure) |
| Deploy | [README.md](README.md#-production-deployment) |
| Troubleshoot | [GETTING_STARTED.md](GETTING_STARTED.md#-troubleshooting) |
| Features | [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md#-what-was-built) |

---

## 🎯 Your Next Step

**Ready to begin?**

```bash
# 1. Navigate to project folder
cd "d:/Downloads/IoT Project"

# 2. Install dependencies (3 minutes)
npm install && cd Dashboard && npm install && cd ..

# 3. Start the system (2 terminals)
npm start                      # Terminal 1
npm run dev:frontend          # Terminal 2

# 4. Open http://localhost:5173
```

**Need detailed steps?** → [GETTING_STARTED.md](GETTING_STARTED.md)

---

**Welcome to PUF IoT System v2.0.0!** 🚀

Enjoy monitoring your PUF device in real-time with a professional dashboard!

---

*Last Updated: March 4, 2026*  
*Version: 2.0.0*  
*Status: ✅ Complete & Ready*
