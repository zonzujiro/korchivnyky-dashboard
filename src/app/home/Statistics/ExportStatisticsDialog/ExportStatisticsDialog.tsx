import { Fragment } from 'react';
import { Dialog } from '@/app/library/Dialog/Dialog';
import {
  CURATORS_COLORS,
  CURATORS_IDS,
  DEFAULT_JAR_GOAL,
} from '@/app/constants';
import { Jar } from '@/app/types';

import styles from './ExportStatisticsDialog.module.css';
import { Button } from '@/app/library';

const StatisticsRow = ({ jar }: { jar: Jar }) => (
  <>
    <td>
      <a href={jar.url}>{jar.ownerName}</a>
    </td>
    <td>{jar.isFinished ? 'Так' : 'Ні'}</td>
    <td>{jar.goal || DEFAULT_JAR_GOAL}</td>
    <td>{jar.accumulated}</td>
  </>
);

export const ExportStatisticsDialog = ({ jars }: { jars: Array<Jar> }) => {
  return (
    <Dialog
      title='Експорт даних'
      renderButton={({ openDialog }) => (
        <Button onClick={openDialog}>📑 Експорт</Button>
      )}
      renderContent={() => {
        return (
          <div className={styles['export-dialog-content']}>
            <span>Просто скопіюй та вставь у нашу таблицю</span>
            <div className={styles['export-table']}>
              <table>
                <tbody>
                  {Object.values(CURATORS_IDS).map((curatorId) => {
                    const curator = jars.find((jar) => jar.id === curatorId)!;
                    const curated = jars.filter(
                      (jar) => jar.parentJarId === curatorId
                    );

                    if (!curated.length) {
                      return (
                        <tr
                          key={curator.id}
                          style={{
                            backgroundColor: CURATORS_COLORS[curator.id],
                          }}
                        >
                          <td>{curator.ownerName}</td>
                          <StatisticsRow jar={curator} />
                        </tr>
                      );
                    }

                    const [first, ...rest] = curated;

                    return (
                      <Fragment key={curator.id}>
                        <tr
                          style={{
                            backgroundColor: CURATORS_COLORS[curator.id],
                          }}
                        >
                          <td rowSpan={curated.length}>{curator.ownerName}</td>
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
            </div>
          </div>
        );
      }}
    />
  );
};
