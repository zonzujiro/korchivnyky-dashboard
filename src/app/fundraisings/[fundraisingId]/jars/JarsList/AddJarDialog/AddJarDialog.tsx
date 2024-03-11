import { useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import classNames from 'classnames';

import { postJar, type JarsPageState, type CreateJarPayload } from '@/dal';
import { Button, CuratorsDropdown, Dialog, useDialog } from '@/library';
import type { Jar } from '@/types';

import styles from './AddJarDialog.module.css';

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
  fundraisingId,
}: {
  addJar: JarsPageState['addJar'];
  jars: Array<Jar>;
  fundraisingId: string;
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
    const color = formData.get('jarColor') as string;

    const existingJar = jars.find((jar) => {
      return jar.url === url || jar.ownerName === owner;
    });

    if (existingJar) {
      setErrorText(`Така банка вже є у ${existingJar.ownerName}`);
      return;
    }

    const existingColor = jars.some((jar) => {
      return jar.color === color;
    });

    if (existingColor) {
      setErrorText('Цей колір вже зайнятий 😔 Спробуй обрати інший 😉');
      return;
    }

    const createJarPayload: CreateJarPayload = {
      url,
      ownerName: owner,
      fundraisingCampaignId: Number(fundraisingId),
      color: color,
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
        <Button className={classNames(styles['add-jar'])} onClick={openDialog}>
          ➕ Додати банку
        </Button>
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
            <label htmlFor='color-input'>Який колір хочеш обрати?</label>
            <input
              name='jarColor'
              id='color-input'
              type='color'
              required
              maxLength={30}
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
