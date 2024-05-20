import { ReactElement, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';

import { createJar, editJar, CreateJarPayload } from '@/dal';
import type { Jar, User } from '@/types';
import { Button, Dialog, UserSelect, useDialog } from '@/library';
import { diff, getFormValues } from '@/toolbox';

import styles from './JarDialog.module.css';

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} type='submit' className={styles['save-expense']}>
      {pending ? 'Зберігаємо...' : '💾 Зберегти'}
    </Button>
  );
};

const jarDefaultValues = {
  color: 'FFFFFF',
  otherSourcesAccumulated: 0,
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
    const { isFinished, url, userId, ownerName, goal, isTechnical } =
      getFormValues<
        'isFinished' | 'url' | 'userId' | 'ownerName' | 'goal' | 'isTechnical'
      >(formData);

    const existingJar = jars?.find((jar) => {
      return jar.url === url || jar.ownerName === ownerName;
    });

    // temporary solution. add an event handler when editing
    if (existingJar && !isEditMode) {
      setErrorText(`Така банка вже є у ${existingJar.ownerName}`);
      return;
    }

    // continue here
    const createJarPayload: CreateJarPayload = {
      ...jarDefaultValues,
      url: url || (jar?.url as string),
      ownerName,
      fundraisingCampaignId: Number(fundraisingId),
      goal: goal ? Number(goal) : null,
      isFinished: isFinished === 'on',
      userId: Number(userId),
      isTechnical: isTechnical === 'on',
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
            <label htmlFor='owner-input'>Як звуть власника банки?</label>
            <input
              name='ownerName'
              id='owner-input'
              placeholder='Джейсон Стетхем'
              type='text'
              required
              maxLength={30}
              defaultValue={jar?.ownerName}
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
            <label htmlFor='curator-input'>Обери куратора</label>
            <UserSelect
              name='userId'
              users={users}
              defaultValue={jar?.userId}
            />
            <label className={styles['is-finished-selector']}>
              Збір завершений?
              <input type='checkbox' name='isFinished' />
            </label>
            <label className={styles['is-finished-selector']}>
              Банка виключно для витрат?
              <input type='checkbox' name='isTechnical' />
            </label>
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
