'use client';

import React, { useState, useMemo, useContext } from 'react';
import { Tooltip } from 'react-tooltip';
import randomColor from 'randomcolor';

import type { Jar, JarStatisticRecord } from '../types';

import styles from './Statistics.module.css';
import { AppContext } from '../dal/StateProvider';
import { toCurrency } from '../utils';
import { DEFAULT_JAR_GOAL } from '../constants';

const percentages = ['100%', '50%', '0%'];
const STRIPES_COLOR = randomColor();

const getInitialDate = () => {
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

  const [startDate, setStartDate] = useState(getInitialDate());
  const [endDate, setEndData] = useState(getInitialDate());

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
          max={endDate}
        />
        <label htmlFor='end-date'>Кінцева дата</label>
        <input
          type='date'
          id='end-date'
          className={styles['date-input']}
          onChange={(ev) => setEndData(ev.target.value)}
          value={endDate}
          min={startDate}
        />
      </div>
      <div className={styles.statistics}>
        {/* <div className={styles.percentages}>
          {percentages.map((percentage) => (
            <span key={percentage} className={styles.percentage}>
              {percentage}
            </span>
          ))}
        </div> */}
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
