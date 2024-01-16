import { Jar, JarStatisticRecord } from '../types';
import { groupBy } from '../utils';

const isSameDate = (startDate: Date, endDate: Date) => {
  const isSameDay = startDate.getDate() === endDate.getDate();
  const isSameMonth = startDate.getMonth() === endDate.getMonth();
  const isSameYear = startDate.getFullYear() === endDate.getFullYear();

  return isSameDay && isSameMonth && isSameYear;
};

const withSign = (value: number) => {
  return value > 0 ? `+${value}` : `${value}`;
};

export const getAccountsMovements = (
  jars: Array<Jar>,
  records: Array<JarStatisticRecord>,
  startDate: Date,
  endDate: Date
) => {
  const currentRecords = records.filter((record) => {
    const recordDate = new Date(record.created_at);
    const isInTimeWindow =
      isSameDate(recordDate, startDate) || isSameDate(recordDate, endDate);
    const forSelectedJar = Boolean(
      jars.find((jar) => jar.id === record.jar_id)
    );

    return isInTimeWindow && forSelectedJar;
  });

  const groupedByJar = groupBy(currentRecords, (record) => record.jar_id);

  const growth = Object.keys(groupedByJar)
    .filter((jarId) => groupedByJar[jarId].length > 1)
    .map((jarId) => {
      const [endDayData, startDayData] = groupedByJar[jarId];
      const difference = endDayData.accumulated - startDayData.accumulated;
      const percentageValue =
        difference > 0
          ? (100 * difference) / endDayData.accumulated
          : (100 * difference) / startDayData.accumulated;

      return {
        jarId,
        percentage: `${withSign(Math.round(percentageValue))}%`,
        difference,
        startDateAmount: startDayData.accumulated,
        endDateAmount: endDayData.accumulated,
      };
    });

  return growth;
};
