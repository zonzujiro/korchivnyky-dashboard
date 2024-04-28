import { ReactElement, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';

import { createJar, editJar, CreateJarPayload } from '@/dal';
import type { Jar, User } from '@/types';
import { Button, Dialog, UserSelect, useDialog } from '@/library';
import { diff } from '@/toolbox';

import styles from './JarDialog.module.css';

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} type='submit' className={styles['save-expense']}>
      {pending ? 'Зберігаємо...' : '💾 Зберегти'}
    </Button>
  );
};

export const AddJarDialog = ({
  fundraisingId,
  jar,
  renderButton,
  jars,
  users,
}: {
  jars: Array<Jar>;
  fundraisingId: string;
  jar?: Jar;
  renderButton(openDialog: () => void): ReactElement;
  users: Array<User>;
}) => {
  const router = useRouter();

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
    const ownerName = formData.get('owner-name') as string;
    const color = formData.get('jar-color') as string;
    const goal = formData.get('goal') as string;
    const isFinished = formData.get('is-finished') as string;

    const existingJar = jars?.find((jar) => {
      return jar.url === url || jar.ownerName === ownerName;
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
      ownerName,
      fundraisingCampaignId: Number(fundraisingId),
      color,
      goal: goal ? Number(goal) : null,
      otherSourcesAccumulated: 0,
      isFinished: isFinished === 'true',
    };

    if (isEditMode) {
      const updatedJarPayload = {
        ...jar,
        ...diff(createJarPayload, jar),
      };

      await editJar(jar.id, updatedJarPayload);
    } else {
      await createJar(createJarPayload);
    }

    router.refresh();
    resetForm();
    closeDialog();
  };

  return (
    <Dialog
      title={
        isEditMode ? 'Давай відредагуємо баночку!' : 'Давай додамо баночку!'
      }
      dialogState={dialogState}
      renderButton={() => renderButton(openDialog)}
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
            {!isEditMode && (
              <>
                <label htmlFor='url-input'>
                  Посилання на сторінку віджету банки
                </label>
                <input
                  id='url-input'
                  name='url'
                  placeholder='https://send.monobank.ua/widget/...'
                  type='url'
                  required
                  pattern='https://send.monobank.ua/widget/.*'
                />
              </>
            )}
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
            <label htmlFor='color-input'>Який колір хочеш обрати?</label>
            <input
              name='jar-color'
              id='color-input'
              type='color'
              defaultValue={jar?.color}
              required
            />
            <label htmlFor='curator-input'>Обери куратора</label>
            <UserSelect name='parentJarId' users={users} />
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
