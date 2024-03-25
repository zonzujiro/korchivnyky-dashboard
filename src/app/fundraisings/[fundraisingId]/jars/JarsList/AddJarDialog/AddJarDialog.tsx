import { ReactNode, useContext, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import classNames from 'classnames';

import { postJar, type JarsPageState, putJar, JarsPageContext } from '@/dal';
import type { CreateJarPayload, Jar } from '@/types';
import { Button, CuratorsDropdown, Dialog, useDialog } from '@/library';

import styles from './AddJarDialog.module.css';

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} type='submit' className={styles['save-expense']}>
      {pending ? 'Зберігаємо...' : '💾 Зберегти'}
    </Button>
  );
};

const getPayload = (userData: CreateJarPayload, jar: Jar) => {
  const changedJar: Record<string, any> = {};

  const keys = Object.keys(userData) as Array<keyof CreateJarPayload>;

  keys.forEach((key) => {
    if (userData[key] !== jar[key]) {
      changedJar[key] = userData[key];
    }
  });

  return changedJar as Partial<CreateJarPayload>;
};

export const AddJarDialog = ({
  fundraisingId,
  jar,
  renderButton,
}: {
  jars?: Array<Jar>;
  fundraisingId: string;
  jar?: Jar;
  renderButton(openDialog: () => void): ReactNode;
}) => {
  const { replaceJar, addJar, jars } = useContext(JarsPageContext);

  const isEditMode = jar !== undefined;
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
    const owner = formData.get('owner-name') as string;
    const color = formData.get('jar-color') as string;
    const goal = formData.get('goal') as string;
    const otherIncoms = formData.get('other-incoms') as string;
    const isFinished = formData.get('is-finished') as string;

    const existingJar = jars?.find((jar) => {
      return jar.url === url || jar.ownerName === owner;
    });
    // temporary solution. add an event handler when editing
    if (existingJar && !isEditMode) {
      setErrorText(`Така банка вже є у ${existingJar.ownerName}`);
      return;
    }

    const existingColor = jars?.some((jar) => {
      return jar.color === color;
    });
    // temporary solution. add an event handler when editing
    if (existingColor && !isEditMode) {
      setErrorText('Цей колір вже зайнятий 😔 Спробуй обрати інший 😉');
      return;
    }

    // continue here
    const createJarPayload: CreateJarPayload = {
      url,
      ownerName: owner,
      fundraisingCampaignId: Number(fundraisingId),
      color: color,
      goal: goal ? Number(goal) : null,
      otherSourcesAccumulated: Number(otherIncoms),
      isFinished: isFinished === 'true',
    };

    if (isEditMode) {
      const response = await Promise.resolve({
        ...jar,
        ...getPayload(createJarPayload, jar),
      });
      replaceJar(response);
    } else {
      const response = await postJar(createJarPayload);
      addJar(response);
    }
    console.log(createJarPayload);
    resetForm();
    closeDialog();
  };

  return (
    <Dialog
      title={
        isEditMode ? 'Давай відредагуємо баночку!' : 'Давай додамо баночку!'
      }
      dialogState={dialogState}
      renderButton={() => (
        <Button
          className={`
        ${isEditMode ? styles['edit-jar'] : styles['add-jar']}
      `}
          onClick={openDialog}
        >
          {isEditMode ? '🔧' : '➕ Додати банку'}
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
              name='owner-name'
              id='owner-input'
              placeholder='Джейсон Стетхем'
              type='text'
              required
              maxLength={30}
              defaultValue={jar?.ownerName}
            />
            <label htmlFor='url-input'>Посилання на банку</label>
            <input
              id='url-input'
              name='url'
              placeholder='url'
              type='url'
              required
              pattern='https://send.monobank.ua/jar/.*'
              defaultValue={jar?.url}
            />
            <label htmlFor='goal-input'>Мета</label>
            <input
              type='number'
              min='0.00'
              step='0.01'
              name='goal'
              id='goal-input'
              placeholder='100 000'
              defaultValue={jar?.goal || ''}
            />
            <label htmlFor='other-incoms-input'>Інші надхождення</label>
            <input
              type='number'
              min='0.00'
              step='0.01'
              name='other-incoms'
              id='other-incoms-input'
              placeholder='100 000'
            />
            <label htmlFor='color-input'>Який колір хочеш обрати?</label>
            <input
              name='jar-color'
              id='color-input'
              type='color'
              defaultValue={jar?.color}
              required
            />
            <label htmlFor='curator-input'>Обери куратора</label>
            <CuratorsDropdown name='parentJarId' />
            <label htmlFor='is-finished-input'>Збір завершений?</label>
            <input type='checkbox' name='is-finished' id='is-finished-input' />
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
