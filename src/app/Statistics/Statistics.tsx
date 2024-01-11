'use client';

import React, { useState, useMemo, useContext } from 'react';
import { Tooltip } from 'react-tooltip';
import randomColor from 'randomcolor';

import type { Jar, JarStatisticRecord } from '../types';

import styles from './Statistics.module.css';
import { AppContext } from '../dal/StateProvider';
import { getStatistics } from '../dal/api';

const percentages = ['100%', '50%', '0%'];

const useDateFilter = (
  byDates: Record<string, Array<JarStatisticRecord>>,
  startDate: string,
  endDate: string
) => {
  return useMemo(() => {
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
};

const getBarHeight = (
  item: JarStatisticRecord,
  jar: Jar
): React.CSSProperties => {
  const { goal, color } = jar;
  const { accumulated } = item;

  const percentage = `${Math.round((100 * accumulated) / goal)}%`;

  return {
    height: percentage,
    background: color,
  };
};

const StatisticsSection = ({
  date,
  records,
  jars,
}: {
  date: string;
  records: Array<JarStatisticRecord>;
  jars: Array<Jar>;
}) => {
  return (
    <div className={styles['statistics-section-wrapper']}>
      <span className={styles['statistics-item-date']}>
        {date.split('-').toReversed().join('/')}
      </span>
      <div className={styles['statistics-section']}>
        {records.map((entry, index) => {
          const jar = jars.find(({ id }) => id === entry.jar_id)!;

          return (
            <div key={index} className={styles['statistics-item']}>
              <div
                id={`statistics-bar-${index}`}
                className={styles['statistics-bar']}
                style={getBarHeight(entry, jar)}
              />
              <span className={styles['jar-owner']}>{jar.owner_name}</span>
              <Tooltip anchorSelect={`#statistics-bar-${index}`}>
                <p>
                  <strong>Зібрано:</strong> {jar.accumulated}₴
                </p>
                <p>
                  <strong>Мета:</strong> {jar.goal}₴
                </p>
              </Tooltip>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const Statistics = ({
  statistics,
}: {
  statistics: Array<JarStatisticRecord>;
}) => {
  const { selectedJars, jars } = useContext(AppContext);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndData] = useState('');

  const filteredStatistics =
    selectedJars.length > 0
      ? statistics.filter((record) => {
          return selectedJars.includes(record.jar_id);
        })
      : statistics;

  //@ts-expect-error
  const recordsByDates = Object.groupBy(
    filteredStatistics,
    //@ts-expect-error
    ({ created_at }) => created_at
  ) as Record<string, Array<JarStatisticRecord>>;

  const filteredDates = useDateFilter(recordsByDates, startDate, endDate);

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
          {filteredDates.map((date) => {
            if (!recordsByDates[date]?.length) {
              return null;
            }

            return (
              <StatisticsSection
                key={date}
                date={date}
                records={recordsByDates[date]}
                jars={jars}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
