import { NextResponse } from 'next/server';
import { fetchWeather } from '@/lib/api';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const lat = url.searchParams.get('lat');
    const lon = url.searchParams.get('lon');
    if (!lat || !lon) {
      return NextResponse.json({ error: 'lat and lon are required' }, { status: 400 });
    }

    const latNum = Number(lat);
    const lonNum = Number(lon);
    if (!Number.isFinite(latNum) || !Number.isFinite(lonNum)) {
      return NextResponse.json({ error: 'invalid coordinates' }, { status: 400 });
    }

    const weather = await fetchWeather(latNum, lonNum);
    return NextResponse.json(weather);
  } catch (err) {
    console.error('weather proxy error', err);
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg || 'unknown error' }, { status: 500 });
  }
}
