import { Jar, JarStatisticRecord } from '../types';
import { groupBy } from '../utils';

const isSameDate = (startDate: Date, endDate: Date) => {
  const isSameDay = startDate.getDate() === endDate.getDate();
  const isSameMonth = startDate.getMonth() === endDate.getMonth();
  const isSameYear = startDate.getFullYear() === endDate.getFullYear();

  return isSameDay && isSameMonth && isSameYear;
};

const useAccumulatedData = (
  statistics: Array<JarStatisticRecord>,
  jarIds: Array<number>
) => {
  const fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
  const fiveDaysAgoInMs = fiveDaysAgo.valueOf();

  const freshData = statistics.filter((entry) => {
    return new Date(entry.created_at).valueOf() > fiveDaysAgoInMs;
  });

  return jarIds
    .map((id) => freshData.find(({ jar_id }) => jar_id === id))
    .filter(Boolean) as Array<JarStatisticRecord>;
};

export const gatherGrowthAnalytics = (
  jars: Array<Jar>,
  records: Array<JarStatisticRecord>,
  startDate: Date,
  endDate: Date
) => {
  const currentRecords = records.filter((record) => {
    const recordDate = new Date(record.created_at);
    return isSameDate(recordDate, startDate) || isSameDate(recordDate, endDate);
  });

  const groupedByJar: Record<string, [JarStatisticRecord, JarStatisticRecord]> =
    groupBy(currentRecords, (record) => record.jar_id);

  console.log({ groupedByJar });

  const growth = Object.keys(groupedByJar)
    .filter((jarId) => groupedByJar[jarId].length === 2)
    .map((jarId) => {
      const [endDayData, startDayData] = groupedByJar[jarId];
      const difference = endDayData.accumulated - startDayData.accumulated;

      return {
        jarId,
        percentage: `${Math.round(
          (100 * difference) / endDayData.accumulated
        )}%`,
        amount: difference,
      };
    });

  console.log({ growth });

  return growth;
};
