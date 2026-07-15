import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { TrendingUp } from 'lucide-react';

const COLORS = ['#22c55e', '#f59e0b', '#ef4444'];

export default function AnalyticsView({
  measurements,
  stats,
}) {
  // Prepare time series data
  const timeSeriesData = useMemo(() => {
    return measurements
      .slice()
      .reverse()
      .slice(0, 50)
      .map(m => ({
        time: new Date(m.timestamp).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
        avg: parseFloat(m.avgValue.toFixed(1)),
        high: parseFloat(m.highPercentage.toFixed(1)),
      }));
  }, [measurements]);

  // Quality distribution
  const qualityData = useMemo(() => {
    if (!stats) return [];
    const good = stats.good_keys_count || 0;
    const total = stats.total_measurements || 1;
    const unstable = total - good;

    return [
      { name: 'Good Keys', value: good, percentage: ((good / total) * 100).toFixed(1) },
      { name: 'Unstable', value: unstable, percentage: ((unstable / total) * 100).toFixed(1) },
    ];
  }, [stats]);

  // Distribution chart data
  const distributionData = useMemo(() => {
    const ranges = {
      '0-20': 0,
      '20-35': 0,
      '35-50': 0,
      '50+': 0,
    };

    measurements.forEach(m => {
      const high = m.highPercentage;
      if (high < 20) ranges['0-20']++;
      else if (high < 35) ranges['20-35']++;
      else if (high < 50) ranges['35-50']++;
      else ranges['50+']++;
    });

    return Object.entries(ranges).map(([range, count]) => ({
      range,
      count,
    }));
  }, [measurements]);

  const totalGood = stats?.good_keys_count || 0;
  const totalMeasurements = stats?.total_measurements || 0;
  const goodPercentage = totalMeasurements > 0
    ? ((totalGood / totalMeasurements) * 100).toFixed(1)
    : 0;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <TrendingUp className="text-purple-400" />
        Analytics
      </h1>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <div className="text-sm text-gray-400 mb-2">Total Measurements</div>
          <div className="text-4xl font-bold mb-2">{totalMeasurements}</div>
          <div className="text-xs text-gray-500">All measurements recorded</div>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <div className="text-sm text-gray-400 mb-2">Good Keys Rate</div>
          <div className="text-4xl font-bold mb-2 text-green-400">{goodPercentage}%</div>
          <div className="text-xs text-gray-500">{totalGood} good out of {totalMeasurements}</div>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <div className="text-sm text-gray-400 mb-2">Avg High %</div>
          <div className="text-4xl font-bold mb-2 text-blue-400">
            {stats?.avg_high_percent?.toFixed(1) || '—'}%
          </div>
          <div className="text-xs text-gray-500">Mean of all samples</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Time Series - Analog Value */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h2 className="text-lg font-semibold mb-4">Analog Value Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="time" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="avg"
                stroke="#3b82f6"
                dot={false}
                legend="Average"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Time Series - High % */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h2 className="text-lg font-semibold mb-4">High % Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="time" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="high"
                stroke="#a855f7"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Distribution and Quality */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* High % Distribution */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h2 className="text-lg font-semibold mb-4">High % Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={distributionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="range" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Key Quality Pie Chart */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h2 className="text-lg font-semibold mb-4">Key Quality Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={qualityData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, percentage }) => `${name}: ${percentage}%`}
                dataKey="value"
              >
                {qualityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Statistics Box */}
      <div className="mt-8 bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h2 className="text-lg font-semibold mb-4">Range Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-700/50 rounded-lg p-4">
            <div className="text-xs text-gray-400 mb-1">Min High %</div>
            <div className="text-2xl font-bold text-yellow-400">
              {stats?.min_high_percent?.toFixed(1) || '—'}%
            </div>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-4">
            <div className="text-xs text-gray-400 mb-1">Max High %</div>
            <div className="text-2xl font-bold text-red-400">
              {stats?.max_high_percent?.toFixed(1) || '—'}%
            </div>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-4">
            <div className="text-xs text-gray-400 mb-1">Avg Analog</div>
            <div className="text-2xl font-bold text-blue-400">
              {stats?.avg_analog_value?.toFixed(1) || '—'}
            </div>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-4">
            <div className="text-xs text-gray-400 mb-1">Good Range</div>
            <div className="text-sm font-bold text-green-400">35% - 50%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
