export const alignItems = ['stretch', 'flex-start', 'center', 'flex-end'];

export const breakpoints = {
  xs: {},
  sm: { '@media': 'screen and (min-width: 640px)' },
  md: { '@media': 'screen and (min-width: 768px)' },
  lg: { '@media': 'screen and (min-width: 1024px)' },
  xl: { '@media': 'screen and (min-width: 1280px)' },
  '2xl': { '@media': 'screen and (min-width: 1536px)' },
};

export const borderRadius = {
  none: 0,
  small: '4px',
  medium: '8px',
  full: '9999px',
};

export const backgroundColors = {
  background: 'var(--canon-color-background)',
  elevation1: 'var(--canon-color-elevation1)',
  elevation2: 'var(--canon-color-elevation2)',
  transparent: 'transparent',
};

export const border = {
  none: 'none',
  thin: '1px solid var(--canon-outline)',
  error: '1px solid var(--canon-error)',
};

export const boxShadows = {
  small: 'var(--canon-box-shadow-small)',
  medium: 'var(--canon-box-shadow-medium)',
  large: 'var(--canon-box-shadow-large)',
};

export const colors = {
  background: '#eff6ff',
};

export const display = ['none', 'flex', 'block', 'inline'];

export const flexDirection = ['row', 'column'] as const;

export const justifyContent = [
  'stretch',
  'flex-start',
  'center',
  'flex-end',
  'space-around',
  'space-between',
];

export const space = {
  none: 0,
  xxs: 'var(--space-xxs)',
  xs: 'var(--space-xs)',
  sm: 'var(--space-sm)',
  md: 'var(--space-md)',
  lg: 'var(--space-lg)',
  xl: 'var(--space-xl)',
  xxl: 'var(--space-xxl)',
};
