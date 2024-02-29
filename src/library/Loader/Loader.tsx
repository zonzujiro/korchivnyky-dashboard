import type { ReactNode } from 'react';
import styles from './Loader.module.css';
import classNames from 'classnames';

export const Loader = ({
  isLoading,
  children,
  className,
}: {
  isLoading?: boolean;
  children?: ReactNode;
  className?: string;
}) => {
  if (isLoading === true || !children) {
    return (
      <div className={classNames(styles.loader, className)}>
        <p>🚙 Машинка виїхала. Очікуйте...</p>
      </div>
    );
  }

  return children;
};
