import { NextResponse } from 'next/server';

export async function GET() {
  return new NextResponse('google-site-verification: google73d1079546efeefe.html', {
    status: 200,
    headers: {
      'Content-Type': 'text/html',
    },
  });
}

