'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';

import type { ExpenseType } from '@/types';
import type { InvoicePayload } from '@/dal';
import {
  Button,
  Dialog,
  FilePreviewer,
  useFilePreviewer,
  useDialog,
  SubmitButton,
  Fieldset,
  previewerFileTypes,
} from '@/library';
import { createInvoice } from '@/app/actions';
import { fileToBase64, removeBase64DataPrefix } from '@/toolbox';

import styles from './AddInvoiceDialog.module.css';

type AddInvoiceDialogProps = {
  expensesTypes: Array<ExpenseType>;
};

export const AddInvoiceDialog = ({ expensesTypes }: AddInvoiceDialogProps) => {
  const router = useRouter();

  const { previewerState, handleInputChange, resetPreviewer } =
    useFilePreviewer();

  const formRef = useRef<HTMLFormElement>(null);

  const { openDialog, dialogState, closeDialog } = useDialog({
    prepareClosing: () => {
      router.refresh();
      formRef.current?.reset();
      resetPreviewer();
    },
  });

  const handleSubmit = async (formData: FormData) => {
    const file = formData.get('file')! as File;
    const base64 = await fileToBase64(file);

    const maybeWithDescription = formData.get('description')
      ? {
          description: formData.get('description') as string,
        }
      : {};

    const requestPayload: InvoicePayload = {
      file: removeBase64DataPrefix(base64),
      fileName: file.name,
      name: formData.get('name') as string,
      amount: Number(formData.get('sum')),
      expensiveTypeId: Number(formData.get('expenseType')),
      ...maybeWithDescription,
    };

    const response = await createInvoice(requestPayload);

    if (response === 'Success') {
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
                  <Fieldset>
                    <legend>Завантаження рахунку</legend>
                    <input
                      type='file'
                      name='file'
                      placeholder='Квитанція у JPG/JPEG, PNG або PDF'
                      required
                      onChange={handleInputChange}
                      accept={previewerFileTypes.join(', ')}
                    />
                    <FilePreviewer previewerState={previewerState} />
                  </Fieldset>
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
