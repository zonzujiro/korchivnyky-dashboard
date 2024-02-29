import type { JarStatisticRecord } from '@/types';
import { groupBy } from '@/toolbox';

const getDateWithoutMs = (target: Date) => {
  const day = target.getDate();
  const month = target.getMonth();
  const year = target.getFullYear();

  return new Date(year, month, day);
};

const isSameDate = (startDate: Date, endDate: Date) => {
  const isSameDay = startDate.getDate() === endDate.getDate();
  const isSameMonth = startDate.getMonth() === endDate.getMonth();
  const isSameYear = startDate.getFullYear() === endDate.getFullYear();

  return isSameDay && isSameMonth && isSameYear;
};

const isInRange = (target: Date, start: Date, end: Date) => {
  const cleanedTarget = getDateWithoutMs(target);
  const cleanedStart = getDateWithoutMs(start);
  const cleanedEnd = getDateWithoutMs(end);

  return (
    cleanedTarget.valueOf() <= cleanedEnd.valueOf() &&
    cleanedTarget.valueOf() >= cleanedStart.valueOf()
  );
};

const withSign = (value: number) => {
  return value > 0 ? `+${value}` : `${value}`;
};

const getOnExactDate = (
  records: Array<JarStatisticRecord>,
  targetDate: Date
) => {
  const result = records.filter((record) => {
    const recordDate = new Date(record.createdAt);

    return isSameDate(recordDate, targetDate);
  });

  return result.at(-1) || null;
};

const getFirstRecord = (
  records: Array<JarStatisticRecord>,
  startDate: Date
): JarStatisticRecord | null => {
  const exactDate = getOnExactDate(records, startDate);

  if (exactDate) {
    return exactDate;
  }

  const recordsBeforeStartDate = records.filter((record) => {
    const recordDate = new Date(record.createdAt);

    return recordDate.valueOf() <= startDate.valueOf();
  });

  if (recordsBeforeStartDate.length) {
    return recordsBeforeStartDate[0];
  }

  return null;
};

const getLastRecord = (
  records: Array<JarStatisticRecord>,
  startDate: Date,
  endDate: Date
) => {
  const exactDate = getOnExactDate(records, endDate);

  if (exactDate) {
    return exactDate;
  }

  const recordsBeforeStartDate = records.filter((record) => {
    const recordDate = new Date(record.createdAt);

    return isInRange(recordDate, startDate, endDate);
  });

  if (recordsBeforeStartDate.length) {
    return recordsBeforeStartDate.at(-1);
  }

  // No records since startDate - we will use startDate
  return null;
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
