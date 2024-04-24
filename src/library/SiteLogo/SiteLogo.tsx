import styles from './SiteLogo.module.css';
import classNames from 'classnames';
import AnimatedLogo from './AnimatedLogo/AnimatedLogo';

export const SiteLogo = ({ className }: { className?: string }) => {
  return (
    <div className={classNames(styles['site-logo-wrapper'], className)}>
      <AnimatedLogo />
      <div className={styles['name-and-slogan']}>
        <h1 className={styles['site-name']}>Корчівники</h1>
        <span>Non nobis solum nati sumus</span>
      </div>
    </div>
  );
};
