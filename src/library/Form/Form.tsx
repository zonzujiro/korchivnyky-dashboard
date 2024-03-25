'use client';

import type { ReactNode } from 'react';
import { useFormStatus } from 'react-dom';

import { Button } from '../Button/Button';

import styles from './Form.module.css';

export const SubmitButton = ({ className }: { className?: string }) => {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} type='submit' className={className}>
      {pending ? 'Зберігаємо...' : '💾 Зберегти'}
    </Button>
  );
};

export const Fieldset = ({ children }: { children: ReactNode }) => {
  return <fieldset className={styles['form-inputs']}>{children}</fieldset>;
};

export const resetInputValidity = (ev: React.ChangeEvent<HTMLInputElement>) =>
  ev.currentTarget.setCustomValidity('');
