'use client';

import React, { useState, useContext } from 'react';
import classNames from 'classnames';

import { Jar } from '@/app/types';
import { toCurrency } from '@/app/toolbox';
import { AppContext } from '@/app/dal';

import styles from './Statistics.module.css';
import { StatisticsSection } from './StatisticsSection/StatisticsSection';
import { getAccountsMovements, getGatheringSpeed } from './analytics';
import { ExportStatisticsDialog } from './ExportStatisticsDialog/ExportStatisticsDialog';
import { ExpensesSection } from './ExpensesSection/ExpensesSection';

const FIVE_DAYS_AGO = new Date();
FIVE_DAYS_AGO.setDate(FIVE_DAYS_AGO.getDate() - 5);

const NO_DATA_TEXT = 'Немає даних 🤷‍♂️';

// const TODAY = new Date();
// const getDateInputInitialValue = (date: Date) => {
//   const day = date.getDate();
//   const month = `${date.getMonth() + 1}`;
//   const year = date.getFullYear();

//   return `${year}-${month}-${day}`;
// };

const GrowthRow = ({
  jarId,
  startDateAmount,
  endDateAmount,
  percentage,
  difference,
  jars,
}: ReturnType<typeof getAccountsMovements>[number] & { jars: Array<Jar> }) => {
  const jar = jars.find((jar) => jar.id === Number(jarId));

  return (
    <div className={classNames(styles['grid-row'], styles['three-cells'])}>
      <span className={styles.cell}>{jar?.ownerName}</span>
      <span
        className={classNames(styles.cell, {
          [styles['positive-dynamic']]: difference > 0,
          [styles['no-dynamic']]: difference === 0,
          [styles['negative-dynamic']]: difference < 0,
        })}
      >
        {toCurrency(difference)} ({percentage})
      </span>
      <span className={styles.cell}>
        {toCurrency(startDateAmount)} → {toCurrency(endDateAmount)}
      </span>
    </div>
  );
};

const SpeedRow = ({
  jarId,
  speed,
  jars,
}: ReturnType<typeof getGatheringSpeed>[number] & { jars: Array<Jar> }) => {
  const jar = jars.find((jar) => jar.id === Number(jarId));

  return (
    <div
      key={jarId}
      className={classNames(styles['grid-row'], styles['two-cells'])}
    >
      <span className={styles.cell}>{jar?.ownerName}</span>
      <span className={styles.cell}>{speed}</span>
    </div>
  );
};

export const Statistics = () => {
  const { selectedJars, jars, expenses, expenseTypes, statistics } =
    useContext(AppContext);

  const [activeTab, setActiveTab] = useState<'statistics' | 'expenses'>(
    'statistics'
  );
  const [startDate, setStartDate] = useState('2024-01-05');
  const [endDate, setEndDate] = useState('2024-01-12');

  const usedJars = selectedJars.length ? selectedJars : jars;

  const filteredStatistics = selectedJars.length
    ? statistics.filter((record) => {
        return selectedJars.find(
          (selectedJar) => selectedJar.id === record.jarId
        );
      })
    : statistics;

  const growth = getAccountsMovements(
    usedJars,
    filteredStatistics,
    new Date(startDate),
    new Date(endDate)
    // FIVE_DAYS_AGO,
    // TODAY
  );

  const speed = getGatheringSpeed(
    usedJars,
    filteredStatistics,
    new Date(startDate),
    new Date(endDate)
  );

  return (
    <div className={styles['section-content']}>
      <ul className={styles.tabs}>
        <li
          className={classNames(styles.tab, {
            [styles.active]: activeTab === 'statistics',
          })}
          onClick={() => setActiveTab('statistics')}
        >
          Поточний стан
        </li>
        <li
          className={classNames(styles.tab, {
            [styles.active]: activeTab === 'expenses',
          })}
          onClick={() => setActiveTab('expenses')}
        >
          Видатки
        </li>
      </ul>
      <div className={styles['statistics-wrapper']}>
        {activeTab === 'statistics' ? (
          <div className={classNames(styles.column, styles.statistics)}>
            <div className={styles['column-header']}>
              <ExportStatisticsDialog jars={jars} />
            </div>
            <div className={styles.chart}>
              <StatisticsSection jars={usedJars} />
            </div>
          </div>
        ) : null}
        {activeTab === 'expenses' ? (
          <div className={classNames(styles.column, styles.statistics)}>
            <div className={styles.chart}>
              <ExpensesSection
                expenses={expenses}
                expensesTypes={expenseTypes}
                jars={selectedJars}
              />
            </div>
          </div>
        ) : null}
        <div className={classNames(styles.column, styles.analytics)}>
          <div className={styles['column-header']}>
            <div className={styles['date-inputs-wrapper']}>
              <span className={styles['inputs-title-prefix']}>
                Аналітика за період:
              </span>
              <div className={styles['date-inputs']}>
                <input
                  type='date'
                  id='start-date'
                  className={styles['date-input']}
                  onChange={(ev) => setStartDate(ev.target.value)}
                  value={startDate}
                  max={endDate}
                />
                →
                <input
                  type='date'
                  id='end-date'
                  className={styles['date-input']}
                  onChange={(ev) => setEndDate(ev.target.value)}
                  value={endDate}
                  min={startDate}
                />
              </div>
            </div>
          </div>
          <div className={styles['analytics-content']}>
            <h4>Динаміка по банкам</h4>
            <div className={styles.growth}>
              {growth.length
                ? growth.map((dataEntry) => (
                    <GrowthRow
                      key={dataEntry.jarId}
                      jars={jars}
                      {...dataEntry}
                    />
                  ))
                : NO_DATA_TEXT}
            </div>
          </div>
          <div className={styles['analytics-content']}>
            <h4>Середня швидкість</h4>
            <div className={styles['gathering-speed-list']}>
              {speed.length
                ? speed.map((dataEntry) => (
                    <SpeedRow
                      key={dataEntry.jarId}
                      jars={jars}
                      {...dataEntry}
                    />
                  ))
                : NO_DATA_TEXT}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
