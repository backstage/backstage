export const spacePropsList = [
  'margin',
  'marginBottom',
  'marginLeft',
  'marginRight',
  'marginTop',
  'marginX',
  'marginY',
  'padding',
  'paddingBottom',
  'paddingLeft',
  'paddingRight',
  'paddingTop',
  'paddingX',
  'paddingY',
].reduce(
  (acc: { [key: string]: { type: string[]; responsive: boolean } }, prop) => {
    acc[prop] = {
      type: ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'],
      responsive: true,
    };
    return acc;
  },
  {},
);
