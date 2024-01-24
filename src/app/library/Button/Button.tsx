import { ReactNode } from 'react';
import classNames from 'classnames';

import styles from './Button.module.css';

type ButtonProps = {
  className?: string;
  children: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'submit';
};

export const Button = ({
  className,
  children,
  onClick,
  disabled,
  type,
}: ButtonProps) => {
  return (
    <button
      disabled={disabled}
      className={classNames(styles.button, className)}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
};
