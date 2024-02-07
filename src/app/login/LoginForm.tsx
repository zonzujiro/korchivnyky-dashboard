'use client';

//TODO: replace with server component

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFormState, useFormStatus } from 'react-dom';

import { Button, SiteLogo } from '../library';

import styles from './LoginForm.module.css';
import { authenticate, getAuthToken } from '@/app/actions/auth';

const LoginButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} type='submit'>
      {pending ? '🥷 Дзвонимо в ГУР...' : '🗝️ Увійти'}
    </Button>
  );
};

export const LoginFormPage = () => {
  const router = useRouter();

  const [status, dispatch] = useFormState(authenticate, undefined);

  useEffect(() => {
    const navigate = async () => {
      const token = await getAuthToken();

      if (token) {
        router.push('/');
      }
    };

    if (status === 'Success') {
      navigate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <div className={styles['login-form-wrapper']}>
      <SiteLogo />
      <form action={dispatch} className={styles['login-form']}>
        <input type='email' name='email' placeholder='Email' required />
        <input
          type='password'
          name='password'
          placeholder='Password'
          required
        />
        <div>
          {status === 'Invalid credentials.' && (
            <p>
              В ГУРі тебе не знають. Висилаємо безліч бобіків та
              бронетранспортер. Тікай в жито
            </p>
          )}
        </div>
        <LoginButton />
      </form>
    </div>
  );
};
