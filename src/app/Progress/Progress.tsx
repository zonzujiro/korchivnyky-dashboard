import styles from './Progress.module.css';

type ProgressProps = {
  currentSum: number;
  goal: number;
};

export const Progress = ({ goal, currentSum }: ProgressProps) => {
  const percentage = `${Math.round((100 * currentSum) / goal)}%`;

  return (
    <div className={styles.progress}>
      <h3>Мета: {goal}₴</h3>
      <h3>
        Зібрано {percentage}: {currentSum}₴
      </h3>
      <div className={styles['progress-bar']}>
        <div
          className={styles['current-progress']}
          style={{ width: percentage }}
        ></div>
      </div>
    </div>
  );
};
