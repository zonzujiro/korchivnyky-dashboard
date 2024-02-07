'use server';

import { signIn } from '../dal';

// useFormState adds some shit into FormData
const handleSignIn = async (reactFormData: FormData) => {
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
