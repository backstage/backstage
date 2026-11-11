export const maxDescLength = 160;

// Keeps the original text in `fullDescription` so it can be shown as a tooltip.
export const truncateDescription = <T extends { description: string }>(
  itemData: T,
) =>
  itemData.description.length > maxDescLength
    ? {
        ...itemData,
        description: itemData.description.slice(0, maxDescLength) + '...',
        fullDescription: itemData.description,
      }
    : itemData;
