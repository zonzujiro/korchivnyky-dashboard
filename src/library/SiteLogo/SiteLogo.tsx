import Image from 'next/image';

import styles from './SiteLogo.module.css';
import classNames from 'classnames';

export const SiteLogo = ({ className }: { className?: string }) => {
  return (
    <div className={classNames(styles['site-logo-wrapper'], className)}>
      <Image
        className={styles['site-logo']}
        src='/site-logo.svg'
        width={100}
        height={100}
        alt='site logo'
      />
      <div className={styles['name-and-slogan']}>
        <h1 className={styles['site-name']}>Корчівники</h1>
        <span>Non nobis solum nati sumus</span>
      </div>
    </div>
  );
};
