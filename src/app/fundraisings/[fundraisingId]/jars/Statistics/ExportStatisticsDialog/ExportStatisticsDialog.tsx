import { Fragment } from 'react';
import { Dialog, Button, useDialog } from '@/library';
import { CURATORS_COLORS, DEFAULT_JAR_GOAL } from '@/app/constants';
import { Jar, User } from '@/types';

import styles from './ExportStatisticsDialog.module.css';

const StatisticsRow = ({ jar }: { jar: Jar }) => {
  return (
    <>
      <td>
        <a href={jar.url}>{jar.ownerName}</a>
      </td>
      <td>{jar.isFinished ? 'Так' : 'Ні'}</td>
      <td>{jar.goal || DEFAULT_JAR_GOAL}</td>
      <td>{jar.debit}</td>
    </>
  );
};

export const ExportStatisticsDialog = ({
  jars,
  users,
}: {
  jars: Array<Jar>;
  users: Array<User>;
}) => {
  const { openDialog, dialogState } = useDialog();

  return (
    <Dialog
      title='Експорт даних'
      dialogState={dialogState}
      renderButton={() => <Button onClick={openDialog}>📑 Експорт</Button>}
      renderContent={() => {
        return (
          <div className={styles['export-dialog-content']}>
            <span>Просто скопіюй та вставь у нашу таблицю</span>
            <div className={styles['export-table']}>
              <table>
                <tbody>
                  {users.map(({ id: curatorId, name }) => {
                    const curated = jars.filter(
                      (jar) => jar.userId === curatorId
                    );

                    if (!curated.length) {
                      return null;
                    }

                    const [first, ...rest] = curated;

                    return (
                      <Fragment key={curatorId}>
                        <tr
                          style={{
                            backgroundColor: CURATORS_COLORS[curatorId],
                          }}
                        >
                          <td rowSpan={curated.length}>{name}</td>
                          <StatisticsRow jar={first} />
                        </tr>
                        {rest.map((jar) => {
                          return (
                            <tr
                              key={jar.id}
                              style={{
                                backgroundColor: CURATORS_COLORS[curatorId],
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
