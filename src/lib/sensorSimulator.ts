import { Sensor, SensorType, SensorReading, SensorStatus } from '@/types';

const SENSOR_CONFIGS: Record<SensorType, { unit: string; baseMin: number; baseMax: number; criticalMin: number; criticalMax: number }> = {
  temperature: { unit: '°C', baseMin: 15, baseMax: 45, criticalMin: 5, criticalMax: 85 },
  pressure: { unit: 'kPa', baseMin: 95, baseMax: 110, criticalMin: 80, criticalMax: 150 },
  sound: { unit: 'dB', baseMin: 30, baseMax: 90, criticalMin: 0, criticalMax: 140 },
  vibration: { unit: 'mm/s', baseMin: 0, baseMax: 15, criticalMin: 0, criticalMax: 50 },
  gas: { unit: 'ppm', baseMin: 0, baseMax: 100, criticalMin: 0, criticalMax: 500 },
  humidity: { unit: '%', baseMin: 30, baseMax: 70, criticalMin: 10, criticalMax: 95 },
};

const ZONES = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon'];
const LOCATIONS = [
  'Storage Bay A', 'Storage Bay B', 'Assembly Line 1', 'Assembly Line 2',
  'Loading Dock', 'Testing Chamber', 'Control Room', 'Perimeter North',
  'Perimeter South', 'Warehouse East', 'Warehouse West', 'Quality Lab',
];

let sensorIdCounter = 0;

function generateSensorId(): string {
  sensorIdCounter++;
  return `SEN-${String(sensorIdCounter).padStart(4, '0')}`;
}

export function createSensor(type: SensorType, zone: string, location: string): Sensor {
  const config = SENSOR_CONFIGS[type];
  const midValue = (config.baseMin + config.baseMax) / 2;
  const variance = (config.baseMax - config.baseMin) * 0.1;
  const value = midValue + (Math.random() - 0.5) * variance * 2;

  return {
    id: generateSensorId(),
    name: `${type.charAt(0).toUpperCase() + type.slice(1)} Sensor ${zone}-${sensorIdCounter}`,
    type,
    location,
    zone,
    value: parseFloat(value.toFixed(2)),
    unit: config.unit,
    minThreshold: config.baseMin,
    maxThreshold: config.baseMax,
    criticalThreshold: config.criticalMax,
    status: 'active',
    lastReading: new Date().toISOString(),
    battery: 70 + Math.random() * 30,
    signalStrength: 60 + Math.random() * 40,
  };
}

export function generateInitialSensors(): Sensor[] {
  sensorIdCounter = 0;
  const sensors: Sensor[] = [];
  const types: SensorType[] = ['temperature', 'pressure', 'sound', 'vibration', 'gas', 'humidity'];

  ZONES.forEach((zone, zi) => {
    types.forEach((type, ti) => {
      const location = LOCATIONS[(zi * types.length + ti) % LOCATIONS.length];
      sensors.push(createSensor(type, zone, location));
    });
  });

  return sensors;
}

export function simulateReading(sensor: Sensor, intensity: number = 1): SensorReading & { newStatus: SensorStatus } {
  const config = SENSOR_CONFIGS[sensor.type];
  const range = config.baseMax - config.baseMin;
  
  // Add some random walk behavior
  const drift = (Math.random() - 0.5) * range * 0.05 * intensity;
  const spike = Math.random() < 0.02 * intensity ? (Math.random() - 0.3) * range * 0.5 * intensity : 0;
  
  let newValue = sensor.value + drift + spike;
  
  // Clamp to physical limits
  newValue = Math.max(config.criticalMin, Math.min(config.criticalMax, newValue));
  newValue = parseFloat(newValue.toFixed(2));

  // Determine status
  let newStatus: SensorStatus = 'active';
  if (newValue > config.criticalMax * 0.9 || newValue < config.criticalMin * 1.1) {
    newStatus = 'critical';
  } else if (newValue > config.baseMax || newValue < config.baseMin) {
    newStatus = 'warning';
  }

  // Small chance of going offline
  if (Math.random() < 0.001) {
    newStatus = 'offline';
  }

  return {
    sensorId: sensor.id,
    value: newValue,
    timestamp: new Date().toISOString(),
    newStatus,
  };
}

export function simulateExplosionEvent(sensors: Sensor[], zone: string): (SensorReading & { newStatus: SensorStatus })[] {
  return sensors
    .filter(s => s.zone === zone)
    .map(sensor => {
      const config = SENSOR_CONFIGS[sensor.type];
      let value: number;

      switch (sensor.type) {
        case 'temperature':
          value = config.criticalMax * (0.7 + Math.random() * 0.3);
          break;
        case 'pressure':
          value = config.criticalMax * (0.8 + Math.random() * 0.2);
          break;
        case 'sound':
          value = config.criticalMax * (0.85 + Math.random() * 0.15);
          break;
        case 'vibration':
          value = config.criticalMax * (0.6 + Math.random() * 0.4);
          break;
        case 'gas':
          value = config.criticalMax * (0.5 + Math.random() * 0.5);
          break;
        case 'humidity':
          value = config.criticalMin + Math.random() * 10;
          break;
        default:
          value = config.criticalMax * 0.9;
      }

      return {
        sensorId: sensor.id,
        value: parseFloat(value.toFixed(2)),
        timestamp: new Date().toISOString(),
        newStatus: 'critical' as SensorStatus,
      };
    });
}

export function getHistoricalData(sensorId: string, hours: number = 24): { timestamp: string; value: number }[] {
  const data: { timestamp: string; value: number }[] = [];
  const now = Date.now();
  const interval = (hours * 60 * 60 * 1000) / 100;
  let value = 25 + Math.random() * 20;

  for (let i = 100; i >= 0; i--) {
    value += (Math.random() - 0.5) * 3;
    value = Math.max(10, Math.min(80, value));
    data.push({
      timestamp: new Date(now - i * interval).toISOString(),
      value: parseFloat(value.toFixed(2)),
    });
  }

  return data;
}
