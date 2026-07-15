import React from 'react'

export default function KeyCard({ entry, compact }) {
  if (!entry) return null;
  return (
    <div className={`border rounded p-3 ${compact ? 'text-sm' : ''}`}>
      <div className="font-mono text-lg break-all">0x{entry.key}</div>
      <div className="text-gray-600 mt-1">avg: {entry.avg !== null ? entry.avg.toFixed(1) : '—'} | high%: {entry.highPct !== null ? entry.highPct.toFixed(1) : '—'}</div>
      <div className="text-xs text-gray-400 mt-2">{new Date(entry.ts).toLocaleString()}</div>
    </div>
  )
}
