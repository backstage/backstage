export const maxDescLength = 160;

export const truncateDescription = <T extends { description: string }>(
  itemData: T,
) =>
  itemData.description.length > maxDescLength
    ? {
        ...itemData,
        description: itemData.description.slice(0, maxDescLength) + '...',
      }
    : itemData;
