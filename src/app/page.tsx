import Image from 'next/image';

import styles from './page.module.css';
import { getInitialData } from './dal/api';

import { JarsList } from './JarsList/JarsList';
import { Progress } from './Progress/Progress';
import { Statistics } from './Statistics/Statistics';
import { StateProvider } from './dal/StateProvider';
import { CampaignDescription } from './CampaignDescription/CampaignDescription';

const GOAL = 2500000;

export default async function Home() {
  const { jars, statistics, expenseTypes, expenses } = await getInitialData();

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
        <div className={styles['name-and-slogan']}>
          <h1 className={styles['site-name']}>Корчівники</h1>
          <span>Non nobis solum nati sumus</span>
        </div>
      </header>
      <main className={styles.main}>
        <StateProvider
          jars={jars}
          expenses={expenses}
          expenseTypes={expenseTypes}
        >
          <div className={styles['general-info']}>
            <Progress goal={GOAL} jars={jars} />
            <CampaignDescription />
          </div>
          <JarsList />
          <Statistics statistics={statistics} />
        </StateProvider>
      </main>
    </>
  );
}
