'use client';

import React, { ReactElement, useRef } from 'react';
import { useRouter } from 'next/navigation';

import type { ExpenseType, Invoice } from '@/types';
import { type CreateInvoicePayload, type EditInvoicePayload } from '@/dal';
import {
  Dialog,
  useDialog,
  SubmitButton,
  Fieldset,
  FileInput,
  useFileInput,
  FileInputValue,
  resetInputValidity,
  isURL,
} from '@/library';
import { createInvoice, editInvoice } from '@/app/actions';
import { diff, isEmpty, removeBase64DataPrefix } from '@/toolbox';

import styles from './InvoiceDialog.module.css';

type InvoiceDialogProps = {
  expensesTypes: Array<ExpenseType>;
  renderButton(onClick: () => void): ReactElement;
  invoice?: Invoice;
  invoices: Array<Invoice>;
};

const getInvoicePayload = (
  formData: FormData,
  fileMetadata: FileInputValue[number],
  invoice?: Invoice
): CreateInvoicePayload | EditInvoicePayload => {
  const userData = {
    name: formData.get('name') as string,
    amount: Number(formData.get('sum')),
    expenseTypeId: Number(formData.get('expenseType')),
  };

  if (!invoice) {
    return {
      file: removeBase64DataPrefix(fileMetadata.src),
      fileName: fileMetadata.name,
      ...userData,
    };
  }

  const result = diff(userData, invoice);

  return isURL(fileMetadata.src)
    ? result
    : {
        ...result,
        file: removeBase64DataPrefix(fileMetadata.src),
        fileName: fileMetadata.name,
      };
};

const validateEditing = (
  formData: FormData,
  invoices: Array<Invoice>,
  invoice: Invoice,
  fileMetadata?: FileInputValue[number]
) => {
  const name = formData.get('name') as string;

  console.log({
    name,
    invoices,
    isValid: invoices.every((invoice) => invoice.name !== name),
  });

  return {
    file: Boolean(fileMetadata?.src),
    name:
      name === invoice.name ||
      invoices.every((invoice) => invoice.name !== name),
  };
};

const validateCreation = (
  formData: FormData,
  invoices: Array<Invoice>,
  fileMetadata?: FileInputValue[number]
) => {
  const name = formData.get('name') as string;

  return {
    file: Boolean(fileMetadata?.src),
    name: invoices.every((invoice) => invoice.name !== name),
  };
};

export const InvoiceDialog = ({
  expensesTypes,
  renderButton,
  invoice,
  invoices,
}: InvoiceDialogProps) => {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const fileInputDefaultValue = invoice
    ? [{ src: invoice.fileUrl, name: invoice.name }]
    : undefined;
  const fileInput = useFileInput();

  const { openDialog, dialogState, closeDialog } = useDialog({
    prepareClosing: () => {
      formRef.current?.reset();
      fileInput.reset();
    },
  });

  const handleSubmit = async (formData: FormData) => {
    const [fileMetadata] = fileInput.value;

    const validityState = invoice
      ? validateEditing(formData, invoices, invoice, fileMetadata)
      : validateCreation(formData, invoices, fileMetadata);

    if (!validityState.file) {
      fileInput.setErrorText('🤪 Не вистачає файлів!');
    }

    if (!validityState.name) {
      nameInputRef.current?.setCustomValidity("Інвойс с таким ім'ям вже існує");
      nameInputRef.current?.reportValidity();
    }

    if (Object.values(validityState).some((value) => value === false)) {
      return;
    }

    const requestPayload = getInvoicePayload(formData, fileMetadata, invoice);

    if (isEmpty(requestPayload)) {
      return;
    }

    console.log({ requestPayload });

    const request = !invoice
      ? createInvoice(requestPayload as CreateInvoicePayload)
      : editInvoice(invoice!.id, requestPayload);

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
                    defaultValue={fileInputDefaultValue}
                  />
                  <Fieldset>
                    <legend>Інформація про рахунок</legend>
                    <label htmlFor='invoice-name'>Назва рахунку</label>
                    <input
                      ref={nameInputRef}
                      type='text'
                      name='name'
                      id='invoice-name'
                      placeholder='За СТО'
                      required
                      defaultValue={invoice?.name}
                      onChange={resetInputValidity}
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
