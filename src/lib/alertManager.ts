import { Sensor, Alert, AlertSeverity, SensorStatus } from '@/types';

let alertIdCounter = 0;

function generateAlertId(): string {
  alertIdCounter++;
  return `ALT-${String(alertIdCounter).padStart(5, '0')}`;
}

export function checkSensorAlerts(sensor: Sensor, previousStatus: SensorStatus): Alert | null {
  // Only generate alert on status change or critical readings
  if (sensor.status === previousStatus && sensor.status === 'active') {
    return null;
  }

  let severity: AlertSeverity;
  let type: string;
  let message: string;

  if (sensor.status === 'critical') {
    severity = 'critical';
    type = 'THRESHOLD_EXCEEDED';
    message = `${sensor.name} in ${sensor.zone} zone has reached CRITICAL level: ${sensor.value}${sensor.unit} (threshold: ${sensor.criticalThreshold}${sensor.unit})`;
  } else if (sensor.status === 'warning') {
    severity = 'warning';
    type = 'THRESHOLD_WARNING';
    message = `${sensor.name} in ${sensor.zone} zone is approaching limits: ${sensor.value}${sensor.unit} (max: ${sensor.maxThreshold}${sensor.unit})`;
  } else if (sensor.status === 'offline') {
    severity = 'danger';
    type = 'SENSOR_OFFLINE';
    message = `${sensor.name} in ${sensor.zone} zone has gone offline. Last reading: ${sensor.value}${sensor.unit}`;
  } else if (previousStatus !== 'active' && sensor.status === 'active') {
    severity = 'info';
    type = 'SENSOR_RECOVERED';
    message = `${sensor.name} in ${sensor.zone} zone has returned to normal operation: ${sensor.value}${sensor.unit}`;
  } else {
    return null;
  }

  return {
    id: generateAlertId(),
    sensorId: sensor.id,
    sensorName: sensor.name,
    type,
    message,
    severity,
    timestamp: new Date().toISOString(),
    acknowledged: false,
    zone: sensor.zone,
  };
}

export function generateExplosionAlerts(zone: string): Alert[] {
  return [
    {
      id: generateAlertId(),
      sensorId: 'SYSTEM',
      sensorName: 'System',
      type: 'EXPLOSION_DETECTED',
      message: `⚠️ EXPLOSION EVENT DETECTED in ${zone} zone! Multiple sensors reporting critical values. Emergency protocols activated.`,
      severity: 'critical',
      timestamp: new Date().toISOString(),
      acknowledged: false,
      zone,
    },
    {
      id: generateAlertId(),
      sensorId: 'SYSTEM',
      sensorName: 'System',
      type: 'EVACUATION_ORDER',
      message: `🚨 EVACUATION ORDER issued for ${zone} zone and adjacent areas. All personnel must proceed to designated safe zones.`,
      severity: 'critical',
      timestamp: new Date().toISOString(),
      acknowledged: false,
      zone,
    },
  ];
}

export function resetAlertCounter(): void {
  alertIdCounter = 0;
}
