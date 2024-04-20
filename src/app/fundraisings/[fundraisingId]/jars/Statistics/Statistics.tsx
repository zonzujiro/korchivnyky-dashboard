'use client';

import React, { useState, useContext } from 'react';
import classNames from 'classnames';

import { Jar, JarStatisticRecord } from '@/types';
import { toCurrency } from '@/toolbox';
import { JarsPageContext } from '@/dal';

import styles from './Statistics.module.css';
import { StatisticsSection } from './StatisticsSection/StatisticsSection';
import { getAccountsMovements, getGatheringSpeed } from './analytics';
import { ExportStatisticsDialog } from './ExportStatisticsDialog/ExportStatisticsDialog';
import { ExpensesSection } from './ExpensesSection/ExpensesSection';

const FIVE_DAYS_AGO = new Date();
FIVE_DAYS_AGO.setDate(FIVE_DAYS_AGO.getDate() - 5);

const NO_DATA_TEXT = 'Немає даних 🤷‍♂️';

const TODAY = new Date();

const getDateInputInitialValue = (date: Date) => {
  const day = `${date.getDate()}`.padStart(2, '0');
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const year = date.getFullYear();

  return `${year}-${month}-${day}`;
};

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

export const Analytics = ({
  jarsRecords,
  jars,
}: {
  jarsRecords: Array<JarStatisticRecord>;
  jars: Array<Jar>;
}) => {
  const [startDate, setStartDate] = useState(
    getDateInputInitialValue(FIVE_DAYS_AGO)
  );
  const [endDate, setEndDate] = useState(getDateInputInitialValue(TODAY));

  const growth = getAccountsMovements(
    jarsRecords,
    new Date(startDate),
    new Date(endDate)
  );

  const speed = getGatheringSpeed(
    jarsRecords,
    new Date(startDate),
    new Date(endDate)
  );

  return (
    <>
      <div className={styles['analytics-content']}>
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
        <h4>Динаміка по банкам</h4>
        <div className={styles.growth}>
          {growth.length
            ? growth.map((dataEntry) => (
                <GrowthRow key={dataEntry.jarId} jars={jars} {...dataEntry} />
              ))
            : NO_DATA_TEXT}
        </div>
      </div>
      <div className={styles['analytics-content']}>
        <h4>Середня швидкість</h4>
        <div className={styles['gathering-speed-list']}>
          {speed.length
            ? speed.map((dataEntry) => (
                <SpeedRow key={dataEntry.jarId} jars={jars} {...dataEntry} />
              ))
            : NO_DATA_TEXT}
        </div>
      </div>
    </>
  );
};

export const Statistics = () => {
  const { selectedJars, jars, transactions, expenseTypes, statistics, users } =
    useContext(JarsPageContext);

  const [activeTab, setActiveTab] = useState<'statistics' | 'transactions'>(
    'statistics'
  );

  const usedJars = selectedJars.length ? selectedJars : jars;

  const jarsRecords = statistics.filter((record) =>
    usedJars.some((jar) => jar.id === record.jarId)
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
            [styles.active]: activeTab === 'transactions',
          })}
          onClick={() => setActiveTab('transactions')}
        >
          Видатки
        </li>
      </ul>
      <div className={styles['statistics-wrapper']}>
        {activeTab === 'statistics' ? (
          <div className={classNames(styles.column, styles.statistics)}>
            <div className={styles['column-header']}>
              <ExportStatisticsDialog jars={jars} users={users} />
            </div>
            <div className={styles.chart}>
              <StatisticsSection jars={usedJars} />
            </div>
          </div>
        ) : null}
        {activeTab === 'transactions' ? (
          <div className={classNames(styles.column, styles.statistics)}>
            <div className={styles.chart}>
              <ExpensesSection
                transactions={transactions}
                expensesTypes={expenseTypes}
                jars={selectedJars}
              />
            </div>
          </div>
        ) : null}
        <div className={classNames(styles.column, styles.analytics)}>
          <Analytics jars={usedJars} jarsRecords={jarsRecords} />
        </div>
      </div>
    </div>
  );
};
