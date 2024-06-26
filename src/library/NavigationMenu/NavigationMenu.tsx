'use client';

import classNames from 'classnames';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import styles from './NavigationMenu.module.css';

export const NavigationMenu = () => {
  const pathname = usePathname();

  const isMainPage =
    !pathname.endsWith('/jars') && !pathname.endsWith('/invoices');

  return (
    <nav className={styles['navigation-wrapper']}>
      <ol className={styles['main-menu']}>
        <span className={styles['menu-separator']}>|</span>
        <li
          className={classNames(styles['menu-item'], {
            [styles.active]: isMainPage,
          })}
        >
          <Link href='./'>Збори</Link>
        </li>
        <span className={styles['menu-separator']}>|</span>
      </ol>
    </nav>
  );
};

export const NavigationSubMenu = () => {
  const pathname = usePathname();

  const isMainPage = !isNaN(Number(pathname.split('/').at(-1)));

  return (
    <nav className={styles['navigation-wrapper']}>
      <ol className={styles['main-menu']}>
        <span className={styles['menu-separator']}>|</span>
        <li
          className={classNames(styles['menu-item'], {
            [styles.active]: isMainPage,
          })}
        >
          <Link href='./'>Збори</Link>
        </li>

        <span className={styles['menu-separator']}>|</span>
        {!isMainPage && (
          <>
            <li
              className={classNames(styles['menu-item'], {
                [styles.active]: pathname.endsWith('/jars'),
              })}
            >
              <Link href='./jars'>Банки</Link>
            </li>
            <span className={styles['menu-separator']}>|</span>
            <li
              className={classNames(styles['menu-item'], {
                [styles.active]: pathname.endsWith('/invoices'),
              })}
            >
              <Link href='./invoices'>Рахунки</Link>
            </li>
            <span className={styles['menu-separator']}>|</span>
            <li
              className={classNames(styles['menu-item'], {
                [styles.active]: pathname.endsWith('/expense-types'),
              })}
            >
              <Link href='./expense-types'>Витрати</Link>
            </li>
            <span className={styles['menu-separator']}>|</span>
          </>
        )}
      </ol>
    </nav>
  );
};
