const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

// --- IN-MEMORY SENSOR SIMULATOR & RISK ENGINE ---
const ZONES = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon'];
const SENSOR_TYPES = [
  { type: 'temperature', name: 'Temp Sensor', unit: '°C', min: 18, max: 42, crit: 65 },
  { type: 'pressure', name: 'Pressure Sensor', unit: 'kPa', min: 98, max: 108, crit: 145 },
  { type: 'sound', name: 'Acoustic Mic', unit: 'dB', min: 35, max: 80, crit: 130 },
  { type: 'vibration', name: 'Tri-Axial Vib', unit: 'mm/s', min: 0.5, max: 8.5, crit: 32 },
  { type: 'gas', name: 'VOC Gas Probe', unit: 'ppm', min: 5, max: 50, crit: 250 },
  { type: 'humidity', name: 'Humidity Meter', unit: '%', min: 40, max: 65, crit: 90 }
];

let sensors = [];
let alerts = [];
let idCounter = 100;

function initSensors() {
  sensors = [];
  idCounter = 100;
  ZONES.forEach(zone => {
    SENSOR_TYPES.forEach(st => {
      idCounter++;
      const val = +(st.min + Math.random() * (st.max - st.min)).toFixed(1);
      sensors.push({
        id: `SEN-${idCounter}`,
        zone: zone,
        type: st.type,
        name: `${st.name} ${zone}-${idCounter % 10}`,
        value: val,
        unit: st.unit,
        minThreshold: st.min,
        maxThreshold: st.max,
        criticalThreshold: st.crit,
        status: 'active',
        battery: Math.floor(85 + Math.random() * 15),
        signalStrength: Math.floor(70 + Math.random() * 30),
        lastReading: new Date().toISOString()
      });
    });
  });
}

function calculateRisk() {
  let totalRisk = 0;
  let criticalCount = 0;
  sensors.forEach(s => {
    let score = 0;
    if (s.value > s.criticalThreshold) {
      score = 100;
      criticalCount++;
    } else if (s.value > s.maxThreshold) {
      score = 50 + ((s.value - s.maxThreshold) / (s.criticalThreshold - s.maxThreshold)) * 50;
    } else {
      score = (s.value / s.maxThreshold) * 30;
    }
    totalRisk += score;
  });

  let score = totalRisk / sensors.length;
  if (criticalCount > 0) {
    score = Math.min(100, score * 1.6 + criticalCount * 12);
  }
  score = +score.toFixed(1);

  let overallRisk = 'LOW';
  if (score > 65) overallRisk = 'CRITICAL';
  else if (score > 35) overallRisk = 'HIGH';
  else if (score > 20) overallRisk = 'MEDIUM';

  return {
    score,
    overallRisk,
    timestamp: new Date().toISOString(),
    factors: [
      { name: 'Thermal Decomposition', score: score * 0.25 },
      { name: 'Pneumatic Overpressure', score: score * 0.20 },
      { name: 'Combustible Gas Density', score: score * 0.20 },
      { name: 'Vibration Telemetry', score: score * 0.15 }
    ]
  };
}

initSensors();

// Periodic Simulation Tick
setInterval(() => {
  sensors.forEach(s => {
    const delta = (Math.random() - 0.49) * (s.maxThreshold - s.minThreshold) * 0.05;
    s.value = +(s.value + delta).toFixed(1);
    s.lastReading = new Date().toISOString();

    if (s.value >= s.criticalThreshold) {
      if (s.status !== 'critical') {
        s.status = 'critical';
        alerts.unshift({
          id: `ALT-${Date.now()}-${Math.floor(Math.random()*1000)}`,
          severity: 'critical',
          zone: s.zone,
          message: `${s.name} crossed critical explosion threshold: ${s.value}${s.unit}`,
          timestamp: new Date().toISOString(),
          acknowledged: false
        });
      }
    } else if (s.value >= s.maxThreshold) {
      s.status = 'warning';
    } else {
      s.status = 'active';
    }
  });

  if (alerts.length > 100) alerts = alerts.slice(0, 100);
}, 1500);

// --- HTTP SERVER ---
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // API Endpoints
  if (pathname === '/api/sensors') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    const risk = calculateRisk();
    res.end(JSON.stringify({
      sensors,
      stats: {
        totalSensors: sensors.length,
        activeSensors: sensors.filter(s => s.status !== 'offline').length,
        totalAlerts: alerts.length,
        unresolvedAlerts: alerts.filter(a => !a.acknowledged).length,
        overallRisk: risk.overallRisk,
        riskScore: risk.score,
        zonesMonitored: ZONES.length,
        uptimePercent: 99.8
      },
      timestamp: new Date().toISOString()
    }));
    return;
  }

  if (pathname === '/api/risk') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      assessment: calculateRisk(),
      zones: ZONES.map(z => ({
        id: z.toLowerCase(),
        name: `Zone ${z}`,
        status: sensors.some(s => s.zone === z && s.status === 'critical') ? 'evacuate' : 'safe',
        sensorCount: sensors.filter(s => s.zone === z).length,
        activeAlerts: alerts.filter(a => a.zone === z && !a.acknowledged).length
      })),
      timestamp: new Date().toISOString()
    }));
    return;
  }

  if (pathname === '/api/alerts') {
    if (req.method === 'PATCH') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const data = JSON.parse(body);
          if (data.alertId) {
            alerts = alerts.map(a => a.id === data.alertId ? { ...a, acknowledged: true } : a);
          } else if (data.action === 'acknowledge_all') {
            alerts = alerts.map(a => ({ ...a, acknowledged: true }));
          }
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true }));
        } catch(e) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
      });
      return;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      alerts: alerts.slice(0, 50),
      total: alerts.length,
      unresolved: alerts.filter(a => !a.acknowledged).length
    }));
    return;
  }

  if (pathname === '/api/simulate' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        if (data.action === 'explosion' && data.zone) {
          sensors.forEach(s => {
            if (s.zone === data.zone) {
              s.value = +(s.criticalThreshold * (1.2 + Math.random() * 0.3)).toFixed(1);
              s.status = 'critical';
            }
          });
          alerts.unshift({
            id: `ALT-${Date.now()}`,
            severity: 'critical',
            zone: data.zone,
            message: `⚠️ EXPLOSION EVENT DETECTED in Zone ${data.zone}! Emergency fire suppression tripped.`,
            timestamp: new Date().toISOString(),
            acknowledged: false
          });
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, message: `Explosion triggered in Zone ${data.zone}` }));
          return;
        }

        if (data.action === 'reset') {
          initSensors();
          alerts = [];
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, message: 'Simulation reset' }));
          return;
        }

        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Unknown action' }));
      } catch (e) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
    return;
  }

  // Static File Serving
  let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);
  
  if (!fs.existsSync(filePath)) {
    filePath = path.join(PUBLIC_DIR, 'index.html');
  }

  const ext = path.extname(filePath);
  const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.svg': 'image/svg+xml'
  };

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end('Server error');
      return;
    }
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
    res.end(content);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`SENTINEL Server running at http://localhost:${PORT}`);
});
