import { useRef, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';

import { Button, Dialog } from '@/app/library';
import { createExpense } from '@/app/actions';
import { fileToBase64, removeDataPart } from '@/app/toolbox';

import { ImagePreview } from '../ImagePreview/ImagePreview';
import styles from './AddExpenseDialog.module.css';
import { InvoiceTransactionPayload, Jar } from '@/app/types';

const fileTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];

const isValidReceipt = (file: File) =>
  fileTypes.some((type) => type === file.type);

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} type='submit' className={styles['save-expense']}>
      {pending ? 'Зберігаємо...' : '💾 Зберегти'}
    </Button>
  );
};

const RECEIPT_PREVIEW_DEFAULT_STATE = {
  base64: '',
  isPDF: false,
};

type AddExpenseDialogProps = {
  invoiceId: number;
  jars: Array<Jar>;
};

export const AddExpenseDialog = ({
  invoiceId,
  jars,
}: AddExpenseDialogProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [receiptPreview, setReceiptPreview] = useState(
    RECEIPT_PREVIEW_DEFAULT_STATE
  );

  const formRef = useRef<HTMLFormElement>(null);

  const resetForm = () => {
    formRef.current?.reset();
    resetReceiptPreview();
  };

  const handleSubmit = async (
    currentState: string | undefined,
    formData: FormData
  ) => {
    const file = formData.get('file')! as File;
    const base64 = await fileToBase64(file);

    const requestPayload: InvoiceTransactionPayload = {
      invoiceId,
      fromJarId: Number(formData.get('jar')),
      jarSourceAmount: Number(formData.get('sum')),
      otherSourcesAmount: 0,
      receipt: removeDataPart(base64),
      receiptName: file.name,
    };

    const status = await createExpense(requestPayload);

    if (status === 'Success') {
      resetForm();
    }

    return status;
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [status, dispatch] = useFormState(handleSubmit, undefined);

  const resetReceiptPreview = () => {
    setReceiptPreview(RECEIPT_PREVIEW_DEFAULT_STATE);
  };

  const renderFilePreview = async (ev: React.FormEvent<HTMLInputElement>) => {
    const { files } = ev.currentTarget;

    if (!files) {
      return;
    }

    const [file] = files;

    if (!isValidReceipt(file)) {
      resetReceiptPreview();
      return;
    }

    const base64 = await fileToBase64(file);

    setReceiptPreview({ base64, isPDF: file.type.includes('pdf') });
  };

  return (
    <Dialog
      title='Додати витрати'
      prepareClosing={resetForm}
      renderButton={({ openDialog }) => (
        <Button onClick={openDialog}>💸</Button>
      )}
      renderContent={() => {
        return (
          <div className={styles['dialog-content']}>
            invoiceId: {invoiceId}
            <div className={styles['login-form-wrapper']}>
              <form
                ref={formRef}
                action={dispatch}
                className={styles['login-form']}
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
                        onChange={renderFilePreview}
                        accept={fileTypes.join(', ')}
                      />
                      {receiptPreview.base64 ? (
                        <div className={styles['receipt-preview-frame']}>
                          {receiptPreview.isPDF ? (
                            <object
                              className={styles['pdf-preview']}
                              type='application/pdf'
                              data={receiptPreview.base64}
                            />
                          ) : (
                            <ImagePreview src={receiptPreview.base64} />
                          )}
                        </div>
                      ) : (
                        <div className={styles['receipt-preview-skeleton']}>
                          <span>🖼️</span>
                        </div>
                      )}
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
                    <select id='jar' name='jar'>
                      {jars.map((jar) => (
                        <option key={jar.id} value={jar.id}>
                          {jar.ownerName}: {jar.jarName}
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
