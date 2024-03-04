'use client';

import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';

import { Button, SiteLogo } from '@/library';
import { authenticate } from '@/app/actions';

import styles from './LoginForm.module.css';

const LoginButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} type='submit'>
      {pending ? '🥷 Дзвонимо в ГУР...' : '🗝️ Увійти'}
    </Button>
  );
};

export const LoginForm = () => {
  const [status, dispatch] = useFormState(authenticate, undefined);
  const router = useRouter();

  useEffect(() => {
    if (status === 'Success') {
      router.push('/');
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
        {status === 'Wrong login or password' && (
          <div className={styles.error}>
            <p>
              В ГУРі тебе не знають. Висилаємо безліч бобіків та
              бронетранспортер.
            </p>
            <p>Тікай в жито</p>
          </div>
        )}
        <LoginButton />
      </form>
    </div>
  );
};
