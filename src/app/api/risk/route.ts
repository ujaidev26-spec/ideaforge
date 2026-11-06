import { NextResponse } from 'next/server';
import { getStore } from '@/lib/store';

export async function GET() {
  const store = getStore();
  store.tick();

  return NextResponse.json({
    assessment: store.riskAssessment,
    zones: store.zones,
    timestamp: new Date().toISOString(),
  });
}
