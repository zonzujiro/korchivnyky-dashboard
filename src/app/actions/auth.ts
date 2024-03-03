'use server';

import { signIn } from '@/dal';
import { cookies } from 'next/headers';

export const authenticate = async (
  currentState: string | undefined,
  formData: FormData
) => {
  try {
    const requestPayload: { email: string; password: string } = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    const response = await signIn(requestPayload);

    if (response.token) {
      cookies().set({
        name: 'authorization-test-2',
        value: response.token,
        httpOnly: true,
        maxAge: 500,
      });
    }

    return 'Success';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error);
    if (error) {
      switch (error.code) {
        case 'FORBIDDEN':
          return 'Wrong login or password';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
};
