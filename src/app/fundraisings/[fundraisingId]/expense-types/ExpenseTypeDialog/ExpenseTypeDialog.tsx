'use client';

import { ReactElement, useRef } from 'react';
import { useRouter } from 'next/navigation';

import type { ExpenseType, User } from '@/types';
import { Dialog, Fieldset, FormButtons, useDialog } from '@/library';
import { ExpenseTypePayload, deleteExpenseType } from '@/dal';
import { getFormValues } from '@/toolbox';
import { createExpenseType, editExpenseType } from '@/app/actions';

import styles from './ExpenseTypeDialog.module.css';

export const ExpenseTypeDialog = ({
  fundraisingId,
  renderButton,
  expenseType,
  title,
  users,
}: {
  fundraisingId: string;
  renderButton(openDialog: () => void): ReactElement;
  expenseType?: ExpenseType;
  title: string;
  users: Array<User>;
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const { dialogState, openDialog, closeDialog } = useDialog({
    prepareClosing: () => {
      formRef.current?.reset();
    },
  });

  const close = () => {
    router.refresh();
    closeDialog();
  };

  const handleDeletion = async () => {
    await deleteExpenseType(expenseType!.id);
    close();
  };

  const handleSubmit = async (formData: FormData) => {
    const record = getFormValues<
      'name' | 'fundraisingCampaignId' | 'amount' | 'is-auto' | 'ownerId'
    >(formData);

    const expenseTypePayload: ExpenseTypePayload = {
      name: record.name,
      fundraisingCampaignId: Number(fundraisingId),
      targetSum: Number(record.amount),
      ownerId: Number(record.ownerId),
    };

    const request = expenseType
      ? editExpenseType(expenseType.id, expenseTypePayload)
      : createExpenseType(expenseTypePayload, record['is-auto'] === 'on');

    const result = await request;

    if (result === 'Success') {
      close();
    }
  };

  return (
    <Dialog
      title={title}
      dialogState={dialogState}
      renderButton={() => renderButton(openDialog)}
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
                    required
                    defaultValue={expenseType?.name}
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
                    defaultValue={expenseType?.targetSum}
                  />
                  <label htmlFor='curator-input'>Від кого запит</label>
                  <select
                    id='curator-input'
                    name='ownerId'
                    defaultValue={expenseType?.ownerId}
                  >
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                  {!expenseType ? (
                    <>
                      <label className={styles['is-auto-checkbox']}>
                        Це авто?
                        <input type='checkbox' name='is-auto' /> Так
                      </label>
                      <small className={styles['is-auto-info']}>
                        Якщо так - ми одразу заплануємо ремонт та фарбування
                      </small>
                    </>
                  ) : null}
                  <div className={styles.buttons}>
                    <FormButtons
                      handleDeletion={expenseType ? handleDeletion : null}
                    />
                  </div>
                </Fieldset>
              </div>
            </form>
          </div>
        );
      }}
    />
  );
};
