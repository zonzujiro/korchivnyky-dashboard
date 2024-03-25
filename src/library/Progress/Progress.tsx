'use client';

import {
  getDateString,
  getGatheredMoney,
  getTimeString,
  toCurrency,
} from '@/toolbox';
import type { Jar, JarStatisticRecord } from '@/types';

import styles from './Progress.module.css';

type ProgressProps = {
  goal: number;
  jars: Array<Jar>;
  newestRecord?: JarStatisticRecord;
};

export const Progress = ({ goal, jars, newestRecord }: ProgressProps) => {
  const currentSum = getGatheredMoney(jars);
  const percentage = `${Math.floor((100 * currentSum) / goal)}%`;

  return (
    <div className={styles.progress}>
      <h3>Мета: {toCurrency(goal)}</h3>
      <h3>Зібрано: {toCurrency(currentSum)}</h3>
      <div className={styles['progress-bar-wrapper']}>
        <div className={styles['progress-bar']}>
          <div
            className={styles['current-progress']}
            style={{ width: percentage }}
          />
        </div>
        <span>{percentage}</span>
      </div>
      {newestRecord ? (
        <small title='Оновлення раз на 12 годин' className={styles.timestamp}>
          Данні станом на: {getTimeString(newestRecord.createdAt)}{' '}
          {getDateString(newestRecord.createdAt)}
        </small>
      ) : null}
    </div>
  );
};
