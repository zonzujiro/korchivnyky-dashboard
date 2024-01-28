import { useRef, useState } from 'react';
import classNames from 'classnames';

import { postJar, type AppState } from '@/app/dal';
import type { Jar } from '@/app/types';
import { Button, Dialog } from '@/app/library';

import styles from './AddJarDialog.module.css';
import { CuratorsDropdown } from '../CuratorsDropdown';

export const AddJarDialog = ({
  addJar,
  jars,
  buttonClassName,
}: {
  addJar: AppState['addJar'];
  jars: Array<Jar>;
  buttonClassName: string;
}) => {
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

    const url = formData.get('url');
    const owner = formData.get('ownerName');

    const existingJar = jars.find((jar) => {
      return jar.url === url || jar.owner_name === owner;
    });

    if (existingJar) {
      setErrorText(`Така банка вже є у ${existingJar.owner_name}`);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const response = await postJar(formData);

    setIsLoading(false);
    addJar(response);
    resetForm();
    closeDialog();
  };

  return (
    <Dialog
      title='Давай додамо баночку!'
      prepareClosing={resetForm}
      renderButton={({ openDialog }) => (
        <li
          className={classNames(buttonClassName, styles['add-jar'])}
          onClick={openDialog}
        >
          ➕ Додати банку
        </li>
      )}
      renderContent={({ closeDialog }) => (
        <div className={styles['add-jar-inputs-wrapper']}>
          {isLoading && (
            <div className={styles['loader']}>
              <h4>Праця робиться...</h4>
            </div>
          )}
          <form
            ref={formRef}
            className={styles['add-jar-inputs']}
            onSubmit={(ev) => handleSubmit(ev, closeDialog)}
          >
            <label htmlFor='owner-input'>Як звуть власника банки?</label>
            <input
              name='ownerName'
              id='owner-input'
              placeholder='Джейсон Стетхем'
              type='text'
              required
              maxLength={30}
            />
            <label htmlFor='url-input'>Посилання на банку</label>
            <input
              id='url-input'
              name='url'
              placeholder='url'
              type='url'
              required
              pattern='https://send.monobank.ua/jar/.*'
            />
            <label htmlFor='curator-input'>Обери куратора</label>
            <CuratorsDropdown name='parentJarId' />
            <Button type='submit'>💾 Створити банку</Button>

            {errorText && (
              <span className={styles['form-error']}>⚠️ {errorText}</span>
            )}
          </form>
        </div>
      )}
    />
  );
};
