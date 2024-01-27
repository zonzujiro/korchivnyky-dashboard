import { ReactElement, useRef } from 'react';
import { createPortal } from 'react-dom';

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

  /**
   * We need to catch event because events from portal will bubble
   * into parent element
   */
  const catchEvent = (ev: React.MouseEvent<HTMLDialogElement>) =>
    ev.stopPropagation();

  return (
    <>
      {renderButton({ openDialog })}
      {createPortal(
        <dialog
          ref={dialogRef}
          className={classNames(styles.dialog, className)}
          onClick={catchEvent}
        >
          <div className={styles['dialog-header']}>
            <h4>{title}</h4>
            <Button onClick={closeDialog}>X</Button>
          </div>
          <div className={styles['dialog-content']}>
            {renderContent({ closeDialog })}
          </div>
        </dialog>,
        document.body
      )}
    </>
  );
};
