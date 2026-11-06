// Sensor types for firecracker monitoring
export type SensorType = 'temperature' | 'pressure' | 'sound' | 'vibration' | 'gas' | 'humidity';

export type SensorStatus = 'active' | 'warning' | 'critical' | 'offline' | 'maintenance';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type AlertSeverity = 'info' | 'warning' | 'danger' | 'critical';

export type ZoneStatus = 'safe' | 'caution' | 'danger' | 'evacuate';

export interface Sensor {
  id: string;
  name: string;
  type: SensorType;
  location: string;
  zone: string;
  value: number;
  unit: string;
  minThreshold: number;
  maxThreshold: number;
  criticalThreshold: number;
  status: SensorStatus;
  lastReading: string;
  battery: number;
  signalStrength: number;
}

export interface SensorReading {
  sensorId: string;
  value: number;
  timestamp: string;
}

export interface Alert {
  id: string;
  sensorId: string;
  sensorName: string;
  type: string;
  message: string;
  severity: AlertSeverity;
  timestamp: string;
  acknowledged: boolean;
  zone: string;
}

export interface RiskAssessment {
  overallRisk: RiskLevel;
  score: number;
  maxScore: number;
  factors: RiskFactor[];
  timestamp: string;
  recommendation: string;
}

export interface RiskFactor {
  name: string;
  weight: number;
  score: number;
  description: string;
  sensorIds: string[];
}

export interface Zone {
  id: string;
  name: string;
  status: ZoneStatus;
  sensorCount: number;
  riskLevel: RiskLevel;
  activeAlerts: number;
}

export interface DashboardStats {
  totalSensors: number;
  activeSensors: number;
  totalAlerts: number;
  unresolvedAlerts: number;
  overallRisk: RiskLevel;
  riskScore: number;
  zonesMonitored: number;
  uptimePercent: number;
}

export interface SimulationConfig {
  intensity: 'low' | 'medium' | 'high' | 'extreme';
  duration: number;
  affectedZones: string[];
  sensorTypes: SensorType[];
}

export interface HistoricalDataPoint {
  timestamp: string;
  value: number;
  sensorId: string;
}
