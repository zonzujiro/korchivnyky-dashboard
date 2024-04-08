import { Tooltip } from 'react-tooltip';

import type { Jar } from '@/types';
import { toCurrency } from '@/toolbox';
import { DEFAULT_JAR_GOAL } from '@/app/constants';

import styles from './StatisticsSection.module.css';

const getProgressBarStyle = (
  jar: Jar,
  percentageOfGoal: string
): React.CSSProperties => {
  const { color } = jar;

  return {
    width: parseInt(percentageOfGoal) ? percentageOfGoal : `1%`,
    background: color,
  };
};

export const StatisticsSection = ({
  date,
  jars,
}: {
  date?: string;
  jars: Array<Jar>;
}) => {
  return (
    <div className={styles['statistics-section-wrapper']}>
      {date && (
        <span className={styles['statistics-item-date']}>
          {date.split('-').toReversed().join('/')}
        </span>
      )}
      <div className={styles['statistics-section']}>
        {jars.map((jar) => {
          const percentageOfGoal = `${Math.round(
            (100 * jar.debit) / (jar.goal || DEFAULT_JAR_GOAL)
          )}%`;

          return (
            <div key={jar.id} className={styles['statistics-item']}>
              <div className={styles['statistics-bar-wrapper']}>
                <div
                  id={`statistics-bar-${jar.id}`}
                  className={styles['statistics-bar']}
                  style={getProgressBarStyle(jar, percentageOfGoal)}
                />
                <span>{percentageOfGoal}</span>
              </div>
              <div className={styles['jar-owner']}>{jar.ownerName}</div>
              <Tooltip anchorSelect={`#statistics-bar-${jar.id}`}>
                <p>
                  <strong>Зібрано:</strong>{' '}
                  {toCurrency(jar.accumulated || jar.debit)}
                </p>
                {jar.goal && (
                  <p>
                    <strong>Мета:</strong> {toCurrency(jar.goal)}
                  </p>
                )}
              </Tooltip>
            </div>
          );
        })}
      </div>
    </div>
  );
};
