import { Suspense, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';

import type { ExpenseRecord, Jar } from '@/types';

import {
  Button,
  Dialog,
  FileInput,
  JarSelector,
  useDialog,
  useFileInput,
} from '@/library';
import { transferMoneyBetweenJars } from '@/app/actions';
import type { JarsTransactionPayload } from '@/dal';

import styles from './TransferBetweenJarsDialog.module.css';
import { useRouter } from 'next/navigation';
import { removeBase64DataPrefix } from '@/toolbox';

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
  expenses,
}: {
  jars: Array<Jar>;
  selectedJars: Array<Jar>;
  expenses: Array<ExpenseRecord>;
}) => {
  const router = useRouter();
  const amountInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const fileInput = useFileInput();

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
    fileInput.reset();
  };

  const { dialogState, openDialog, closeDialog } = useDialog({
    prepareClosing,
  });

  const handleSubmit = async (formData: FormData) => {
    const [fileMetadata] = fileInput.value;

    if (!fileMetadata) {
      fileInput.setErrorText('🤪 Не вистачає файлів!');
      return;
    }

    const amount = Number(formData.get('sum'));

    if (amount > creditJar?.debit - creditJar?.credit) {
      amountInputRef.current?.setCustomValidity('На банці недостатньо коштів');
      amountInputRef.current?.reportValidity();
      return;
    }

    const payload: JarsTransactionPayload = {
      fromJarId: creditJar?.id,
      toJarId: debitJar?.id,
      jarSourceAmount: amount,
      otherSourcesAmount: 0,
      receipt: removeBase64DataPrefix(fileMetadata.src),
      receiptName: fileMetadata.name,
    };

    const status = await transferMoneyBetweenJars(payload);

    if (status === 'Success') {
      router.refresh();
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
              <FileInput title='Квитанція' filesInputState={fileInput} />
              <div className={styles['jars-selection']}>
                <fieldset className={styles['sum-input-fieldset']}>
                  <legend>Сума перерахування</legend>
                  <input
                    ref={amountInputRef}
                    type='number'
                    min='1'
                    step='0.01'
                    name='sum'
                    id='sum-input'
                    placeholder='20 000'
                    className={styles['sum-input']}
                  />
                </fieldset>
                <Suspense fallback={'Loading...'}>
                  <JarSelector
                    title='З банки'
                    id='credit-jar'
                    jars={jars.filter((jar) => jar.id !== debitJar?.id)}
                    selectJar={setCreditJar}
                    selectedJar={creditJar}
                    expenses={expenses}
                  />
                  <JarSelector
                    title='На банку'
                    id='debit-jar'
                    jars={jars.filter((jar) => jar.id !== creditJar?.id)}
                    selectJar={setDebitJar}
                    selectedJar={debitJar}
                    expenses={expenses}
                  />
                </Suspense>
              </div>
            </div>
            <SubmitButton />
          </form>
        </div>
      )}
    />
  );
};
