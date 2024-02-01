import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

/**
 * This route is necessary because we don't have an access to cookies
 * in auth server action. Because auth is used to handle form in the client
 * component. Therefore - auth is consumed on client, therefore no access to
 * next/headers.
 *
 * So I sent additional request from signIn function to catch it here
 * and set cookies
 */

export async function POST(request: Request) {
  const body = await request.json();
  const response = NextResponse.json({ status: 200 });

  console.log({ saveToken: body.token });

  // cookies().delete('authorization');
  // response.cookies.delete('authorization');

  cookies().set({
    name: 'authorization',
    value: body.token,
    // httpOnly: true,
  });

  response.cookies.set('authorization', body.token);

  return response;
}
