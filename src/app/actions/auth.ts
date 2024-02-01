'use server';

import { serialize } from 'cookie';
import { NextApiResponse } from 'next';
// import { cookies } from 'next/headers';

import { signIn } from '../dal';

// useFormState adds some shit into FormData
const handleSignIn = async (reactFormData: FormData) => {
  // return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjo3fSwiaWF0IjoxNzA2NzA3MjY0LCJleHAiOjE3MDY3MTA4NjR9.fLGihNUAbniE44RTmVNe_2w8SbGBh5W-uOT6paEblEk';
  const password = reactFormData.get('password') as string;
  const email = reactFormData.get('email') as string;

  const cleanedFormData = new FormData();
  cleanedFormData.append('password', password);
  cleanedFormData.append('email', email);

  const response = await signIn(cleanedFormData);

  return response.token;
};

let token: null | string = null;

export const getAuthToken = async () => token;

export const authenticate = async (
  currentState: string | undefined,
  formData: FormData
) => {
  try {
    const authToken = await handleSignIn(formData);

    token = authToken;

    return 'Success';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error);
    if (error) {
      switch (error.statusText) {
        case 'Forbidden':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
};

export const setTokenCookie = (res: NextApiResponse) => {
  if (!token) {
    return;
  }

  const cookie = serialize('authorization', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development', // use secure cookie in production
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  });

  res.setHeader('Set-Cookie', cookie);
};
