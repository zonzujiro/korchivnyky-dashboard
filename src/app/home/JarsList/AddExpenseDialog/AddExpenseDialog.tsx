import { useContext, useRef, useState } from 'react';

import { Button, Dialog } from '@/app/library';
import { AppContext } from '@/app/dal';

import styles from './AddExpenseDialog.module.css';

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

export const AddExpenseDialog = ({ jarId }: { jarId: number }) => {
  const { expenseTypes } = useContext(AppContext);

  const formRef = useRef<HTMLFormElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState('');

  const resetForm = () => {
    formRef.current?.reset();
    setErrorText('');
  };

  const handleSubmit = async (
    ev: React.FormEvent<HTMLFormElement>,
    closeDialog: () => void
  ) => {
    ev.preventDefault();

    const formData = new FormData(formRef.current!);
    const receiptFile = formData.get('receipt') as File;

    if (!isValidReceipt(receiptFile)) {
      setErrorText('Квитанція може бути лише у PDF, JPEG або PNG');
      return;
    }

    const base64 = await fileToBase64(receiptFile);

    formData.set('receipt', base64);
    formData.append('jarId', `${jarId}`);

    // const response = await postJar({
    //   url: url.value,
    //   ownerName: owner.value,
    //   ...maybeWithCurator,
    // });

    setIsLoading(false);
    // addJar(response);
    resetForm();
    closeDialog();
  };

  return (
    <Dialog
      title='Додавання витрат'
      prepareClosing={resetForm}
      renderButton={({ openDialog }) => (
        <span
          onClick={(ev) => {
            ev.stopPropagation();
            openDialog();
          }}
          className={styles.icon}
        >
          💸
        </span>
      )}
      renderContent={({ closeDialog }) => {
        return (
          <div>
            {isLoading && (
              <div className={styles['loader']}>
                <h4>Праця робиться...</h4>
              </div>
            )}
            <form
              ref={formRef}
              className={styles.content}
              onSubmit={(ev) => handleSubmit(ev, closeDialog)}
            >
              <label htmlFor='sum-input'>Сума</label>
              <input
                name='sum'
                id='sum-input'
                placeholder='20 000'
                type='text'
                required
                pattern='[0-9]+'
              />
              <label htmlFor='expense-type-input'>Стаття видатків</label>
              <select id='expense-type-input' name='expense-type'>
                {expenseTypes.map(({ id, title }) => {
                  return (
                    <option key={id} value={id}>
                      {title}
                    </option>
                  );
                })}
              </select>
              <label htmlFor='receipt-input'>Квитанція</label>
              <input
                id='receipt-input'
                name='receipt'
                placeholder='Квитанція у JPG/JPEG, PNG або PDF'
                type='file'
                required
                accept={fileTypes.join(', ')}
              />
              <Button type='submit'>💸 Зберегти витрати</Button>

              {errorText && (
                <span className={styles['form-error']}>⚠️ {errorText}</span>
              )}
            </form>
          </div>
        );
      }}
    />
  );
};
