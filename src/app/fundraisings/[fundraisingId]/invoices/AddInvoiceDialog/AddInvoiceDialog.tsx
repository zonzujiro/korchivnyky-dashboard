'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';

import type { ExpenseType } from '@/types';
import type { InvoicePayload } from '@/dal';
import {
  Button,
  Dialog,
  useDialog,
  SubmitButton,
  Fieldset,
  FileInput,
  useFileInput,
} from '@/library';
import { createInvoice } from '@/app/actions';
import { removeBase64DataPrefix } from '@/toolbox';

import styles from './AddInvoiceDialog.module.css';

type AddInvoiceDialogProps = {
  expensesTypes: Array<ExpenseType>;
};

export const AddInvoiceDialog = ({ expensesTypes }: AddInvoiceDialogProps) => {
  const router = useRouter();

  const fileInput = useFileInput();

  const formRef = useRef<HTMLFormElement>(null);

  const { openDialog, dialogState, closeDialog } = useDialog({
    prepareClosing: () => {
      formRef.current?.reset();
      fileInput.reset();
    },
  });

  const handleSubmit = async (formData: FormData) => {
    const [fileMetadata] = fileInput.value;

    if (!fileMetadata) {
      fileInput.setErrorText('🤪 Не вистачає файлів!');
      return;
    }

    const maybeWithDescription = formData.get('description')
      ? {
          description: formData.get('description') as string,
        }
      : {};

    const requestPayload: InvoicePayload = {
      file: removeBase64DataPrefix(fileMetadata.base64),
      fileName: fileMetadata.name,
      name: formData.get('name') as string,
      amount: Number(formData.get('sum')),
      // it's how it called on server :)
      expensiveTypeId: Number(formData.get('expenseType')),
      ...maybeWithDescription,
    };

    const response = await createInvoice(requestPayload);

    if (response === 'Success') {
      router.refresh();
      closeDialog();
    }
  };

  return (
    <Dialog
      dialogState={dialogState}
      title='🧾 Додати рахунок'
      renderButton={() => (
        <Button onClick={openDialog}>➕ Додати рахунок</Button>
      )}
      renderContent={() => {
        return (
          <div className={styles['dialog-content']}>
            <div className={styles['form-wrapper']}>
              <form
                ref={formRef}
                action={handleSubmit}
                className={styles['form-content']}
              >
                <div className={styles['fieldsets-wrapper']}>
                  <FileInput
                    filesInputState={fileInput}
                    title='Завантаження рахунку'
                  />
                  <Fieldset>
                    <legend>Інформація про рахунок</legend>
                    <label htmlFor='invoice-name'>Назва рахунку</label>
                    <input
                      type='text'
                      name='name'
                      id='invoice-name'
                      placeholder='За СТО'
                      required
                    />
                    <label htmlFor='invoice-description'>Коментар</label>
                    <input
                      type='text'
                      name='description'
                      id='invoice-description'
                      placeholder='Якісь деталі, для історії'
                    />
                    <label htmlFor='sum-input'>Сума до сплати</label>
                    <input
                      type='number'
                      min='1'
                      step='0.01'
                      name='sum'
                      id='sum-input'
                      placeholder='20 000'
                    />
                    <label htmlFor='sum'>Дата рахунку</label>
                    <input id='date' type='date' name='date' required />
                    <label htmlFor='expense-type'>Тип витрат</label>
                    <select
                      id='expense-type'
                      name='expenseType'
                      defaultValue={expensesTypes[0].id}
                    >
                      {expensesTypes
                        .filter((expenseType) => expenseType.isActive)
                        .map((expenseType) => (
                          <option key={expenseType.id} value={expenseType.id}>
                            {expenseType.name}
                          </option>
                        ))}
                    </select>
                    <SubmitButton />
                  </Fieldset>
                </div>
              </form>
            </div>
          </div>
        );
      }}
    />
  );
};
