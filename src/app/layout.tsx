import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';

import classNames from 'classnames';
import './globals.css';

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body
        className={classNames(
          inter.className,
          eUkraineHeadFont.variable,
          eUkraineFont.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}
