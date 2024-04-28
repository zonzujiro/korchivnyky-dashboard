'use client';

import { type ChangeEvent, useState, type ReactNode } from 'react';
import { useFormStatus } from 'react-dom';

import type { User } from '@/types';

import { Button } from '../Button/Button';

import styles from './Form.module.css';

export const SubmitButton = ({
  disabled,
  className,
}: {
  disabled?: boolean;
  className?: string;
}) => {
  const { pending } = useFormStatus();

  return (
    <Button disabled={disabled || pending} type='submit' className={className}>
      {pending ? 'Зберігаємо...' : '💾 Зберегти'}
    </Button>
  );
};

export const DeleteButton = ({
  className,
  onClick,
}: {
  className?: string;
  onClick: () => Promise<void>;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    await onClick();
    setIsLoading(false);
  };

  return (
    <Button
      disabled={isLoading}
      type='button'
      className={className}
      color='red'
      onClick={handleClick}
    >
      {isLoading ? 'Видаляємо...' : '🗑️ Видалити'}
    </Button>
  );
};

export const FormButtons = ({
  handleDeletion,
}: {
  handleDeletion?: null | (() => Promise<void>);
}) => {
  const [deleting, setDeleting] = useState(false);

  const onDeleteButtonClick = async () => {
    setDeleting(true);
    await handleDeletion?.();
    setDeleting(false);
  };

  return (
    <>
      <SubmitButton disabled={deleting} />
      {handleDeletion ? <DeleteButton onClick={onDeleteButtonClick} /> : null}
    </>
  );
};

export const Fieldset = ({ children }: { children: ReactNode }) => {
  return <fieldset className={styles['form-inputs']}>{children}</fieldset>;
};

export const UserSelect = ({
  users,
  defaultValue,
  name = 'userId',
  onChange,
}: {
  users: Array<User>;
  defaultValue?: string | number;
  name?: string;
  onChange?: (ev: ChangeEvent<HTMLSelectElement>) => void;
}) => {
  return (
    <select
      id='user-select'
      name={name}
      defaultValue={defaultValue}
      onChange={onChange}
    >
      <option value='all'>Всі</option>
      {users.map((user) => (
        <option key={user.id} value={user.id}>
          {user.name}
        </option>
      ))}
    </select>
  );
};

export const resetInputValidity = (ev: React.ChangeEvent<HTMLInputElement>) =>
  ev.currentTarget.setCustomValidity('');
