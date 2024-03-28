'use client';

import React, { ReactElement, useRef } from 'react';
import { useRouter } from 'next/navigation';

import type { ExpenseType, Invoice } from '@/types';
import {
  editInvoice,
  type CreateInvoicePayload,
  type EditInvoicePayload,
} from '@/dal';
import {
  Dialog,
  useDialog,
  SubmitButton,
  Fieldset,
  FileInput,
  useFileInput,
  FileInputValue,
} from '@/library';
import { createInvoice } from '@/app/actions';
import { diff, removeBase64DataPrefix } from '@/toolbox';

import styles from './InvoiceDialog.module.css';

type InvoiceDialogProps = {
  expensesTypes: Array<ExpenseType>;
  renderButton(onClick: () => void): ReactElement;
  invoice?: Invoice;
};

const getInvoicePayload = (
  formData: FormData,
  fileMetadata: FileInputValue[number],
  invoice?: Invoice
): CreateInvoicePayload | EditInvoicePayload => {
  const maybeWithDescription = formData.get('description')
    ? {
        description: formData.get('description') as string,
      }
    : {};

  const userData = {
    name: formData.get('name') as string,
    amount: Number(formData.get('sum')),
    expenseTypeId: Number(formData.get('expenseType')),
    ...maybeWithDescription,
  };

  if (!invoice) {
    return {
      file: removeBase64DataPrefix(fileMetadata.src),
      fileName: fileMetadata.name,
      ...userData,
    };
  }

  const result = diff(userData, invoice);

  return invoice?.fileUrl === fileMetadata.src
    ? result
    : {
        ...result,
        file: removeBase64DataPrefix(fileMetadata.src),
        fileName: fileMetadata.name,
      };
};

export const InvoiceDialog = ({
  expensesTypes,
  renderButton,
  invoice,
}: InvoiceDialogProps) => {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const fileInputDefaultValue = invoice
    ? { defaultValue: [{ src: invoice.fileUrl, name: invoice.name }] }
    : null;
  const fileInput = useFileInput(fileInputDefaultValue);

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

    const requestPayload = getInvoicePayload(formData, fileMetadata, invoice);

    const request = invoice
      ? createInvoice(requestPayload as CreateInvoicePayload)
      : editInvoice(invoice!.id, requestPayload);

    console.log({ requestPayload });

    const response = await request;

    if (response === 'Success') {
      router.refresh();
      closeDialog();
    } else {
      console.error(response);
    }
  };

  return (
    <Dialog
      dialogState={dialogState}
      title={
        invoice
          ? `✏️ Редагування рахунку: ${invoice.name}`
          : '🧾 Додати рахунок'
      }
      renderButton={() => renderButton(openDialog)}
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
                      defaultValue={invoice?.name}
                    />
                    <label htmlFor='invoice-description'>Коментар</label>
                    <input
                      type='text'
                      name='description'
                      id='invoice-description'
                      placeholder='Якісь деталі, для історії'
                      defaultValue={invoice?.description}
                    />
                    <label htmlFor='sum-input'>Сума до сплати</label>
                    <input
                      type='number'
                      min='1'
                      step='0.01'
                      name='sum'
                      id='sum-input'
                      placeholder='20 000'
                      defaultValue={invoice?.amount}
                    />
                    <label htmlFor='sum'>Дата рахунку</label>
                    <input
                      id='date'
                      type='date'
                      name='date'
                      required
                      defaultValue={invoice?.createdAt}
                    />
                    <label htmlFor='expense-type'>Тип витрат</label>
                    <select
                      id='expense-type'
                      name='expenseType'
                      defaultValue={
                        invoice?.expenseTypeId || expensesTypes[0].id
                      }
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
