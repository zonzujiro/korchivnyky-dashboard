'use client';

import React, { useState, useContext, Fragment } from 'react';
import classNames from 'classnames';

import type { Jar, JarStatisticRecord } from '../types';
import { Dialog } from '../Dialog/Dialog';
import { toCurrency } from '../utils';
import { AppContext } from '../dal';
import { CURATORS_COLORS, CURATORS_IDS, DEFAULT_JAR_GOAL } from '../constants';

import styles from './Statistics.module.css';
import { StatisticsSection } from './StatisticsSection/StatisticsSection';
import { getAccountsMovements } from './gatherAnalytics';

const FIVE_DAYS_AGO = new Date();
FIVE_DAYS_AGO.setDate(FIVE_DAYS_AGO.getDate() - 5);

const StatisticsRow = ({ jar }: { jar: Jar }) => (
  <>
    <td>
      <a href={jar.url}>{jar.owner_name}</a>
    </td>
    <td>{jar.is_finished ? 'Так' : 'Ні'}</td>
    <td>{jar.goal || DEFAULT_JAR_GOAL}</td>
    <td>{jar.accumulated}</td>
  </>
);

const ExportStatistics = ({ jars }: { jars: Array<Jar> }) => {
  return (
    <Dialog
      renderButton={({ openDialog }) => (
        <span className={styles['export-button']} onClick={openDialog}>
          📑 Експорт
        </span>
      )}
      renderContent={({ closeDialog }) => {
        return (
          <div className={styles['export-dialog-content']}>
            <table>
              <tbody>
                {Object.values(CURATORS_IDS).map((curatorId) => {
                  const curator = jars.find((jar) => jar.id === curatorId)!;
                  const curated = jars.filter(
                    (jar) => jar.parent_jar_id === curatorId
                  );

                  if (!curated.length) {
                    return (
                      <tr
                        key={curator.id}
                        style={{ backgroundColor: CURATORS_COLORS[curator.id] }}
                      >
                        <td>{curator.owner_name}</td>
                        <StatisticsRow jar={curator} />
                      </tr>
                    );
                  }

                  const [first, ...rest] = curated;

                  return (
                    <Fragment key={curator.id}>
                      <tr
                        style={{ backgroundColor: CURATORS_COLORS[curator.id] }}
                      >
                        <td rowSpan={curated.length}>{curator.owner_name}</td>
                        <StatisticsRow jar={first} />
                      </tr>
                      {rest.map((jar) => {
                        return (
                          <tr
                            key={jar.id}
                            style={{
                              backgroundColor: CURATORS_COLORS[curator.id],
                            }}
                          >
                            <StatisticsRow jar={jar} />
                          </tr>
                        );
                      })}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
            <button onClick={closeDialog}>Close</button>
          </div>
        );
      }}
    />
  );
};

export const Statistics = ({
  statistics,
}: {
  statistics: Array<JarStatisticRecord>;
}) => {
  const { selectedJars, jars } = useContext(AppContext);

  const [startDate, setStartDate] = useState('2024-01-05');
  const [endDate, setEndDate] = useState('2024-01-12');

  const usedJars = selectedJars.length ? selectedJars : jars;

  const filteredStatistics = selectedJars.length
    ? statistics.filter((record) => {
        return selectedJars.find(
          (selectedJar) => selectedJar.id === record.jar_id
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

  return (
    <div className={styles['statistics-wrapper']}>
      <div className={classNames(styles.column, styles.statistics)}>
        <div className={styles['column-header']}>
          Поточний стан <ExportStatistics jars={jars} />
        </div>
        <div className={styles.chart}>
          <StatisticsSection jars={usedJars} />
        </div>
      </div>
      <div className={classNames(styles.column, styles.analytics)}>
        <div className={styles['column-header']}>
          <div className={styles['date-inputs-wrapper']}>
            <span className={styles['inputs-title-prefix']}>
              Динаміка за період:
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
          <div className={styles.growth}>
            {growth.map(
              ({
                jarId,
                startDateAmount,
                endDateAmount,
                percentage,
                difference,
              }) => {
                const jar = jars.find((jar) => jar.id === Number(jarId));

                return (
                  <div key={jarId} className={styles['grid-row']}>
                    <span className={styles.cell}>{jar?.owner_name}</span>
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
                      {toCurrency(startDateAmount)} →{' '}
                      {toCurrency(endDateAmount)}
                    </span>
                  </div>
                );
              }
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
