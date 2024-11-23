import {
  responsiveProperties,
  colorProperties,
} from '../components/box/sprinkles.css';

export const listResponsiveValues = (
  value: keyof typeof responsiveProperties.styles,
) => {
  const values = responsiveProperties.styles[value];

  if ('values' in values) {
    return Object.keys(values.values);
  }

  return [];
};

export const listColorValues = (value: keyof typeof colorProperties.styles) => {
  const values = colorProperties.styles[value];

  if ('values' in values) {
    return Object.keys(values.values);
  }

  return [];
};
