import { DateTime } from 'luxon';

export const newDaysLimit = 100;

export const calcIsNewPlugin = <
  T extends { addedDate: string; isNew: boolean },
>(
  itemData: T,
) => {
  const addedDate = DateTime.fromISO(itemData.addedDate);
  const daysOld = Math.abs(addedDate.diffNow('days').days);
  const isNew = !isNaN(daysOld) && daysOld < newDaysLimit;

  return {
    ...itemData,
    isNew,
  };
};
