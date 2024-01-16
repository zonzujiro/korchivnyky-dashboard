import { ReactElement, useRef } from 'react';

import styles from './Dialog.module.css';
import classNames from 'classnames';

type DialogProps = {
  renderButton({ openDialog }: { openDialog: () => void }): ReactElement;
  renderContent({ closeDialog }: { closeDialog: () => void }): ReactElement;
  className?: string;
};

export const Dialog = ({
  renderButton,
  renderContent,
  className,
}: DialogProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const openDialog = () => {
    dialogRef.current?.showModal();
  };

  const closeDialog = () => {
    dialogRef.current?.close();
  };

  return (
    <>
      {renderButton({ openDialog })}
      <dialog ref={dialogRef} className={classNames(styles.dialog, className)}>
        {renderContent({ closeDialog })}
      </dialog>
    </>
  );
};
