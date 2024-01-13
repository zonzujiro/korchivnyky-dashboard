import randomColor from 'randomcolor';
import { toCurrency } from '../utils';
import styles from './Progress.module.css';

type ProgressProps = {
  currentSum: number;
  goal: number;
};

const progressColor = randomColor();

export const Progress = ({ goal, currentSum }: ProgressProps) => {
  const percentage = `${Math.round((100 * currentSum) / goal)}%`;

  return (
    <div className={styles.progress}>
      <h3>Мета: {toCurrency(goal)}</h3>
      <h3>Зібрано: {toCurrency(currentSum)}</h3>
      <div className={styles['progress-bar-wrapper']}>
        <div className={styles['progress-bar']}>
          <div
            className={styles['current-progress']}
            style={{ width: percentage, backgroundColor: progressColor }}
          />
        </div>
        <span>{percentage}</span>
      </div>
    </div>
  );
};
