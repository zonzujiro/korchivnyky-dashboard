import { useFormState, useFormStatus } from 'react-dom';

import { Button, Dialog } from '@/app/library';

import styles from './AddExpenseDialog.module.css';
import { useRef, useState } from 'react';
import { ImagePreview } from '../ImagePreview/ImagePreview';

const fileTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const isValidReceipt = (file: File) =>
  fileTypes.some((type) => type === file.type);

// const isValidForPreview = (file: File) =>
//   fileTypes
//     .filter((type) => type !== 'application/pdf')
//     .some((type) => type === file.type);

const createExpense = async () => {};

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

export const AddExpenseDialog = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [status, dispatch] = useFormState(createExpense, undefined);
  const [receiptPreview, setReceiptPreview] = useState(
    RECEIPT_PREVIEW_DEFAULT_STATE
  );

  const formRef = useRef<HTMLFormElement>(null);

  const resetForm = () => {
    formRef.current?.reset();
    resetReceiptPreview();
  };

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
