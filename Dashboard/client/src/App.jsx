import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'
import axios from 'axios'
import KeyCard from './components/KeyCard'
import ChartView from './components/ChartView'

const socket = io();

export default function App() {
  const [status, setStatus] = useState('starting...');
  const [latest, setLatest] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    socket.on('status', s => setStatus(s.message || JSON.stringify(s)));
    socket.on('puf', data => {
      setLatest(data);
      setHistory(h => [data, ...h].slice(0, 200));
    });
    socket.on('serial-line', line => console.debug('serial', line));

    axios.get('/api/keys').then(r => setHistory(r.data.keys || []));

    return () => socket.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">PUF Dashboard — Device Monitor</h1>
          <div className="text-sm text-gray-600">Status: {status}</div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-2">
            <div className="bg-white shadow rounded p-4">
              <h2 className="text-lg font-medium mb-2">Latest PUF Key</h2>
              {latest ? <KeyCard entry={latest} /> : <div className="text-gray-500">No data yet</div>}
            </div>
          </div>
          <div>
            <div className="bg-white shadow rounded p-4">
              <h2 className="text-lg font-medium mb-2">Stats</h2>
              <div className="text-sm text-gray-700">Stored keys: {history.length}</div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded p-4 mb-6">
          <h2 className="text-lg font-medium mb-4">Key History</h2>
          <ChartView items={history.slice(0, 50)} />
        </div>

        <div className="bg-white shadow rounded p-4">
          <h2 className="text-lg font-medium mb-2">Recent Keys</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {history.slice(0, 20).map((e, i) => (
              <KeyCard key={e.ts + i} entry={e} compact />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
