import React from 'react';
import { Shield, Copy, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function KeyDisplay({ measurement }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (measurement?.pufKey) {
      navigator.clipboard.writeText(measurement.pufKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!measurement) {
    return (
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-8 shadow-lg flex flex-col items-center justify-center min-h-96">
        <Shield className="text-gray-600 mb-4" size={48} />
        <p className="text-lg text-gray-400">Waiting for PUF key...</p>
        <div className="mt-4 flex gap-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-gray-600 rounded-full animate-pulse"
              style={{ animationDelay: `${i * 200}ms` }}
            />
          ))}
        </div>
      </div>
    );
  }

  const isGoodKey = measurement.isGoodKey;

  return (
    <div
      className={`rounded-lg border-2 p-8 shadow-lg transition-all ${
        isGoodKey
          ? 'bg-gradient-to-br from-green-900/20 to-green-800/20 border-green-500'
          : 'bg-gradient-to-br from-yellow-900/20 to-yellow-800/20 border-yellow-500'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Shield
            className={isGoodKey ? 'text-green-400' : 'text-yellow-400'}
            size={32}
          />
          <div>
            <h2 className="text-xl font-bold text-white">Current PUF Key</h2>
            <p className="text-sm text-gray-400">Physically Unclonable Function</p>
          </div>
        </div>
        {isGoodKey ? (
          <CheckCircle2 className="text-green-500" size={28} />
        ) : (
          <AlertTriangle className="text-yellow-500" size={28} />
        )}
      </div>

      {/* Key Display */}
      <div
        className="bg-gray-900/50 rounded-lg p-6 mb-6 font-mono text-center cursor-pointer hover:bg-gray-900/70 transition-colors group"
        onClick={handleCopy}
      >
        <div className="text-sm text-gray-400 mb-2">HEX Value</div>
        <div className="text-4xl font-bold text-blue-400 break-words">
          0x{measurement.pufKey}
        </div>
        <div className="flex items-center justify-center gap-2 mt-4 text-gray-500 group-hover:text-gray-300">
          <Copy size={16} />
          <span className="text-xs">{copied ? 'Copied!' : 'Click to copy'}</span>
        </div>
      </div>

      {/* Status */}
      <div
        className={`rounded-lg p-4 mb-6 ${
          isGoodKey
            ? 'bg-green-500/10 border border-green-500/30'
            : 'bg-yellow-500/10 border border-yellow-500/30'
        }`}
      >
        <p
          className={`text-sm font-semibold ${
            isGoodKey ? 'text-green-300' : 'text-yellow-300'
          }`}
        >
          {measurement.statusMessage}
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-900/30 rounded-lg p-4">
          <div className="text-xs text-gray-400 mb-1">Average Value</div>
          <div className="text-2xl font-bold text-blue-400">
            {measurement.avgValue.toFixed(1)}
          </div>
        </div>
        <div className="bg-gray-900/30 rounded-lg p-4">
          <div className="text-xs text-gray-400 mb-1">High Percentage</div>
          <div className="text-2xl font-bold text-purple-400">
            {measurement.highPercentage.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Timestamp */}
      <div className="mt-6 text-xs text-gray-500 text-center">
        Last updated: {new Date(measurement.timestamp).toLocaleString()}
      </div>
    </div>
  );
}
