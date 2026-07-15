import React from 'react';
import { Activity, Zap, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import StatCard from './StatCard.jsx';
import KeyDisplay from './KeyDisplay.jsx';

export default function DashboardView({
  deviceStatus,
  lastMeasurement,
  stats,
  measurements,
}) {
  const goodKeysPercentage = stats?.good_keys_percentage || 0;
  const recentGoodKeys = measurements
    .filter(m => m.isGoodKey)
    .slice(0, 5).length;

  return (
    <div className="p-8">
      {/* Top Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Primary Key Display */}
        <div className="lg:col-span-1">
          <KeyDisplay measurement={lastMeasurement} />
        </div>

        {/* System Health */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Activity className="text-blue-400" />
            System Health
          </h2>

          <div className="space-y-4">
            {/* Connection Status */}
            <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    deviceStatus?.connected
                      ? 'bg-green-500 animate-pulse'
                      : 'bg-red-500'
                  }`}
                />
                <span className="text-gray-300">Serial Connection</span>
              </div>
              <span className={
                deviceStatus?.connected
                  ? 'text-green-400 font-medium'
                  : 'text-red-400 font-medium'
              }>
                {deviceStatus?.connected ? 'Active' : 'Inactive'}
              </span>
            </div>

            {/* Port Info */}
            {deviceStatus?.port && (
              <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                <span className="text-gray-300">Serial Port</span>
                <span className="font-medium text-blue-400">
                  {deviceStatus.port}
                </span>
              </div>
            )}

            {/* Baud Rate */}
            {deviceStatus?.baudRate && (
              <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                <span className="text-gray-300">Baud Rate</span>
                <span className="font-medium text-blue-400">
                  {deviceStatus.baudRate} bps
                </span>
              </div>
            )}

            {/* Last Measurement */}
            <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
              <span className="text-gray-300">Last Update</span>
              <span className="font-medium text-green-400">
                {lastMeasurement
                  ? new Date(lastMeasurement.timestamp).toLocaleTimeString()
                  : 'Waiting...'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Measurements"
          value={stats?.total_measurements || 0}
          icon={Activity}
          color="blue"
        />
        <StatCard
          title="Good Keys"
          value={`${goodKeysPercentage}%`}
          icon={CheckCircle}
          color="green"
          subtitle={`${stats?.good_keys_count || 0} keys`}
        />
        <StatCard
          title="Avg Value"
          value={stats?.avg_analog_value?.toFixed(1) || '—'}
          icon={Zap}
          color="yellow"
        />
        <StatCard
          title="Avg High %"
          value={stats?.avg_high_percent?.toFixed(1) || '—'}
          icon={TrendingUp}
          color="purple"
          subtitle="of all samples"
        />
      </div>

      {/* Recent Measurements */}
      {measurements.length > 0 && (
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="text-purple-400" />
            Recent Measurements
          </h2>

          <div className="space-y-3">
            {measurements.slice(0, 10).map(m => (
              <div
                key={m.id}
                className={`p-4 rounded-lg border-l-4 transition-all ${
                  m.isGoodKey
                    ? 'bg-green-900/20 border-l-green-500'
                    : 'bg-yellow-900/20 border-l-yellow-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-mono text-sm font-bold text-blue-400">
                      0x{m.pufKey}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Avg: {m.avgValue.toFixed(1)} | High: {m.highPercentage.toFixed(1)}%
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {m.isGoodKey ? (
                      <>
                        <CheckCircle className="text-green-500" size={20} />
                        <span className="text-xs text-green-400 font-medium">
                          GOOD
                        </span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="text-yellow-500" size={20} />
                        <span className="text-xs text-yellow-400 font-medium">
                          UNSTABLE
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  {new Date(m.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
