import { ReactElement, useRef } from 'react';

import styles from './Dialog.module.css';
import classNames from 'classnames';
import { Button } from '../Button/Button';

type DialogProps = {
  renderButton({ openDialog }: { openDialog: () => void }): ReactElement;
  renderContent({ closeDialog }: { closeDialog: () => void }): ReactElement;
  prepareClosing?: () => void | Promise<void>;
  title: string;
  className?: string;
};

export const Dialog = ({
  renderButton,
  renderContent,
  className,
  title,
  prepareClosing,
}: DialogProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const openDialog = () => {
    dialogRef.current?.showModal();
  };

  const closeDialog = async () => {
    await prepareClosing?.();
    dialogRef.current?.close();
  };

  return (
    <>
      {renderButton({ openDialog })}
      <dialog ref={dialogRef} className={classNames(styles.dialog, className)}>
        <div className={styles['dialog-header']}>
          <h4>{title}</h4>
          <Button onClick={closeDialog}>X</Button>
        </div>
        <div className={styles['dialog-content']}>
          {renderContent({ closeDialog })}
        </div>
      </dialog>
    </>
  );
};
