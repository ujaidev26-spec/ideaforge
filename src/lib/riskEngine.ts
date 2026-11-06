import { Sensor, RiskLevel, RiskAssessment, RiskFactor, SensorType } from '@/types';

const SENSOR_WEIGHTS: Record<SensorType, number> = {
  temperature: 0.25,
  pressure: 0.20,
  gas: 0.20,
  vibration: 0.15,
  sound: 0.10,
  humidity: 0.10,
};

function calculateSensorRiskScore(sensor: Sensor): number {
  const range = sensor.criticalThreshold - sensor.minThreshold;
  if (range <= 0) return 0;

  const normalizedValue = (sensor.value - sensor.minThreshold) / range;
  
  if (sensor.status === 'offline') return 0.5; // Unknown risk
  if (sensor.status === 'critical') return Math.min(1, normalizedValue * 1.2);
  if (sensor.status === 'warning') return Math.min(0.8, normalizedValue);
  
  return Math.max(0, Math.min(1, normalizedValue));
}

function getRiskLevel(score: number): RiskLevel {
  if (score >= 0.8) return 'CRITICAL';
  if (score >= 0.6) return 'HIGH';
  if (score >= 0.35) return 'MEDIUM';
  return 'LOW';
}

function getRecommendation(level: RiskLevel, factors: RiskFactor[]): string {
  const criticalFactors = factors.filter(f => f.score > 0.7);
  
  switch (level) {
    case 'CRITICAL':
      return `IMMEDIATE ACTION REQUIRED: ${criticalFactors.length} critical risk factors detected. Initiate emergency protocols and evacuate affected zones immediately.`;
    case 'HIGH':
      return `HIGH ALERT: Elevated risk levels detected. Review ${criticalFactors.length} contributing factors and prepare contingency measures. Consider restricting access to affected zones.`;
    case 'MEDIUM':
      return `CAUTION: Moderate risk levels observed. Continue monitoring and verify sensor calibration. Schedule maintenance for affected equipment.`;
    case 'LOW':
      return 'Operations within normal parameters. Continue standard monitoring procedures.';
  }
}

export function assessRisk(sensors: Sensor[]): RiskAssessment {
  const activeSensors = sensors.filter(s => s.status !== 'offline' && s.status !== 'maintenance');
  
  // Group sensors by type
  const sensorsByType: Partial<Record<SensorType, Sensor[]>> = {};
  activeSensors.forEach(sensor => {
    if (!sensorsByType[sensor.type]) {
      sensorsByType[sensor.type] = [];
    }
    sensorsByType[sensor.type]!.push(sensor);
  });

  const factors: RiskFactor[] = [];
  let weightedScoreSum = 0;
  let totalWeight = 0;

  (Object.keys(SENSOR_WEIGHTS) as SensorType[]).forEach(type => {
    const typeSensors = sensorsByType[type] || [];
    if (typeSensors.length === 0) return;

    const avgScore = typeSensors.reduce((sum, s) => sum + calculateSensorRiskScore(s), 0) / typeSensors.length;
    const maxScore = Math.max(...typeSensors.map(s => calculateSensorRiskScore(s)));
    
    // Use max-weighted average to emphasize worst-case
    const factorScore = avgScore * 0.4 + maxScore * 0.6;
    const weight = SENSOR_WEIGHTS[type];

    factors.push({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      weight,
      score: parseFloat(factorScore.toFixed(3)),
      description: getFactorDescription(type, factorScore, typeSensors.length),
      sensorIds: typeSensors.map(s => s.id),
    });

    weightedScoreSum += factorScore * weight;
    totalWeight += weight;
  });

  const overallScore = totalWeight > 0 ? weightedScoreSum / totalWeight : 0;
  
  // Boost score if multiple factors are high
  const highFactors = factors.filter(f => f.score > 0.6).length;
  const boostedScore = Math.min(1, overallScore * (1 + highFactors * 0.05));
  
  const overallRisk = getRiskLevel(boostedScore);

  return {
    overallRisk,
    score: parseFloat((boostedScore * 100).toFixed(1)),
    maxScore: 100,
    factors: factors.sort((a, b) => b.score - a.score),
    timestamp: new Date().toISOString(),
    recommendation: getRecommendation(overallRisk, factors),
  };
}

function getFactorDescription(type: SensorType, score: number, count: number): string {
  const level = score > 0.7 ? 'critically elevated' : score > 0.4 ? 'elevated' : 'within normal range';
  return `${count} ${type} sensor${count > 1 ? 's' : ''}: readings ${level}`;
}

export function assessZoneRisk(sensors: Sensor[], zone: string): { riskLevel: RiskLevel; score: number } {
  const zoneSensors = sensors.filter(s => s.zone === zone);
  if (zoneSensors.length === 0) return { riskLevel: 'LOW', score: 0 };

  const assessment = assessRisk(zoneSensors);
  return { riskLevel: assessment.overallRisk, score: assessment.score };
}
