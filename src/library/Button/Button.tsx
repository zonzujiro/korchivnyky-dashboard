import { ReactNode } from 'react';
import classNames from 'classnames';

import styles from './Button.module.css';

type ButtonProps = {
  className?: string;
  children: ReactNode;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
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
      onClick={handleClick}
      type={type}
    >
      {children}
    </button>
  );
};
