const socket = io();

const statusEl = document.getElementById('status');
const pufEl = document.getElementById('puf');
const metaEl = document.getElementById('meta');
const logEl = document.getElementById('log');
const restartBtn = document.getElementById('restart');

socket.on('connect', () => {
  statusEl.textContent = 'connected to server';
});

socket.on('status', s => {
  statusEl.textContent = s.message || JSON.stringify(s);
});

socket.on('serial-line', line => {
  appendLog(line);
});

socket.on('puf', data => {
  pufEl.textContent = data.key || '—';
  metaEl.textContent = `avg: ${data.avg !== null ? data.avg.toFixed(1) : '—'} | high%: ${data.highPct !== null ? data.highPct.toFixed(1) : '—'}`;
  appendLog('→ PUF:' + (data.key || '') + '  ' + (data.raw || ''));
});

restartBtn.addEventListener('click', () => {
  socket.emit('restart-serial');
});

function appendLog(line) {
  logEl.textContent += line + '\n';
  logEl.scrollTop = logEl.scrollHeight;
}
