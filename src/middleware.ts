import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export const middleware = async (request: NextRequest) => {
  const requestUrl = new URL(request.url);
  const token = cookies().get('authorization-test');

  if (requestUrl.pathname !== '/login' && !token?.value) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (requestUrl.pathname === '/login' && token?.value) {
    return NextResponse.redirect(new URL('/', request.url));
  }
};

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|site-logo.svg).*)'],
};
