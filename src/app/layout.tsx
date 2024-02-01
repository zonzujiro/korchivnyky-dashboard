import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';

import classNames from 'classnames';
import './globals.css';
import styles from './layout.module.css';

import { NavigationMenu, SiteLogo } from './library';
import { getHomePageData, StateProvider } from './dal';

const inter = Inter({ subsets: ['latin'] });

const eUkraineHeadFont = localFont({
  src: './fonts/e-Ukraine-Head/e-UkraineHead-LOGO.otf',
  display: 'swap',
  variable: '--eUkraineHeadLogo',
});

const eUkraineFont = localFont({
  src: [
    {
      path: './fonts/e-Ukraine/e-Ukraine-Bold.otf',
      weight: '600',
      style: 'bold',
    },
    {
      path: './fonts/e-Ukraine/e-Ukraine-Light.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/e-Ukraine/e-Ukraine-Light.otf',
      weight: '100',
      style: 'lighter',
    },
  ],
  variable: '--eUkraine',
});

export const metadata: Metadata = {
  title: 'Корчівники - Non nobis solum nati sumus',
  description: 'Ми і є Корчівники, довбойоб',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { jars, expenseTypes, expenses, statistics } = await getHomePageData();

  return (
    <html lang='en'>
      <body
        className={classNames(
          inter.className,
          eUkraineHeadFont.variable,
          eUkraineFont.variable
        )}
      >
        <header className={styles.header}>
          <SiteLogo />
          <NavigationMenu />
        </header>
        <main className={styles.main}>
          <StateProvider
            jars={jars}
            expenses={expenses}
            expenseTypes={expenseTypes}
            statistics={statistics}
          >
            {children}
          </StateProvider>
        </main>
      </body>
    </html>
  );
}
