import { Fragment } from 'react';
import { Dialog, Button, useDialog } from '@/library';
import { Jar, User } from '@/types';

import styles from './ExportStatisticsDialog.module.css';

const CURATORS_IDS = {
  babenko: 8,
  voloshenko: 9,
  petrynyak: 4,
  tytarenko: 7,
  makogon: 6,
  gryshenko: 10,
};

const CURATORS_COLORS = {
  [CURATORS_IDS.voloshenko]: '#C9DAF8',
  [CURATORS_IDS.petrynyak]: '#D9D2E9',
  [CURATORS_IDS.babenko]: '#FFF2CC',
  [CURATORS_IDS.gryshenko]: '#FF85DC',
  [CURATORS_IDS.tytarenko]: '#B6D7A8',
  [CURATORS_IDS.makogon]: '#D5A6BD',
};

const StatisticsRow = ({ jar }: { jar: Jar }) => {
  return (
    <>
      <td>
        <a href={jar.url}>{jar.ownerName}</a>
      </td>
      <td>{jar.isFinished ? 'Так' : 'Ні'}</td>
      <td>{jar.goal || 30000}</td>
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
