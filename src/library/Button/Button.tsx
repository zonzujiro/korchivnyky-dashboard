import type { ReactNode, MouseEvent } from 'react';
import classNames from 'classnames';

import styles from './Button.module.css';

type ButtonProps = {
  className?: string;
  children: ReactNode;
  disabled?: boolean;
<<<<<<< HEAD
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
=======
  onClick?: (ev: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
>>>>>>> e65cac7 (chaning jar design)
  pressed?: boolean;
  type?: 'submit';
  title?: string;
};

export const Button = ({
  className,
  children,
  onClick,
  disabled,
  type,
  pressed,
  title,
}: ButtonProps) => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onClick?.(event);
  };

  return (
    <button
      disabled={disabled}
      title={title}
      className={classNames(styles.button, className, {
        [styles.pressed]: pressed,
      })}
<<<<<<< HEAD
      onClick={handleClick}
=======
      onClick={(ev) => onClick?.(ev)}
>>>>>>> e65cac7 (chaning jar design)
      type={type}
    >
      {children}
    </button>
  );
};
