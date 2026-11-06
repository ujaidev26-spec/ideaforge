import { NextRequest, NextResponse } from 'next/server';
import { getStore } from '@/lib/store';

export async function POST(request: NextRequest) {
  const store = getStore();
  const body = await request.json();

  const { action, zone, intensity } = body;

  switch (action) {
    case 'explosion':
      if (!zone) {
        return NextResponse.json({ error: 'Zone is required for explosion simulation' }, { status: 400 });
      }
      store.triggerExplosion(zone);
      return NextResponse.json({
        success: true,
        message: `Explosion simulation triggered in Zone ${zone}`,
        riskAssessment: store.riskAssessment,
        alerts: store.alerts.slice(0, 5),
      });

    case 'tick':
      const tickIntensity = intensity || 1;
      for (let i = 0; i < (body.ticks || 1); i++) {
        store.tick(tickIntensity);
      }
      return NextResponse.json({
        success: true,
        stats: store.getStats(),
      });

    case 'reset':
      // Reset store by reconstructing
      const newStore = getStore();
      newStore.sensors = require('@/lib/sensorSimulator').generateInitialSensors();
      newStore.alerts = [];
      return NextResponse.json({
        success: true,
        message: 'Simulation reset to initial state',
      });

    default:
      return NextResponse.json({ error: 'Invalid action. Use: explosion, tick, reset' }, { status: 400 });
  }
}
