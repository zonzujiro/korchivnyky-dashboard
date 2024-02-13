'use client';

import { ReactElement, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import styles from './Dialog.module.css';
import classNames from 'classnames';
import { Button } from '../Button/Button';

type DialogProps = {
  renderButton(): ReactElement;
  renderContent(): ReactElement;
  title: string;
  className?: string;
  dialogState: { isOpen: boolean; closeDialog: () => void };
};

type UseDialogConfig = {
  prepareClosing?: () => void | Promise<void>;
};

export const useDialog = (config?: UseDialogConfig) => {
  const [isOpen, setIsOpen] = useState(false);

  const openDialog = () => {
    setIsOpen(true);
  };

  const closeDialog = async () => {
    await config?.prepareClosing?.();
    setIsOpen(false);
  };

  const dialogState = {
    isOpen,
    closeDialog,
  };

  return { openDialog, closeDialog, dialogState };
};

export const Dialog = (props: DialogProps) => {
  const { renderButton, renderContent, className, title, dialogState } = props;
  const { isOpen, closeDialog } = dialogState;
  const dialogRef = useRef<HTMLDialogElement>(null);

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
  };

  return (
    <>
      {renderButton()}
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
            <div className={styles['dialog-content']}>{renderContent?.()}</div>
          </dialog>,
          document.body
        )}
    </>
  );
};
