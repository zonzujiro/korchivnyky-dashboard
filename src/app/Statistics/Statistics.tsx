'use client';

import React, { useState, useMemo, useContext } from 'react';
import { Tooltip } from 'react-tooltip';
import randomColor from 'randomcolor';

import type { Jar, JarStatisticRecord } from '../types';

import styles from './Statistics.module.css';
import { AppContext } from '../dal/StateProvider';
import { toCurrency } from '../utils';
import { DEFAULT_JAR_GOAL } from '../constants';
import classNames from 'classnames';

const STRIPES_COLOR = randomColor();

const FIVE_DAYS_AGO = new Date();
FIVE_DAYS_AGO.setDate(FIVE_DAYS_AGO.getDate() - 5);

const extractCalendarDate = (date: Date) => [
  `${date.getDate()}`.padStart(2, '0'),
  `${date.getMonth() + 1}`.padStart(2, '0'),
  date.getFullYear(),
];

const accumulatedDataPeriod = () => {
  const today = new Date();

  const start = extractCalendarDate(FIVE_DAYS_AGO).join('/');
  const end = extractCalendarDate(today).join('/');

  return `${start} → ${end}`;
};

const getTodayDate = () => {
  const today = new Date();

  const month = `${today.getMonth() + 1}`.padStart(2, '0');

  return `${today.getFullYear()}-${month}-${today.getDate()}`;
};

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
        return new Date(dateItem) >= date;
      });
    }

    if (endDate) {
      const date = new Date(endDate);

      dates = dates.filter((dateItem) => {
        return new Date(dateItem) <= date;
      });
    }

    return dates;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate]);
};

const useAccumulatedData = (
  statistics: Array<JarStatisticRecord>,
  jarIds: Array<number>
) => {
  const fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
  const fiveDaysAgoInMs = fiveDaysAgo.valueOf();

  const freshData = statistics.filter((entry) => {
    return new Date(entry.created_at).valueOf() > fiveDaysAgoInMs;
  });

  return jarIds
    .map((id) => freshData.find(({ jar_id }) => jar_id === id))
    .filter(Boolean) as Array<JarStatisticRecord>;
};

const getProgressBarStyle = (
  jar: Jar,
  percentageOfGoal: string
): React.CSSProperties => {
  let { goal, color } = jar;

  if (goal === null) {
    color = `repeating-linear-gradient(
      45deg,
      ${color},
      ${color} 10px,
      ${STRIPES_COLOR} 10px,
      ${STRIPES_COLOR} 20px
    )`;
  }

  return {
    width: percentageOfGoal,
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
          const percentageOfGoal = `${Math.round(
            (100 * jar.accumulated) / (jar.goal || DEFAULT_JAR_GOAL)
          )}%`;

          return (
            <div key={index} className={styles['statistics-item']}>
              <div className={styles['statistics-bar-wrapper']}>
                <div
                  id={`statistics-bar-${index}`}
                  className={styles['statistics-bar']}
                  style={getProgressBarStyle(jar, percentageOfGoal)}
                />
                <span>{percentageOfGoal}</span>
              </div>
              <div className={styles['jar-owner']}>{jar.owner_name}</div>
              <Tooltip anchorSelect={`#statistics-bar-${index}`}>
                <p>
                  <strong>Зібрано:</strong> {toCurrency(jar.accumulated)}
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

export const Statistics = ({
  statistics,
}: {
  statistics: Array<JarStatisticRecord>;
}) => {
  const { selectedJars, jars } = useContext(AppContext);

  const [startDate, setStartDate] = useState(getTodayDate());
  const [endDate, setEndDate] = useState(getTodayDate());

  const [selectedTab, setSelectedTab] = useState<'accumulated' | 'by-dates'>(
    'accumulated'
  );

  const filteredStatistics =
    selectedJars.length > 0
      ? statistics.filter((record) => {
          return selectedJars.includes(record.jar_id);
        })
      : statistics;

  //@ts-expect-error
  const recordsByDates = Object.groupBy(
    filteredStatistics,
    ({ created_at }: { created_at: string }) => created_at
  ) as Record<string, Array<JarStatisticRecord>>;

  const accumulatedData = useAccumulatedData(
    statistics,
    selectedJars.length ? selectedJars : jars.map(({ id }) => id)
  );
  const filteredDates = useDateFilter(recordsByDates, startDate, endDate);

  return (
    <div className={styles['statistics-wrapper']}>
      <ul
        className={styles['statistics-tabs']}
        onClick={(ev: any) => setSelectedTab(ev.target.dataset.tabName)}
      >
        <li
          className={classNames(styles['statistics-tab'], {
            [styles['active']]: selectedTab === 'accumulated',
          })}
          data-tab-name='accumulated'
        >
          Поточний стан
        </li>
        <li
          className={classNames(styles['statistics-tab'], {
            [styles['active']]: selectedTab === 'by-dates',
          })}
          data-tab-name='by-dates'
        >
          Фільтр по датам
        </li>
      </ul>
      {selectedTab === 'by-dates' && (
        <div className={styles['date-inputs']}>
          <label htmlFor='start-date'>Початкова дата</label>
          <input
            type='date'
            id='start-date'
            className={styles['date-input']}
            onChange={(ev) => setStartDate(ev.target.value)}
            value={startDate}
            max={endDate}
          />
          <label htmlFor='end-date'>Кінцева дата</label>
          <input
            type='date'
            id='end-date'
            className={styles['date-input']}
            onChange={(ev) => setEndDate(ev.target.value)}
            value={endDate}
            min={startDate}
          />
        </div>
      )}
      <div className={styles.statistics}>
        <div className={styles.chart}>
          {selectedTab === 'accumulated' && (
            <StatisticsSection
              date={accumulatedDataPeriod()}
              records={accumulatedData}
              jars={jars}
            />
          )}

          {selectedTab === 'by-dates' &&
            filteredDates.map((date) => {
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
