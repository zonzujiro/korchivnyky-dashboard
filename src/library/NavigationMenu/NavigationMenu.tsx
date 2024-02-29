'use client';

import classNames from 'classnames';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import type { FundraisingCampaign } from '@/types';

import styles from './NavigationMenu.module.css';

type NavigationMenuProps = {
  fundraisings: Array<FundraisingCampaign>;
};

const parsePathname = (path: string) => {
  return path.split('/').slice(1) as Array<string>;
};

const getNextPath = (oldPath: string, id: string) => {
  const path = parsePathname(oldPath);

  if (!path.length) {
    return `/fundraisings/${id}/jars`;
  }

  path[1] = id;

  return `/${path.join('/')}`;
};

export const NavigationMenu = ({ fundraisings }: NavigationMenuProps) => {
  const pathname = usePathname();
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, fundraisingsId] = parsePathname(pathname);

  return (
    <nav>
      <ol className={styles['main-menu']}>
        <span className={styles['menu-separator']}>|</span>
        <li className={styles['menu-item']}>
          <select
            className={styles['fundraising-select']}
            onChange={(ev) =>
              router.push(getNextPath(pathname, ev.target.value))
            }
            defaultValue={fundraisingsId}
          >
            {fundraisings.map((item) => {
              return (
                <option value={item.id} key={item.id}>
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
