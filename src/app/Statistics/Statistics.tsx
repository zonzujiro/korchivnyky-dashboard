'use client';

import { useState, useMemo } from 'react';

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

const StatisticsSection = ({
  date,
  statistics,
  jars,
}: StatisticsProps & {
  date: string;
}) => {
  return (
    <div className={styles['statistics-section-wrapper']}>
      <div className={styles['statistics-section']}>
        {statistics.map((entry, index) => {
          return (
            <div
              key={index}
              className={styles['statistics-item']}
              style={getItemStyle(
                entry,
                jars.find(({ id }) => id === entry.jar_id)!
              )}
            />
          );
        })}
      </div>
      <span className={styles['statistics-item-date']}>
        {date.split('-').toReversed().join('/')}
      </span>
    </div>
  );
};

export const Statistics = ({ statistics, jars }: StatisticsProps) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndData] = useState('');

  //@ts-expect-error
  const byDates = Object.groupBy(
    statistics,
    //@ts-expect-error
    ({ created_at }) => created_at
  ) as Record<string, Array<JarStatisticRecord>>;

  const dates = useMemo(() => {
    let dates = Object.keys(byDates);

    if (startDate) {
      const date = new Date(startDate);

      dates = dates.filter((dateItem) => {
        return new Date(dateItem) > date;
      });
    }

    if (endDate) {
      const date = new Date(endDate);

      dates = dates.filter((dateItem) => {
        return new Date(dateItem) < date;
      });
    }

    return dates;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate]);

  return (
    <div className={styles['statistics-wrapper']}>
      <div className={styles['date-inputs']}>
        <label htmlFor='start-date'>Початкова дата</label>
        <input
          type='date'
          id='start-date'
          className={styles['date-input']}
          onChange={(ev) => setStartDate(ev.target.value)}
          value={startDate}
        />
        <label htmlFor='end-date'>Кінцева дата</label>
        <input
          type='date'
          id='end-date'
          className={styles['date-input']}
          onChange={(ev) => setEndData(ev.target.value)}
          value={endDate}
        />
      </div>
      <div className={styles.statistics}>
        <div className={styles.percentages}>
          {percentages.map((percentage) => (
            <span key={percentage} className={styles.percentage}>
              {percentage}
            </span>
          ))}
        </div>
        <div className={styles.chart}>
          {dates.map((date) => {
            return (
              <StatisticsSection
                key={date}
                date={date}
                statistics={byDates[date]}
                jars={jars}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
