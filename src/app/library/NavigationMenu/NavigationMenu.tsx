'use client';

import classNames from 'classnames';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import styles from './NavigationMenu.module.css';

export const NavigationMenu = () => {
  const pathname = usePathname();

  return (
    <nav>
      <ol className={styles['main-menu']}>
        <li
          className={classNames(styles['menu-item'], {
            [styles.active]: pathname === '/jars',
          })}
        >
          <Link href='/jars'>Банки</Link>
        </li>
        <span className={styles['menu-separator']}>|</span>
        <li
          className={classNames(styles['menu-item'], {
            [styles.active]: pathname === '/invoices',
          })}
        >
          <Link href='/invoices'>Рахунки</Link>
        </li>
      </ol>
    </nav>
  );
};
