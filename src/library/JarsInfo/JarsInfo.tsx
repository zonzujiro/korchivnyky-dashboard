import classNames from 'classnames';

import type { Jar, JarStatisticRecord } from '@/types';

import styles from './JarsInfo.module.css';
import {
  getDateString,
  getGatheredMoney,
  getTimeString,
  toCurrency,
} from '@/toolbox';

export const getFinishedJars = (jars: Array<Jar>) =>
  jars.filter((jar) => jar.isFinished);

export const getAchievedGoalJars = (jars: Array<Jar>) =>
  jars.filter(
    (jar) =>
      jar.goal && jar.accumulated + jar.otherSourcesAccumulated > jar.goal
  );

type JarsInfoProps = {
  jars: Array<Jar>;
  newestRecord?: JarStatisticRecord;
};

export const JarsInfo = ({ jars, newestRecord }: JarsInfoProps) => {
  const finishedJars = getFinishedJars(jars);
  const achievedGoals = getAchievedGoalJars(jars);

  return (
    <div className={styles['jars-info']}>
      <h4>Загальна інформація</h4>
      {newestRecord ? (
        <small title='Оновлення раз на 12 годин' className={styles.timestamp}>
          Станом на: {getTimeString(newestRecord.createdAt)}{' '}
          {getDateString(newestRecord.createdAt)}
        </small>
      ) : null}
      <div
        className={classNames(styles['jars-info-tag'], styles['total-jars'])}
      >
        🫙 Усього банок: {jars.length}
      </div>
      <div
        className={classNames(
          styles['jars-info-tag'],
          styles['gathered-money']
        )}
      >
        💸 Доступно для витрат:{' '}
        <span className={styles['jars-info-tag-value']}>
          {toCurrency(getGatheredMoney([...finishedJars, ...achievedGoals]))}
        </span>
      </div>
      <div className={styles['jars-info-tag']}>
        🎯 Досягнули мети: {achievedGoals.length}
      </div>
      <div className={styles['jars-info-tag']}>
        🔒 Закрили збір: {finishedJars.length}
      </div>
    </div>
  );
};

export const SelectedJarsInfo = ({
  selectedJars,
}: {
  selectedJars: Array<Jar>;
}) => {
  return (
    <div className={styles['jars-info']}>
      <h4>Інформація по обраним</h4>
      <div
        className={classNames(styles['jars-info-tag'], styles['total-jars'])}
      >
        🫙 Обрано: {selectedJars.length}
      </div>
      <div className={styles['jars-info-tag']}>
        🏦 Зібрано: {toCurrency(getGatheredMoney(selectedJars))}
      </div>
      <div
        className={classNames(
          styles['jars-info-tag'],
          styles['gathered-money']
        )}
      >
        💸 Доступно для витрат:{' '}
        <span className={styles['jars-info-tag-value']}>
          {toCurrency(
            getGatheredMoney([
              ...getFinishedJars(selectedJars),
              ...getAchievedGoalJars(selectedJars),
            ])
          )}
        </span>
      </div>
    </div>
  );
};
