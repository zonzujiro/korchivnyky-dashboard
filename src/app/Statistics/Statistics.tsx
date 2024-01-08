'use client';

import type { Jar, JarStatisticRecord } from '../types';

import styles from './Statistics.module.css';

const percentages = ['100%', '50%', '0%'];

const getItemStyle = (item: JarStatisticRecord, jar: Jar) => {
  const { goal } = jar;
  const { accumulated } = item;

  const percentage = `${Math.round((100 * accumulated) / goal)}%`;

  return {
    height: percentage,
  };
};

type StatisticsProps = {
  statistics: Array<JarStatisticRecord>;
  jars: Array<Jar>;
};

export const Statistics = ({ statistics, jars }: StatisticsProps) => {
  //@ts-expect-error
  const byDates = Object.groupBy(statistics, ({ created_at }) => created_at);

  console.log({ byDates });

  return (
    <div className={styles.statistics}>
      <div className={styles.percentages}>
        {percentages.map((percentage) => (
          <span key={percentage} className={styles.percentage}>
            {percentage}
          </span>
        ))}
      </div>
      <div className={styles.chart}>
        {statistics.map((item, index) => (
          <div
            key={index}
            className={styles['statistics-item']}
            style={getItemStyle(
              item,
              jars.find(({ id }) => id === item.jar_id)!
            )}
          />
        ))}
      </div>
    </div>
  );
};
