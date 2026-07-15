import React, { useState, useEffect } from 'react';
import { Download, Filter, CheckCircle, AlertTriangle } from 'lucide-react';

export default function MeasurementsView({
  measurements,
  apiServer,
  stats,
}) {
  const [filteredMeasurements, setFilteredMeasurements] = useState(measurements);
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 20;

  useEffect(() => {
    let filtered = measurements;
    if (filterStatus === 'good') {
      filtered = measurements.filter(m => m.isGoodKey);
    } else if (filterStatus === 'bad') {
      filtered = measurements.filter(m => !m.isGoodKey);
    }
    setFilteredMeasurements(filtered);
    setPage(1);
  }, [measurements, filterStatus]);

  const totalPages = Math.ceil(filteredMeasurements.length / itemsPerPage);
  const startIdx = (page - 1) * itemsPerPage;
  const paginatedData = filteredMeasurements.slice(startIdx, startIdx + itemsPerPage);

  const handleExport = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${apiServer}/api/measurements?limit=10000`);
      const data = await res.json();
      
      const csv = [
        'Timestamp,PUF Key,Avg Value,High Percentage,Status',
        ...data.data.map(m =>
          `"${m.timestamp}","0x${m.puf_key}",${m.avg_value},${m.high_percentage},"${
            m.high_percentage > 35 && m.high_percentage < 50 ? 'GOOD' : 'UNSTABLE'
          }"`
        ),
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `puf-measurements-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Measurements</h1>
        <button
          onClick={handleExport}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium disabled:opacity-50"
        >
          <Download size={18} />
          {isLoading ? 'Exporting...' : 'Export CSV'}
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 mb-6">
        <div className="flex items-center gap-4">
          <Filter size={20} className="text-gray-400" />
          <div className="flex gap-2">
            {[
              { value: 'all', label: 'All' },
              { value: 'good', label: 'Good Keys' },
              { value: 'bad', label: 'Unstable' },
            ].map(option => (
              <button
                key={option.value}
                onClick={() => setFilterStatus(option.value)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterStatus === option.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <div className="ml-auto text-sm text-gray-400">
            Showing {startIdx + 1}-{Math.min(startIdx + itemsPerPage, filteredMeasurements.length)} of {filteredMeasurements.length}
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
          <div className="text-sm text-gray-400 mb-1">Total Measurements</div>
          <div className="text-2xl font-bold">{stats?.total_measurements || 0}</div>
        </div>
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
          <div className="text-sm text-gray-400 mb-1">Good Keys</div>
          <div className="text-2xl font-bold text-green-400">
            {stats?.good_keys_count || 0} ({stats?.good_keys_percentage || 0}%)
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
          <div className="text-sm text-gray-400 mb-1">Average High %</div>
          <div className="text-2xl font-bold text-purple-400">
            {stats?.avg_high_percent?.toFixed(1) || '—'}%
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900 border-b border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Timestamp</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">PUF Key</th>
                <th className="px-6 py-3 text-right text-sm font-semibold">Avg Value</th>
                <th className="px-6 py-3 text-right text-sm font-semibold">High %</th>
                <th className="px-6 py-3 text-center text-sm font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {paginatedData.map(measurement => (
                <tr
                  key={measurement.id}
                  className="hover:bg-gray-700/30 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {new Date(measurement.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-blue-400">
                    0x{measurement.pufKey}
                  </td>
                  <td className="px-6 py-4 text-sm text-right text-gray-300">
                    {measurement.avgValue.toFixed(1)}
                  </td>
                  <td className="px-6 py-4 text-sm text-right text-gray-300">
                    {measurement.highPercentage.toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 text-center">
                    {measurement.isGoodKey ? (
                      <div className="flex justify-center">
                        <span className="flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-400 rounded text-xs font-medium">
                          <CheckCircle size={14} />
                          GOOD
                        </span>
                      </div>
                    ) : (
                      <div className="flex justify-center">
                        <span className="flex items-center gap-2 px-3 py-1 bg-yellow-500/10 text-yellow-400 rounded text-xs font-medium">
                          <AlertTriangle size={14} />
                          UNSTABLE
                        </span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {paginatedData.length === 0 && (
          <div className="px-6 py-12 text-center text-gray-400">
            No measurements found
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <div className="text-sm text-gray-400">
            Page {page} of {totalPages}
          </div>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
