'use client';

import { ReactElement, useEffect, useRef, useState } from 'react';
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
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const openDialog = () => {
    setIsOpen(true);
  };

  const closeDialog = async () => {
    await prepareClosing?.();
    setIsOpen(false);
  };

  /**
   * Because we don't want to render all dialogs at once
   */
  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen]);

  /**
   * We need to catch event because events from portal will bubble
   * into parent element
   */
  const catchEvent = (ev: React.MouseEvent<HTMLDialogElement>) => {
    ev.stopPropagation();
    // ev.preventDefault();
  };

  return (
    <>
      {renderButton({ openDialog })}
      {isOpen &&
        createPortal(
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
