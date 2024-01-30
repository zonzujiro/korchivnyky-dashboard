import { Jar, JarStatisticRecord } from '../types';
import { groupBy } from '../utils';

const isSameDate = (startDate: Date, endDate: Date) => {
  const isSameDay = startDate.getDate() === endDate.getDate();
  const isSameMonth = startDate.getMonth() === endDate.getMonth();
  const isSameYear = startDate.getFullYear() === endDate.getFullYear();

  return isSameDay && isSameMonth && isSameYear;
};

const getDateDifference = (startDate: Date, endDate: Date) => {
  const diffTime = Math.abs(endDate.valueOf() - startDate.valueOf());
  const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));

  return diffHours;
};

const withSign = (value: number) => {
  return value > 0 ? `+${value}` : `${value}`;
};

const getCurrentRecords = (
  jars: Array<Jar>,
  records: Array<JarStatisticRecord>,
  startDate: Date,
  endDate: Date
) => {
  return records.filter((record) => {
    const recordDate = new Date(record.created_at);
    const isInTimeWindow =
      isSameDate(recordDate, startDate) || isSameDate(recordDate, endDate);
    const forSelectedJar = Boolean(
      jars.find((jar) => jar.id === record.jar_id)
    );

    return isInTimeWindow && forSelectedJar;
  });
};

export const getAccountsMovements = (
  jars: Array<Jar>,
  records: Array<JarStatisticRecord>,
  startDate: Date,
  endDate: Date
) => {
  const currentRecords = getCurrentRecords(jars, records, startDate, endDate);
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

export const getGatheringSpeed = (
  jars: Array<Jar>,
  records: Array<JarStatisticRecord>,
  startDate: Date,
  endDate: Date
) => {
  const currentRecords = getCurrentRecords(jars, records, startDate, endDate);
  const groupedByJar = groupBy(currentRecords, (record) => record.jar_id);

  const speed = Object.keys(groupedByJar)
    .filter((jarId) => groupedByJar[jarId].length > 1)
    .map((jarId) => {
      const [endDayData, startDayData] = groupedByJar[jarId];
      const difference = endDayData.accumulated - startDayData.accumulated;
      const hours = getDateDifference(startDate, endDate);

      return { jarId, speed: `${Math.round(difference / hours)} грн/год` };
    });

  return speed;
};
