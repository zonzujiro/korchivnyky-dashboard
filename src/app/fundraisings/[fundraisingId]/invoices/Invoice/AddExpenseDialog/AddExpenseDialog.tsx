import { useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';

import {
  Button,
  Dialog,
  FilePreviewer,
  useFilePreviewer,
  previewerFileTypes,
  useDialog,
  JarSelector,
} from '@/library';
import { createExpense } from '@/app/actions';
import { fileToBase64, removeBase64DataPrefix } from '@/toolbox';
import { InvoiceTransactionPayload, Jar } from '@/types';

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
  invoiceId: number;
  jars: Array<Jar>;
};

export const AddExpenseDialog = ({
  invoiceId,
  jars,
}: AddExpenseDialogProps) => {
  const { previewerState, handleInputChange, resetPreviewer } =
    useFilePreviewer();

  const [selectedJar, setSelectedJar] = useState(jars[0]);

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
                  <div>
                    <fieldset className={styles['form-inputs']}>
                      <legend>Інформація про оплату</legend>
                      <label htmlFor='sum-input'>Сплачена сума</label>
                      <input
                        type='number'
                        min='0.00'
                        step='0.01'
                        name='sum'
                        id='sum-input'
                        placeholder='20 000'
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
