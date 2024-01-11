import Image from 'next/image';

import type { Jar } from './types';
import styles from './page.module.css';
import { getJars } from './dal/api';

import { JarsList } from './JarsList/JarsList';
import { Progress } from './Progress/Progress';
import { Statistics } from './Statistics/Statistics';
import { statistics } from './dal/mocks';
import { StateProvider } from './dal/StateProvider';

const GOAL = 2500000;

const getGatheredMoney = (jars: Array<Jar>) => {
  return Object.values(jars).reduce((acc, { accumulated }) => {
    return acc + accumulated;
  }, 0);
};

export default async function Home() {
  const jars = await getJars();

  const currentSum = getGatheredMoney(jars);

  return (
    <>
      <header className={styles.header}>
        <Image
          className={styles['site-logo']}
          src='/images/site-logo.png'
          width={100}
          height={100}
          alt='site logo'
        />
        <h1 className={styles['site-name']}>Корчівникі</h1>
      </header>
      <main className={styles.main}>
        <StateProvider>
          <Progress goal={GOAL} currentSum={currentSum} />
          <JarsList jars={jars} />
          <Statistics jars={jars} statistics={statistics} />
        </StateProvider>
      </main>
    </>
  );
}
