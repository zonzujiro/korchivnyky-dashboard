'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';

import { Button, Dialog, Fieldset, SubmitButton, useDialog } from '@/library';
import { ExpenseTypePayload } from '@/dal';
import { getFormValues } from '@/toolbox';
import { createExpenseType } from '@/app/actions';

import styles from './ExpenseTypeDialog.module.css';

export const ExpenseTypeDialog = ({
  fundraisingCampaignId,
}: {
  fundraisingCampaignId: number;
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const { dialogState, openDialog, closeDialog } = useDialog({
    prepareClosing: () => {
      formRef.current?.reset();
    },
  });

  const handleSubmit = async (formData: FormData) => {
    const record = getFormValues<
      'name' | 'fundraisingCampaignId' | 'amount' | 'is-auto'
    >(formData);

    const expenseTypePayload: ExpenseTypePayload = {
      name: record.name,
      fundraisingCampaignId,
      targetSum: Number(record.amount),
    };

    const result = await createExpenseType(
      expenseTypePayload,
      record['is-auto'] === 'on'
    );

    if (result === 'Success') {
      router.refresh();
      closeDialog();
    }
  };

  return (
    <Dialog
      title='Запланувати витрати'
      dialogState={dialogState}
      renderButton={() => (
        <Button onClick={openDialog}>🤑 Запланувати витрати</Button>
      )}
      renderContent={() => {
        return (
          <div className={styles['dialog-content']}>
            <form
              ref={formRef}
              action={handleSubmit}
              className={styles['form-content']}
            >
              <div className={styles['fieldsets-wrapper']}>
                <Fieldset>
                  <legend>Інформація про статтю витрат</legend>
                  <label htmlFor='expense-type-name'>Назва статті</label>
                  <input
                    type='text'
                    name='name'
                    id='expense-type-name'
                    placeholder='На щось важливе'
                    maxLength={35}
                    required
                  />
                  <label htmlFor='expense-amount-input'>
                    Запланована вартість
                  </label>
                  <input
                    type='number'
                    min='1'
                    step='0.01'
                    name='amount'
                    id='expense-amount-input'
                    placeholder='20 000'
                    required
                  />
                  <label className={styles['is-auto-checkbox']}>
                    Це авто?
                    <input type='checkbox' name='is-auto' /> Так
                  </label>
                  <small className={styles['is-auto-info']}>
                    Якщо так - ми одразу заплануємо ремонт та фарбування
                  </small>
                  <SubmitButton />
                </Fieldset>
              </div>
            </form>
          </div>
        );
      }}
    />
  );
};
