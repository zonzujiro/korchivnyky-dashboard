'use client';

import { useRef } from 'react';
import styles from './AnimatedLogo.module.css';

const AnimatedLogo = () => {
  const groupRef = useRef<SVGGElement>(null);

  const handleGroupClick = () => {
    const group = groupRef.current;
    if (group) {
      group.classList.add(styles.active);

      setTimeout(() => {
        group.classList.remove(styles.active);
      }, 1500);
    }
  };

  return (
    <div>
      <svg className={styles.mainCanvas} width='200' height='200'>
        <g className={styles.group} ref={groupRef} onClick={handleGroupClick}>
          <image
            className={styles.yellowBlue}
            href='/animatedLogoSvg/yellow-blue.svg'
            height='100'
            width='100'
            x='50'
            y='50'
          />
          <image
            className={styles.wheelAndWrenches}
            href='/animatedLogoSvg/wheel-and-wrenches2.svg'
            height='100'
            width='100'
            x='50'
            y='50'
          />
          <image
            className={styles.darkCircle}
            href='/animatedLogoSvg/dark-circle.svg'
            height='100'
            width='100'
            x='50'
            y='50'
          />
          <image
            className={styles.wheel}
            href='/animatedLogoSvg/wheel2.svg'
            height='100'
            width='100'
            x='50'
            y='50'
          />
          <image
            className={styles.wheelFadeInOut}
            href='/animatedLogoSvg/wheel-fadeInOut2.svg'
            height='100'
            width='100'
            x='50'
            y='50'
          />
          <image
            className={styles.title}
            href='/animatedLogoSvg/title2.svg'
            height='100'
            width='100'
            x='50'
            y='50'
          />
        </g>
      </svg>
    </div>
  );
};

export default AnimatedLogo;
