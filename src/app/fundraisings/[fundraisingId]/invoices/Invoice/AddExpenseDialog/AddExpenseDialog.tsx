import { useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';

import {
  Button,
  Dialog,
  useDialog,
  JarSelector,
  FileInput,
  useFileInput,
} from '@/library';
import { createInvoiceTransaction } from '@/app/actions';
import type { Invoice, Jar, User } from '@/types';
import type { InvoiceTransactionPayload } from '@/dal';
import { removeBase64DataPrefix } from '@/toolbox';

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
  users: Array<User>;
};

export const AddExpenseDialog = ({
  invoice,
  jars,
  users,
}: AddExpenseDialogProps) => {
  const router = useRouter();
  const [selectedJar, setSelectedJar] = useState(jars[0]);

  const sumInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const filesInput = useFileInput();

  const resetForm = () => {
    formRef.current?.reset();
    filesInput.reset();
  };

  const { openDialog, dialogState, closeDialog } = useDialog({
    prepareClosing: resetForm,
  });

  const handleSubmit = async (formData: FormData) => {
    if (!filesInput.value.length) {
      filesInput.setErrorText('🤪 Не вистачає файлів!');
      return;
    }

    const sum = Number(formData.get('sum'));
    const jarId = Number(formData.get('jar'));

    const requestPayload: InvoiceTransactionPayload = {
      invoiceId: invoice.id,
      fromJarId: jarId,
      jarSourceAmount: sum,
      otherSourcesAmount: 0,
      receipts: filesInput.value.map((metadata) => ({
        receiptName: metadata.name,
        receipt: removeBase64DataPrefix(metadata.src),
      })),
    };

    const status = await createInvoiceTransaction(requestPayload);

    if (status === 'Success') {
      router.refresh();
      closeDialog();
    } else {
      console.error(status);
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
                  <FileInput
                    filesInputState={filesInput}
                    title='Завантаження рахунку'
                    multiple
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
                    </fieldset>
                    <JarSelector
                      title='З якої банки оплата'
                      selectJar={setSelectedJar}
                      selectedJar={selectedJar}
                      id='jar'
                      jars={jars}
                      className={styles['jar-selector']}
                      users={users}
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
