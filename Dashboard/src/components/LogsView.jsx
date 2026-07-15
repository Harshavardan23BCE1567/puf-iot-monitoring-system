import React, { useState } from 'react';
import { FileText, Copy, Download, Trash2 } from 'lucide-react';

export default function LogsView({ logs = [] }) {
  const [autoScroll, setAutoScroll] = useState(true);
  const logsEndRef = React.useRef(null);

  React.useEffect(() => {
    if (autoScroll && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  const handleCopyLogs = () => {
    const logText = logs.map(l => l.line).join('\n');
    navigator.clipboard.writeText(logText);
  };

  const handleDownloadLogs = () => {
    const logText = logs.map(l => `${new Date(l.timestamp).toISOString()} ${l.line}`).join('\n');
    const blob = new Blob([logText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `puf-logs-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
  };

  const handleClearLogs = () => {
    if (confirm('Clear all logs?')) {
      // This would need to be implemented in the parent component
    }
  };

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <FileText className="text-blue-400" />
          System Logs
        </h1>
        <div className="flex gap-2">
          <button
            onClick={handleCopyLogs}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            title="Copy all logs"
          >
            <Copy size={18} />
            <span className="hidden sm:inline">Copy</span>
          </button>
          <button
            onClick={handleDownloadLogs}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            title="Download logs"
          >
            <Download size={18} />
            <span className="hidden sm:inline">Download</span>
          </button>
          <button
            onClick={handleClearLogs}
            className="flex items-center gap-2 px-4 py-2 bg-red-700 hover:bg-red-600 rounded-lg transition-colors"
            title="Clear logs"
          >
            <Trash2 size={18} />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 mb-4 bg-gray-800 rounded-lg border border-gray-700 p-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={autoScroll}
            onChange={(e) => setAutoScroll(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm">Auto-scroll to latest</span>
        </label>
        <div className="ml-auto text-sm text-gray-400">
          {logs.length} log entries
        </div>
      </div>

      {/* Logs Container */}
      <div className="flex-1 bg-gray-900 rounded-lg border border-gray-700 overflow-hidden flex flex-col">
        <pre className="flex-1 overflow-auto p-4 font-mono text-sm text-gray-300 whitespace-pre-wrap break-words">
          {logs.length === 0 ? (
            <span className="text-gray-500">Waiting for logs...</span>
          ) : (
            <>
              {logs.map((log, index) => (
                <div key={index} className="mb-1">
                  <span className="text-gray-600">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  {' '}
                  <span className={log.line.includes('ERROR') ? 'text-red-400' : 
                                   log.line.includes('GOOD') ? 'text-green-400' :
                                   log.line.includes('UNSTABLE') ? 'text-yellow-400' :
                                   'text-gray-300'}>
                    {log.line}
                  </span>
                </div>
              ))}
              <div ref={logsEndRef} />
            </>
          )}
        </pre>
      </div>
    </div>
  );
}
