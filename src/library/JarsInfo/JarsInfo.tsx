import classNames from 'classnames';

import type { Jar } from '@/types';
import { getGatheredMoney, toCurrency, uniqueBy } from '@/toolbox';

import styles from './JarsInfo.module.css';

const getFinishedJars = (jars: Array<Jar>) =>
  jars.filter((jar) => jar.isFinished);

const getAchievedGoalJars = (jars: Array<Jar>) =>
  jars.filter(
    (jar) =>
      jar.goal && jar.accumulated + jar.otherSourcesAccumulated >= jar.goal
  );

const getCollectiveGoal = (jars: Array<Jar>) => {
  return jars.reduce((acc, jar) => acc + Number(jar.goal), 0);
};

type JarsInfoProps = {
  jars: Array<Jar>;
};

export const JarsInfo = ({ jars }: JarsInfoProps) => {
  const finishedJars = getFinishedJars(jars);
  const achievedGoals = getAchievedGoalJars(jars);
  const collectiveGoal = getCollectiveGoal(jars);

  return (
    <div className={styles['jars-info']}>
      <h4>Інформація по надходженнях</h4>
      <div className={styles['jars-info-tag']}>
        💰 Запланована мета:{' '}
        <span className={styles['jars-info-tag-value']}>
          {toCurrency(collectiveGoal)}
        </span>
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
            getGatheredMoney(
              uniqueBy([...finishedJars, ...achievedGoals], (jar) => jar.id)
            )
          )}
        </span>
      </div>
      <h4 className={styles['invoice-info-header']}>Банки</h4>
      <div
        className={classNames(styles['jars-info-tag'], styles['total-jars'])}
      >
        🫙 Усього банок: {jars.length}
      </div>
      <div className={styles['jars-info-tag']}>
        🎯 Досягнули мети: {achievedGoals.length}
      </div>
      <div className={styles['jars-info-tag']}>
        🏁 Закрили збір: {finishedJars.length}
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
