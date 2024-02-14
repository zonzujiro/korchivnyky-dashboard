import { useRef, useState } from 'react';
import classNames from 'classnames';

import { postJar, type JarsPageState } from '@/app/dal';
import type { CreateJarPayload, Jar } from '@/app/types';
import { Button, Dialog, useDialog } from '@/app/library';

import styles from './AddJarDialog.module.css';
import { CuratorsDropdown } from '../CuratorsDropdown';
import { useFormStatus } from 'react-dom';

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} type='submit' className={styles['save-expense']}>
      {pending ? 'Зберігаємо...' : '💾 Зберегти'}
    </Button>
  );
};

export const AddJarDialog = ({
  addJar,
  jars,
  buttonClassName,
}: {
  addJar: JarsPageState['addJar'];
  jars: Array<Jar>;
  buttonClassName: string;
}) => {
  const formRef = useRef<HTMLFormElement>(null);

  const [errorText, setErrorText] = useState('');

  const resetForm = () => {
    formRef.current?.reset();
    setErrorText('');
  };

  const { openDialog, dialogState, closeDialog } = useDialog({
    prepareClosing: resetForm,
  });

  const handleSubmit = async (formData: FormData) => {
    const url = formData.get('url') as string;
    const owner = formData.get('ownerName') as string;

    const existingJar = jars.find((jar) => {
      return jar.url === url || jar.ownerName === owner;
    });

    if (existingJar) {
      setErrorText(`Така банка вже є у ${existingJar.ownerName}`);
      return;
    }

    const createJarPayload: CreateJarPayload = {
      url,
      ownerName: owner,
      parentJarId: Number(formData.get('parentJarId')),
    };

    const response = await postJar(createJarPayload);

    addJar(response);
    resetForm();
    closeDialog();
  };

  return (
    <Dialog
      title='Давай додамо баночку!'
      dialogState={dialogState}
      renderButton={() => (
        <li
          className={classNames(buttonClassName, styles['add-jar'])}
          onClick={openDialog}
        >
          ➕ Додати банку
        </li>
      )}
      renderContent={() => (
        <div className={styles['add-jar-inputs-wrapper']}>
          <form
            ref={formRef}
            className={styles['add-jar-inputs']}
            action={handleSubmit}
          >
            <label htmlFor='owner-input'>Як звуть власника банки?</label>
            <input
              name='ownerName'
              id='owner-input'
              placeholder='Джейсон Стетхем'
              type='text'
              required
              maxLength={30}
            />
            <label htmlFor='url-input'>Посилання на банку</label>
            <input
              id='url-input'
              name='url'
              placeholder='url'
              type='url'
              required
              pattern='https://send.monobank.ua/jar/.*'
            />
            <label htmlFor='curator-input'>Обери куратора</label>
            <CuratorsDropdown name='parentJarId' />
            <SubmitButton />

            {errorText && (
              <span className={styles['form-error']}>⚠️ {errorText}</span>
            )}
          </form>
        </div>
      )}
    />
  );
};
