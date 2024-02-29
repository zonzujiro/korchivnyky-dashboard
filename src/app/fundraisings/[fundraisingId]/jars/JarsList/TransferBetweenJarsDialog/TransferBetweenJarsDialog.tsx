import { useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';

import type { Jar, JarsTransactionPayload } from '@/types';

import {
  Button,
  Dialog,
  FilePreviewer,
  JarSelector,
  previewerFileTypes,
  useDialog,
  useFilePreviewer,
} from '@/library';
import { transferMoneyBetweenJars } from '@/app/actions';

import styles from './TransferBetweenJarsDialog.module.css';
import { fileToBase64, removeBase64DataPrefix } from '@/toolbox';

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} type='submit' className={styles['save-expense']}>
      {pending ? 'Зберігаємо...' : '💾 Зберегти'}
    </Button>
  );
};

export const TransferBetweenJarsDialog = ({
  jars,
  selectedJars,
}: {
  jars: Array<Jar>;
  selectedJars: Array<Jar>;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const {
    previewerState,
    handleInputChange: handleFileInputChange,
    resetPreviewer,
  } = useFilePreviewer();

  const [creditJar, setCreditJar] = useState(
    selectedJars.length ? selectedJars[0] : jars[0]
  );
  const [debitJar, setDebitJar] = useState(
    selectedJars.length > 1 ? selectedJars[1] : jars[1]
  );

  // We need to sync it with external state
  useEffect(() => {
    setCreditJar(selectedJars.length ? selectedJars[0] : jars[0]);
    setDebitJar(selectedJars.length > 1 ? selectedJars[1] : jars[1]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedJars]);

  const prepareClosing = () => {
    formRef?.current?.reset();
    resetPreviewer();
  };

  const { dialogState, openDialog, closeDialog } = useDialog({
    prepareClosing,
  });

  const handleSubmit = async (formData: FormData) => {
    const amount = Number(formData.get('sum'));
    const file = formData.get('file')! as File;

    const base64 = await fileToBase64(file);

    if (amount > creditJar.accumulated) {
      inputRef.current?.setCustomValidity('Завелика сума');
      inputRef.current?.reportValidity();
      return;
    }

    const payload: JarsTransactionPayload = {
      fromJarId: creditJar.id,
      toJarId: debitJar.id,
      jarSourceAmount: amount,
      otherSourcesAmount: 0,
      receipt: removeBase64DataPrefix(base64),
      receiptName: file.name,
    };

    const status = await transferMoneyBetweenJars(payload);

    if (status === 'Success') {
      prepareClosing();
      closeDialog();
    }
  };

  return (
    <Dialog
      title='Перерахувати з банки на банку'
      dialogState={dialogState}
      renderButton={() => (
        <Button onClick={openDialog}>🤑 З банки на банку</Button>
      )}
      renderContent={() => (
        <div className={styles['dialog-content']}>
          <form
            className={styles['form-content']}
            action={handleSubmit}
            ref={formRef}
          >
            <div className={styles['jars-and-previewer-wrapper']}>
              <fieldset className={styles['file-preview']}>
                <legend>Квитанція</legend>
                <input
                  type='file'
                  name='file'
                  placeholder='Квитанція у JPG/JPEG, PNG або PDF'
                  required
                  onChange={handleFileInputChange}
                  accept={previewerFileTypes.join(', ')}
                />
                <FilePreviewer previewerState={previewerState} />
              </fieldset>
              <div className={styles['jars-selection']}>
                <fieldset className={styles['sum-input-fieldset']}>
                  <legend>Сума перерахування</legend>
                  <input
                    ref={inputRef}
                    name='sum'
                    id='sum-input'
                    placeholder='20 000'
                    type='text'
                    required
                    pattern='[0-9]+'
                    className={styles['sum-input']}
                  />
                </fieldset>
                <JarSelector
                  title='З банки'
                  id='credit-jar'
                  jars={jars.filter((jar) => jar.id !== debitJar?.id)}
                  selectJar={setCreditJar}
                  selectedJar={creditJar}
                />
                <JarSelector
                  title='На банку'
                  id='debit-jar'
                  jars={jars.filter((jar) => jar.id !== creditJar?.id)}
                  selectJar={setDebitJar}
                  selectedJar={debitJar}
                />
              </div>
            </div>
            <SubmitButton />
          </form>
        </div>
      )}
    />
  );
};
