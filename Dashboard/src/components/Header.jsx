import React from 'react';
import { Menu, RotateCcw, Wifi, WifiOff } from 'lucide-react';

export default function Header({ deviceStatus, onSidebarToggle, onRestartSerial }) {
  const isConnected = deviceStatus?.connected;

  return (
    <header className="bg-gray-800 border-b border-gray-700 px-6 py-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onSidebarToggle}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-blue-400">PUF IoT System</h1>
            <p className="text-sm text-gray-400">Physically Unclonable Function Monitor</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Device Status */}
          <div className="flex items-center gap-2">
            {isConnected ? (
              <>
                <Wifi className="text-green-500" size={20} />
                <span className="text-sm text-green-400 font-medium">Connected</span>
              </>
            ) : (
              <>
                <WifiOff className="text-red-500" size={20} />
                <span className="text-sm text-red-400 font-medium">Disconnected</span>
              </>
            )}
          </div>

          {/* Restart Button */}
          <button
            onClick={onRestartSerial}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium"
          >
            <RotateCcw size={18} />
            <span className="hidden sm:inline">Reconnect</span>
          </button>

          {/* Server Status */}
          <div className="text-xs text-gray-400">
            {deviceStatus?.serverConnected ? '🟢 Server' : '🔴 Server'}
          </div>
        </div>
      </div>
    </header>
  );
}
