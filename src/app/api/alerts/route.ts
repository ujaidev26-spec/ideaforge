import { NextRequest, NextResponse } from 'next/server';
import { getStore } from '@/lib/store';

export async function GET(request: NextRequest) {
  const store = getStore();
  const { searchParams } = new URL(request.url);
  
  const severity = searchParams.get('severity');
  const acknowledged = searchParams.get('acknowledged');
  const limit = parseInt(searchParams.get('limit') || '50');

  let alerts = store.alerts;

  if (severity) {
    alerts = alerts.filter(a => a.severity === severity);
  }
  if (acknowledged !== null && acknowledged !== undefined) {
    alerts = alerts.filter(a => a.acknowledged === (acknowledged === 'true'));
  }

  return NextResponse.json({
    alerts: alerts.slice(0, limit),
    total: alerts.length,
    unresolved: alerts.filter(a => !a.acknowledged).length,
    timestamp: new Date().toISOString(),
  });
}

export async function PATCH(request: NextRequest) {
  const store = getStore();
  const body = await request.json();
  
  if (body.alertId && body.action === 'acknowledge') {
    store.acknowledgeAlert(body.alertId);
    return NextResponse.json({ success: true });
  }

  if (body.action === 'acknowledge_all') {
    store.alerts.forEach(a => { a.acknowledged = true; });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
