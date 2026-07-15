import React from 'react';

export default function StatCard({ title, value, icon: Icon, color = 'blue', subtitle }) {
  const colorMap = {
    blue: 'border-blue-500 text-blue-400 bg-blue-500/10',
    green: 'border-green-500 text-green-400 bg-green-500/10',
    yellow: 'border-yellow-500 text-yellow-400 bg-yellow-500/10',
    purple: 'border-purple-500 text-purple-400 bg-purple-500/10',
    red: 'border-red-500 text-red-400 bg-red-500/10',
  };

  const selected = colorMap[color];

  return (
    <div
      className={`bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border ${selected} p-6 shadow-lg`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm mb-2">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <Icon size={32} className={selected} />
      </div>
    </div>
  );
}
