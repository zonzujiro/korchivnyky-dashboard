import type { JarStatisticRecord } from '@/app/types';
import { groupBy } from '@/app/toolbox';

const isSameDate = (startDate: Date, endDate: Date) => {
  const isSameDay = startDate.getDate() === endDate.getDate();
  const isSameMonth = startDate.getMonth() === endDate.getMonth();
  const isSameYear = startDate.getFullYear() === endDate.getFullYear();

  return isSameDay && isSameMonth && isSameYear;
};

const withSign = (value: number) => {
  return value > 0 ? `+${value}` : `${value}`;
};

const getFirstRecord = (
  records: Array<JarStatisticRecord>,
  startDate: Date
): JarStatisticRecord | null => {
  const result = records.filter((record) => {
    const recordDate = new Date(record.createdAt);
    const isInTimeWindow = isSameDate(recordDate, startDate);

    return isInTimeWindow;
  });

  if (!result.length) {
    const recordsBeforeStartDate = records.filter((record) => {
      const recordDate = new Date(record.createdAt);

      return recordDate.valueOf() <= startDate.valueOf();
    });

    if (recordsBeforeStartDate.at(-1) !== undefined) {
      return recordsBeforeStartDate.at(-1) as JarStatisticRecord;
    }

    return null;
  }

  return result.at(-1) as JarStatisticRecord;
};

const getLastRecord = (
  records: Array<JarStatisticRecord>,
  startDate: Date,
  endDate: Date
) => {
  const startMs = startDate.valueOf();
  const endMs = endDate.valueOf();

  const result = records.filter((record) => {
    const recordDate = new Date(record.createdAt);
    const isInTimeWindow = isSameDate(recordDate, endDate);

    return isInTimeWindow;
  });

  if (!result.length) {
    const recordsBeforeStartDate = records.filter((record) => {
      const recordDate = new Date(record.createdAt);

      return recordDate.valueOf() <= endMs && recordDate.valueOf() >= startMs;
    });

    if (recordsBeforeStartDate.length) {
      return recordsBeforeStartDate.at(-1);
    }

    // No records since startDate - we will use startDate
    return null;
  }

  return result.at(-1);
};

const getAccumulated = (
  jarRecords: Array<JarStatisticRecord>,
  startDate: Date,
  endDate: Date
) => {
  const firstRecord = getFirstRecord(jarRecords, startDate);
  const lastRecord =
    getLastRecord(jarRecords, startDate, endDate) || firstRecord;

  const firstAccumulated = firstRecord?.accumulated || 0;
  const lastAccumulated = lastRecord?.accumulated || 0;
  const difference = lastAccumulated - firstAccumulated;

  return {
    firstAccumulated,
    lastAccumulated,
    difference,
  };
};

export const getAccountsMovements = (
  records: Array<JarStatisticRecord>,
  startDate: Date,
  endDate: Date
) => {
  const groupedByJar = groupBy(records, (record) => record.jarId);

  const growth = Object.entries(groupedByJar).map(([jarId, jarRecords]) => {
    const { firstAccumulated, lastAccumulated, difference } = getAccumulated(
      jarRecords,
      startDate,
      endDate
    );

    let percentageValue = 0;

    if (difference > 0) {
      percentageValue = (100 * difference) / lastAccumulated;
    }

    if (difference < 0) {
      percentageValue = (100 * difference) / firstAccumulated;
    }

    return {
      jarId,
      percentage: `${withSign(Math.round(percentageValue))}%`,
      difference,
      startDateAmount: firstAccumulated,
      endDateAmount: lastAccumulated,
    };
  });

  return growth.filter((growth) => growth.difference !== 0);
};

const getDateDifference = (startDate: Date, endDate: Date) => {
  const diffTime = Math.abs(endDate.valueOf() - startDate.valueOf());
  const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));

  return diffHours;
};

export const getGatheringSpeed = (
  records: Array<JarStatisticRecord>,
  startDate: Date,
  endDate: Date
) => {
  const groupedByJar = groupBy(records, (record) => record.jarId);

  const differences = Object.entries(groupedByJar).map(
    ([jarId, jarRecords]) => {
      const { difference } = getAccumulated(jarRecords, startDate, endDate);

      return { jarId, difference };
    }
  );

  const speed = differences
    .filter((record) => record.difference !== 0)
    .map(({ jarId, difference }) => {
      const hours = getDateDifference(startDate, endDate);

      return { jarId, speed: `${Math.round(difference / hours)} грн/год` };
    });

  return speed;
};
