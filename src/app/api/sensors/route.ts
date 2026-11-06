import { NextRequest, NextResponse } from 'next/server';
import { getStore } from '@/lib/store';

export async function GET(request: NextRequest) {
  const store = getStore();
  const { searchParams } = new URL(request.url);
  
  const zone = searchParams.get('zone');
  const type = searchParams.get('type');
  const status = searchParams.get('status');

  // Simulate a tick on every fetch for real-time feel
  store.tick();

  let sensors = store.sensors;

  if (zone) {
    sensors = sensors.filter(s => s.zone === zone);
  }
  if (type) {
    sensors = sensors.filter(s => s.type === type);
  }
  if (status) {
    sensors = sensors.filter(s => s.status === status);
  }

  return NextResponse.json({
    sensors,
    stats: store.getStats(),
    timestamp: new Date().toISOString(),
  });
}
