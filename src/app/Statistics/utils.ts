import randomColor from 'randomcolor';

import type { Jar } from '@/app/types';

const STRIPES_COLOR = randomColor();

export const getProgressBarStyle = (
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
    width: percentageOfGoal,
    background: color,
  };
};
