'use client';

import classNames from 'classnames';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import type { FundraisingCampaign } from '@/app/types';

import styles from './NavigationMenu.module.css';

type NavigationMenuProps = {
  fundraisings: Array<FundraisingCampaign>;
};

const getNextPath = (oldPath: string, id: number) => {
  const path = oldPath.split('/').slice(1) as Array<number | string>;
  path[1] = id;

  if (!path.length) {
    return `/fundraisings/${id}/jars`;
  }

  return `/${path.join('/')}`;
};

export const NavigationMenu = ({ fundraisings }: NavigationMenuProps) => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav>
      <ol className={styles['main-menu']}>
        <span className={styles['menu-separator']}>|</span>
        <li className={styles['menu-item']}>
          <select className={styles['fundraising-select']}>
            {fundraisings.map((item) => {
              return (
                <option
                  onClick={() => router.push(getNextPath(pathname, item.id))}
                  key={item.id}
                >
                  {item.name}
                </option>
              );
            })}
          </select>
        </li>
        <span className={styles['menu-separator']}>|</span>
        <li
          className={classNames(styles['menu-item'], {
            [styles.active]: pathname.includes('/jars'),
          })}
        >
          <Link href='./jars'>Банки</Link>
        </li>
        <span className={styles['menu-separator']}>|</span>
        <li
          className={classNames(styles['menu-item'], {
            [styles.active]: pathname.includes('/invoices'),
          })}
        >
          <Link href='./invoices'>Рахунки</Link>
        </li>
        <span className={styles['menu-separator']}>|</span>
      </ol>
    </nav>
  );
};
