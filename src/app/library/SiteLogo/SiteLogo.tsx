import Image from 'next/image';

import styles from './SiteLogo.module.css';

export const SiteLogo = () => {
  return (
    <div className={styles['site-logo-wrapper']}>
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
