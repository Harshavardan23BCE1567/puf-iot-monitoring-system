import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import DashboardView from './components/DashboardView.jsx';
import MeasurementsView from './components/MeasurementsView.jsx';
import AnalyticsView from './components/AnalyticsView.jsx';
import LogsView from './components/LogsView.jsx';
import SettingsView from './components/SettingsView.jsx';
import Header from './components/Header.jsx';
import Sidebar from './components/Sidebar.jsx';

const API_SERVER = import.meta.env.DEV ? 'http://localhost:3000' : window.location.origin;

export default function App() {
  const [socket, setSocket] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [deviceStatus, setDeviceStatus] = useState({ connected: false });
  const [lastMeasurement, setLastMeasurement] = useState(null);
  const [measurements, setMeasurements] = useState([]);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Initialize Socket.IO
  useEffect(() => {
    const newSocket = io(API_SERVER, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
      setDeviceStatus(prev => ({ ...prev, serverConnected: true }));
    });

    newSocket.on('device-status', (status) => {
      setDeviceStatus(status);
    });

    newSocket.on('puf-measurement', (measurement) => {
      setLastMeasurement(measurement);
      setMeasurements(prev => [measurement, ...prev].slice(0, 200));
    });

    newSocket.on('serial-log', (data) => {
      setLogs(prev => [data, ...prev].slice(0, 500));
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setDeviceStatus(prev => ({ ...prev, serverConnected: false }));
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  // Fetch initial stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_SERVER}/api/stats`);
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleRestartSerial = () => {
    if (socket) {
      socket.emit('restart-serial');
    }
  };

  const viewProps = {
    deviceStatus,
    lastMeasurement,
    measurements,
    logs,
    stats,
    socket,
    apiServer: API_SERVER,
    onRestartSerial: handleRestartSerial,
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView {...viewProps} />;
      case 'measurements':
        return <MeasurementsView {...viewProps} />;
      case 'analytics':
        return <AnalyticsView {...viewProps} />;
      case 'logs':
        return <LogsView {...viewProps} />;
      case 'settings':
        return <SettingsView {...viewProps} />;
      default:
        return <DashboardView {...viewProps} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        isOpen={sidebarOpen}
        onToggle={(open) => setSidebarOpen(open)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          deviceStatus={deviceStatus}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          onRestartSerial={handleRestartSerial}
        />
        <main className="flex-1 overflow-auto bg-gray-900">
          {renderView()}
        </main>
      </div>
    </div>
  );
}
