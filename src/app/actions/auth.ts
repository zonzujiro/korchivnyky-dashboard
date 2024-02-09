'use server';

import { signIn } from '../dal';

let token: null | string = null;

export const getAuthToken = async () => token;

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

    token = response.token;

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
