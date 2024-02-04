import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export const middleware = async (request: NextRequest) => {
  const requestUrl = new URL(request.url);
  const token = cookies().get('authorization');

  if (!token?.value) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (requestUrl.pathname === '/login') {
    if (token) {
      // return NextResponse.redirect(new URL('/jars', request.url));
    }
  }
};

export const config = {
  matcher: [{ source: '/jars' }, { source: '/login' }],
};
