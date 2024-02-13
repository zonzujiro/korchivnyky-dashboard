import { useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';

import {
  Button,
  Dialog,
  FilePreviewer,
  useFilePreviewer,
  previewerFileTypes,
  useDialog,
} from '@/app/library';
import { createExpense } from '@/app/actions';
import { fileToBase64, removeBase64DataPrefix } from '@/app/toolbox';

import styles from './AddExpenseDialog.module.css';
import { InvoiceTransactionPayload, Jar } from '@/app/types';

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} type='submit' className={styles['save-expense']}>
      {pending ? 'Зберігаємо...' : '💾 Зберегти'}
    </Button>
  );
};

type AddExpenseDialogProps = {
  invoiceId: number;
  jars: Array<Jar>;
};

export const AddExpenseDialog = ({
  invoiceId,
  jars,
}: AddExpenseDialogProps) => {
  const { previewerState, handleInputChange, resetPreviewer } =
    useFilePreviewer();

  const [selectedJar, setSelectedJar] = useState<Jar | null>(null);

  const formRef = useRef<HTMLFormElement>(null);

  const resetForm = () => {
    formRef.current?.reset();
    resetPreviewer();
  };

  const handleSubmit = async (formData: FormData) => {
    const file = formData.get('file')! as File;
    const base64 = await fileToBase64(file);

    const requestPayload: InvoiceTransactionPayload = {
      invoiceId,
      fromJarId: Number(formData.get('jar')),
      jarSourceAmount: Number(formData.get('sum')),
      otherSourcesAmount: 0,
      receipt: removeBase64DataPrefix(base64),
      receiptName: file.name,
    };

    const status = await createExpense(requestPayload);

    if (status === 'Success') {
      resetForm();
    }
  };

  const { openDialog, dialogState } = useDialog({ prepareClosing: resetForm });

  return (
    <Dialog
      title='Додати витрати'
      dialogState={dialogState}
      renderButton={() => <Button onClick={openDialog}>💸</Button>}
      renderContent={() => {
        return (
          <div className={styles['dialog-content']}>
            invoiceId: {invoiceId}
            <div className={styles['form-wrapper']}>
              <form
                ref={formRef}
                action={handleSubmit}
                className={styles['form-content']}
              >
                <div className={styles['fieldsets-wrapper']}>
                  <fieldset className={styles['form-inputs']}>
                    <legend>Завантаження квитанції</legend>
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
                    <legend>Інформація про оплату</legend>
                    <label htmlFor='sum-input'>Сплачена сума</label>
                    <input
                      name='sum'
                      id='sum-input'
                      placeholder='20 000'
                      type='text'
                      required
                      pattern='[0-9]+'
                    />
                    <label htmlFor='sum'>Дата оплати</label>
                    <input id='date' type='date' name='date' required />
                    <label htmlFor='jar'>З якої банки оплата</label>
                    <select
                      id='jar'
                      name='jar'
                      onChange={(ev) =>
                        setSelectedJar(
                          jars.find(
                            (jar) => jar.id === Number(ev.target.value)
                          )!
                        )
                      }
                    >
                      {jars.map((jar) => (
                        <option key={jar.id} value={jar.id}>
                          {jar.ownerName}: {jar.jarName}
                        </option>
                      ))}
                    </select>
                    {selectedJar && (
                      <p>Залишок на банці: {selectedJar.accumulated}</p>
                    )}
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
