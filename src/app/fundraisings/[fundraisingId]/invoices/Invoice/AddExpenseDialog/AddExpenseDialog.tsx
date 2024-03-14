import { useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';

import {
  Button,
  Dialog,
  useDialog,
  JarSelector,
  FilesInput,
  useFilesInput,
} from '@/library';
import { createExpense } from '@/app/actions';
import type { Invoice, Jar } from '@/types';
import type { InvoiceTransactionPayload } from '@/dal';

import styles from './AddExpenseDialog.module.css';

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} type='submit' className={styles['save-expense']}>
      {pending ? 'Зберігаємо...' : '💾 Зберегти'}
    </Button>
  );
};

type AddExpenseDialogProps = {
  invoice: Invoice;
  jars: Array<Jar>;
};

export const AddExpenseDialog = ({ invoice, jars }: AddExpenseDialogProps) => {
  const router = useRouter();

  const sumInputRef = useRef<HTMLInputElement>(null);

  const filesInput = useFilesInput();

  const [selectedJar, setSelectedJar] = useState(jars[0]);

  const formRef = useRef<HTMLFormElement>(null);

  const resetForm = () => {
    router.refresh();
    formRef.current?.reset();
    filesInput.resetPreviewer();
  };

  const { openDialog, dialogState, closeDialog } = useDialog({
    prepareClosing: resetForm,
  });

  const handleSubmit = async (formData: FormData) => {
    const base64s = filesInput.filesMetadata.map((metadata) => metadata.src);

    if (!base64s.length) {
      filesInput.setErrorText('🤪 Не вистачає файлів!');
      return;
    }

    const sum = Number(formData.get('sum'));
    const jarId = Number(formData.get('jar'));

    const creditJar = jars.find((jar) => jar.id === jarId)!;

    if (sum > creditJar.accumulated) {
      sumInputRef.current?.setCustomValidity('На банці недостатньо коштів');
      sumInputRef.current?.reportValidity();
      return;
    }

    const requestPayload: InvoiceTransactionPayload = {
      invoiceId: invoice.id,
      fromJarId: Number(formData.get('jar')),
      jarSourceAmount: Number(formData.get('sum')),
      otherSourcesAmount: 0,
      //@ts-expect-error waiting for Dima
      receipt: base64s,
      //@ts-expect-error waiting for Dima
      receiptName: file.name,
    };

    const status = await createExpense(requestPayload);

    if (status === 'Success') {
      closeDialog();
    }
  };

  return (
    <Dialog
      title='Додати витрати'
      dialogState={dialogState}
      renderButton={() => (
        <Button title='Додати витрати' onClick={openDialog}>
          💸
        </Button>
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
                  <FilesInput
                    filesInputState={filesInput}
                    title='Завантаження рахунку'
                  />
                  <div>
                    <fieldset className={styles['form-inputs']}>
                      <legend>Інформація про оплату</legend>
                      <label htmlFor='sum-input'>Сплачена сума</label>
                      <input
                        ref={sumInputRef}
                        type='number'
                        min='1'
                        step='0.01'
                        name='sum'
                        id='sum-input'
                        placeholder='20 000'
                        required
                      />
                      <label htmlFor='sum'>Дата оплати</label>
                      <input id='date' type='date' name='date' required />
                    </fieldset>
                    <JarSelector
                      title='З якої банки оплата'
                      selectJar={setSelectedJar}
                      selectedJar={selectedJar}
                      id='jar'
                      jars={jars}
                      className={styles['jar-selector']}
                    />
                    <SubmitButton />
                  </div>
                </div>
              </form>
            </div>
          </div>
        );
      }}
    />
  );
};
