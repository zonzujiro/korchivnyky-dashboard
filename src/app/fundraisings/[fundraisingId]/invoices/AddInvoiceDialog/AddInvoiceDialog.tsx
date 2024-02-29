'use client';

import { useRef } from 'react';
import { useFormStatus } from 'react-dom';

import type { ExpenseType, Invoice, InvoicePayload } from '@/types';
import {
  Button,
  Dialog,
  FilePreviewer,
  useFilePreviewer,
  previewerFileTypes,
  useDialog,
} from '@/library';
import { createInvoice } from '@/app/actions';
import { fileToBase64, removeBase64DataPrefix } from '@/toolbox';

import styles from './AddInvoiceDialog.module.css';

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} type='submit' className={styles['save-expense']}>
      {pending ? 'Зберігаємо...' : '💾 Зберегти'}
    </Button>
  );
};

type AddInvoiceDialogProps = {
  expensesTypes: Array<ExpenseType>;
  addInvoice: (invoice: Invoice) => void;
};

export const AddInvoiceDialog = ({
  expensesTypes,
  addInvoice,
}: AddInvoiceDialogProps) => {
  const { previewerState, handleInputChange, resetPreviewer } =
    useFilePreviewer();

  const formRef = useRef<HTMLFormElement>(null);

  const resetForm = () => {
    formRef.current?.reset();
    resetPreviewer();
  };

  const { openDialog, dialogState, closeDialog } = useDialog({
    prepareClosing: resetForm,
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
      amount: Number(formData.get('amount')),
      expensiveTypeId: Number(formData.get('expenseType')),
      ...maybeWithDescription,
    };

    const response = await createInvoice(requestPayload);

    if (typeof response === 'string') {
      return;
    }

    addInvoice(response);
    closeDialog();
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
                  <fieldset className={styles['form-inputs']}>
                    <legend>Завантаження рахунку</legend>
                    <div className={styles['file-preview']}>
                      <input
                        type='file'
                        name='file'
                        placeholder='Квитанція у JPG/JPEG, PNG або PDF'
                        required
                        onChange={handleInputChange}
                        accept={previewerFileTypes.join(', ')}
                      />
                      <FilePreviewer previewerState={previewerState} />
                    </div>
                  </fieldset>
                  <fieldset className={styles['form-inputs']}>
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
                      name='amount'
                      id='sum-input'
                      placeholder='20 000'
                      type='text'
                      required
                      pattern='[0-9]+'
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
                  </fieldset>
                </div>
              </form>
            </div>
          </div>
        );
      }}
    />
  );
};
