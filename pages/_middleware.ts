import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';

type Environment = 'production' | 'development' | 'other';

export default function RedirectToHTTPS(req: NextRequest, ev: NextFetchEvent) {
  const currentEnv = process.env.NODE_ENV as Environment;
  const protocol = req.headers.get('x-forwarded-proto');
  const host = req.headers.get('host');

  if (currentEnv === 'production' && protocol !== 'https' && !host?.includes('localhost')) {
    return NextResponse.redirect(
      `https://${host}${req.nextUrl.pathname}`,
      301,
    );
  }

  return NextResponse.next();
}
