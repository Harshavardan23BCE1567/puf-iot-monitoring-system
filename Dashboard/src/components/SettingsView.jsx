import React, { useState, useEffect } from 'react';
import { Settings, RefreshCw, HardDrive, Info } from 'lucide-react';

export default function SettingsView({ apiServer, socket, deviceStatus }) {
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDeviceInfo = async () => {
      try {
        const res = await fetch(`${apiServer}/api/device`);
        const data = await res.json();
        setDeviceInfo(data);
      } catch (err) {
        console.error('Failed to fetch device info:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeviceInfo();
    const interval = setInterval(fetchDeviceInfo, 10000);
    return () => clearInterval(interval);
  }, [apiServer]);

  const handleFactoryReset = () => {
    if (confirm('Reset device to factory settings? This cannot be undone.')) {
      // Implementation would go here
      alert('Factory reset not implemented yet');
    }
  };

  const handleBackupData = () => {
    // Implementation would go here
    alert('Backup functionality not implemented yet');
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <Settings className="text-purple-400" />
        Settings
      </h1>

      {/* Device Information */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-8">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Info className="text-blue-400" />
          Device Information
        </h2>

        {isLoading ? (
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-700 rounded" />
            ))}
          </div>
        ) : deviceInfo ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
              <span className="text-gray-300">Device Name</span>
              <span className="font-mono text-blue-400">{deviceInfo.device_name}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
              <span className="text-gray-300">Serial Number</span>
              <span className="font-mono text-blue-400">{deviceInfo.serial_number}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
              <span className="text-gray-300">Firmware Version</span>
              <span className="font-mono text-blue-400">{deviceInfo.firmware_version}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
              <span className="text-gray-300">Total Measurements</span>
              <span className="font-mono text-green-400">{deviceInfo.total_measurements}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
              <span className="text-gray-300">Last Measurement</span>
              <span className="font-mono text-yellow-400">
                {deviceInfo.last_measurement
                  ? new Date(deviceInfo.last_measurement).toLocaleString()
                  : 'Never'}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-400">Failed to load device info</div>
        )}
      </div>

      {/* Connection Settings */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-8">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <RefreshCw className="text-blue-400" />
          Connection Settings
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
            <span className="text-gray-300">Serial Port</span>
            <span className="font-mono text-blue-400">{deviceStatus?.port || 'Unknown'}</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
            <span className="text-gray-300">Baud Rate</span>
            <span className="font-mono text-blue-400">
              {deviceStatus?.baudRate || 'Unknown'} bps
            </span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
            <span className="text-gray-300">Status</span>
            <span className={`font-mono ${
              deviceStatus?.connected ? 'text-green-400' : 'text-red-400'
            }`}>
              {deviceStatus?.connected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <p className="text-sm text-blue-300">
            <strong>Note:</strong> To change the serial port or baud rate, edit the environment variables:
          </p>
          <pre className="mt-3 text-xs bg-gray-900 p-3 rounded overflow-x-auto font-mono">
{`SERIAL_PORT=COM3
SERIAL_BAUD=115200`}
          </pre>
        </div>
      </div>

      {/* Advanced Options */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-8">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <HardDrive className="text-purple-400" />
          Advanced Options
        </h2>

        <div className="space-y-3">
          <button
            onClick={handleBackupData}
            className="w-full flex items-center justify-between px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <span>Backup All Data</span>
            <RefreshCw size={18} />
          </button>

          <button
            onClick={handleFactoryReset}
            className="w-full flex items-center justify-between px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            <span>Factory Reset</span>
            <RefreshCw size={18} />
          </button>
        </div>

        <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <p className="text-sm text-yellow-300">
            <strong>Warning:</strong> Factory reset will erase all local data. Consider backing up first.
          </p>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h2 className="text-xl font-bold mb-4">About</h2>
        <div className="space-y-2 text-sm text-gray-400">
          <p><strong>Application:</strong> PUF IoT Monitoring System v2.0.0</p>
          <p><strong>Author:</strong> Muthuram</p>
          <p><strong>Technology:</strong> Node.js + React + Tailwind CSS</p>
          <p><strong>Database:</strong> SQLite3</p>
          <p><strong>License:</strong> MIT</p>
          <p className="mt-4">
            A professional-grade monitoring system for Physically Unclonable Function (PUF) ring oscillator hardware.
          </p>
        </div>
      </div>
    </div>
  );
}
