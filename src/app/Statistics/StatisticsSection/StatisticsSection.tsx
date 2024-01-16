import { Tooltip } from 'react-tooltip';
import randomColor from 'randomcolor';

import type { Jar } from '@/app/types';
import { toCurrency } from '@/app/utils';
import { DEFAULT_JAR_GOAL } from '@/app/constants';

//TODO: make local CSS files
import parentStyles from '../Statistics.module.css';

const STRIPES_COLOR = randomColor();

const getProgressBarStyle = (
  jar: Jar,
  percentageOfGoal: string
): React.CSSProperties => {
  let { goal, color } = jar;

  if (goal === null) {
    color = `repeating-linear-gradient(
          45deg,
          ${color},
          ${color} 10px,
          ${STRIPES_COLOR} 10px,
          ${STRIPES_COLOR} 20px
        )`;
  }

  return {
    width: parseInt(percentageOfGoal) ? percentageOfGoal : `1%`,
    background: color,
  };
};

export const StatisticsSection = ({
  date,
  jars,
}: {
  date?: string;
  jars: Array<Jar>;
}) => {
  return (
    <div className={parentStyles['statistics-section-wrapper']}>
      {date && (
        <span className={parentStyles['statistics-item-date']}>
          {date.split('-').toReversed().join('/')}
        </span>
      )}
      <div className={parentStyles['statistics-section']}>
        {jars.map((jar, index) => {
          const percentageOfGoal = `${Math.round(
            (100 * jar.accumulated) / (jar.goal || DEFAULT_JAR_GOAL)
          )}%`;

          return (
            <div key={index} className={parentStyles['statistics-item']}>
              <div className={parentStyles['statistics-bar-wrapper']}>
                <div
                  id={`statistics-bar-${index}`}
                  className={parentStyles['statistics-bar']}
                  style={getProgressBarStyle(jar, percentageOfGoal)}
                />
                <span>{percentageOfGoal}</span>
              </div>
              <div className={parentStyles['jar-owner']}>{jar.owner_name}</div>
              <Tooltip anchorSelect={`#statistics-bar-${index}`}>
                <p>
                  <strong>Зібрано:</strong> {toCurrency(jar.accumulated)}
                </p>
                {jar.goal && (
                  <p>
                    <strong>Мета:</strong> {toCurrency(jar.goal)}
                  </p>
                )}
              </Tooltip>
            </div>
          );
        })}
      </div>
    </div>
  );
};
