'use client';

import React, { useState, useMemo, useContext } from 'react';

import type { JarStatisticRecord } from '../types';

import styles from './Statistics.module.css';
import { AppContext } from '../dal/StateProvider';
import { StatisticsSection } from './StatisticsSection/StatisticsSection';
import { gatherGrowthAnalytics } from './gatherAnalytics';
import classNames from 'classnames';
import { toCurrency } from '../utils';

const FIVE_DAYS_AGO = new Date();
FIVE_DAYS_AGO.setDate(FIVE_DAYS_AGO.getDate() - 5);

const TODAY = new Date();

const extractCalendarDate = (date: Date) => [
  `${date.getDate()}`.padStart(2, '0'),
  `${date.getMonth() + 1}`.padStart(2, '0'),
  date.getFullYear(),
];

const getDateInputsInitialValue = () => {
  return extractCalendarDate(new Date()).toReversed().join('-');
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

export const Statistics = ({
  statistics,
}: {
  statistics: Array<JarStatisticRecord>;
}) => {
  const { selectedJars, jars } = useContext(AppContext);

  // const [startDate, setStartDate] = useState(getDateInputsInitialValue());
  // const [endDate, setEndDate] = useState(getDateInputsInitialValue());

  // const [selectedTab, setSelectedTab] = useState<'accumulated' | 'by-dates'>(
  //   'accumulated'
  // );

  const usedJars = selectedJars.length ? selectedJars : jars;

  const filteredStatistics = selectedJars.length
    ? statistics.filter((record) => {
        return selectedJars.find(
          (selectedJar) => selectedJar.id === record.jar_id
        );
      })
    : statistics;

  // //@ts-expect-error
  // const recordsByDates = Object.groupBy(
  //   filteredStatistics,
  //   ({ created_at }: { created_at: string }) => created_at
  // ) as Record<string, Array<JarStatisticRecord>>;

  // const accumulatedData = useAccumulatedData(
  //   statistics,
  //   usedJars.map(({ id }) => id)
  // );

  // const filteredDates = useDateFilter(recordsByDates, startDate, endDate);

  const growth = gatherGrowthAnalytics(
    usedJars,
    filteredStatistics,
    new Date('2024-01-05'),
    new Date('2024-01-12')
    // FIVE_DAYS_AGO,
    // TODAY
  );

  return (
    <div className={styles['statistics-wrapper']}>
      {/* <ul
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
      </ul> */}
      {/* {selectedTab === 'by-dates' && (
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
      )} */}
      <div className={classNames(styles.column, styles.statistics)}>
        <div className={styles['column-header']}>Поточний стан</div>
        <div className={styles.chart}>
          <StatisticsSection jars={usedJars} />

          {/* {selectedTab === 'by-dates' &&
            filteredDates.map((date) => {
              if (!recordsByDates[date]?.length) {
                return null;
              }

              return <StatisticsSection key={date} date={date} jars={jars} />;
            })} */}
        </div>
      </div>
      <div className={classNames(styles.column, styles.analytics)}>
        <div className={styles['column-header']}>
          <span>
            Аналітика за період:{' '}
            {`${extractCalendarDate(FIVE_DAYS_AGO).join(
              '/'
            )} → ${extractCalendarDate(TODAY).join('/')}`}
          </span>
        </div>
        <div className={styles['analytics-content']}>
          <div className={styles['growth']}>
            <span className={styles['growth-header']}>Динаміка</span>
            <div className={styles['growth-list']}>
              <div className={classNames(styles.column, styles['jar-owners'])}>
                {growth.map(({ jarId }) => {
                  const jar = jars.find((jar) => jar.id === Number(jarId));
                  return (
                    <span className={styles['growth-jar-owner']} key={jarId}>
                      {jar?.owner_name}
                    </span>
                  );
                })}
              </div>
              <div className={styles.column}>
                {growth.map(({ jarId, percentage, amount }, index) => {
                  return (
                    <span
                      key={`${jarId}-${index}`}
                      className={classNames(styles['growth-amount'], {
                        [styles.positive]: amount > 0,
                        [styles['no-changes']]: amount === 0,
                        [styles.negative]: amount < 0,
                      })}
                    >
                      {toCurrency(amount)} ({percentage})
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
