import type { ReactNode, MouseEvent } from 'react';
import classNames from 'classnames';

import styles from './Button.module.css';

type ButtonProps = {
  className?: string;
  children: ReactNode;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  pressed?: boolean;
  type?: 'submit' | 'button';
  title?: string;
  color?: 'red';
};

export const Button = ({
  className,
  children,
  onClick,
  disabled,
  type,
  pressed,
  title,
  color,
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
        [styles.red]: color === 'red',
      })}
      onClick={handleClick}
      type={type}
    >
      {children}
    </button>
  );
};
