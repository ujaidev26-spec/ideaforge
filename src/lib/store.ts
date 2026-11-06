import { Sensor, Alert, RiskAssessment, Zone, DashboardStats } from '@/types';
import { generateInitialSensors, simulateReading, simulateExplosionEvent } from './sensorSimulator';
import { assessRisk, assessZoneRisk } from './riskEngine';
import { checkSensorAlerts, generateExplosionAlerts } from './alertManager';

// In-memory store (server-side singleton for API routes)
class SensorStore {
  sensors: Sensor[];
  alerts: Alert[];
  riskAssessment: RiskAssessment | null;
  zones: Zone[];
  private previousStatuses: Map<string, string>;

  constructor() {
    this.sensors = generateInitialSensors();
    this.alerts = [];
    this.riskAssessment = null;
    this.zones = [];
    this.previousStatuses = new Map();
    
    this.sensors.forEach(s => this.previousStatuses.set(s.id, s.status));
    this.updateRiskAssessment();
    this.updateZones();
  }

  tick(intensity: number = 1): void {
    this.sensors = this.sensors.map(sensor => {
      if (sensor.status === 'maintenance') return sensor;
      
      const reading = simulateReading(sensor, intensity);
      const previousStatus = this.previousStatuses.get(sensor.id) || 'active';
      
      const updatedSensor: Sensor = {
        ...sensor,
        value: reading.value,
        status: reading.newStatus,
        lastReading: reading.timestamp,
        battery: Math.max(0, sensor.battery - 0.01),
        signalStrength: Math.max(0, Math.min(100, sensor.signalStrength + (Math.random() - 0.5) * 2)),
      };

      const alert = checkSensorAlerts(updatedSensor, previousStatus as any);
      if (alert) {
        this.alerts.unshift(alert);
        if (this.alerts.length > 200) {
          this.alerts = this.alerts.slice(0, 200);
        }
      }

      this.previousStatuses.set(sensor.id, updatedSensor.status);
      return updatedSensor;
    });

    this.updateRiskAssessment();
    this.updateZones();
  }

  triggerExplosion(zone: string): void {
    const readings = simulateExplosionEvent(this.sensors, zone);
    
    this.sensors = this.sensors.map(sensor => {
      const reading = readings.find(r => r.sensorId === sensor.id);
      if (!reading) return sensor;
      
      return {
        ...sensor,
        value: reading.value,
        status: reading.newStatus,
        lastReading: reading.timestamp,
      };
    });

    const explosionAlerts = generateExplosionAlerts(zone);
    this.alerts.unshift(...explosionAlerts);
    
    this.updateRiskAssessment();
    this.updateZones();
  }

  acknowledgeAlert(alertId: string): void {
    this.alerts = this.alerts.map(a =>
      a.id === alertId ? { ...a, acknowledged: true } : a
    );
  }

  private updateRiskAssessment(): void {
    this.riskAssessment = assessRisk(this.sensors);
  }

  private updateZones(): void {
    const zoneNames = Array.from(new Set(this.sensors.map(s => s.zone)));
    this.zones = zoneNames.map(name => {
      const zoneSensors = this.sensors.filter(s => s.zone === name);
      const { riskLevel } = assessZoneRisk(this.sensors, name);
      const activeAlerts = this.alerts.filter(a => a.zone === name && !a.acknowledged).length;

      let status: Zone['status'] = 'safe';
      if (riskLevel === 'CRITICAL') status = 'evacuate';
      else if (riskLevel === 'HIGH') status = 'danger';
      else if (riskLevel === 'MEDIUM') status = 'caution';

      return {
        id: name.toLowerCase(),
        name: `Zone ${name}`,
        status,
        sensorCount: zoneSensors.length,
        riskLevel,
        activeAlerts,
      };
    });
  }

  getStats(): DashboardStats {
    return {
      totalSensors: this.sensors.length,
      activeSensors: this.sensors.filter(s => s.status !== 'offline' && s.status !== 'maintenance').length,
      totalAlerts: this.alerts.length,
      unresolvedAlerts: this.alerts.filter(a => !a.acknowledged).length,
      overallRisk: this.riskAssessment?.overallRisk || 'LOW',
      riskScore: this.riskAssessment?.score || 0,
      zonesMonitored: this.zones.length,
      uptimePercent: parseFloat(((this.sensors.filter(s => s.status !== 'offline').length / this.sensors.length) * 100).toFixed(1)),
    };
  }
}

// Singleton pattern
let store: SensorStore | null = null;

export function getStore(): SensorStore {
  if (!store) {
    store = new SensorStore();
  }
  return store;
}
