import { recipe } from '@vanilla-extract/recipes';
import { createTheme } from '@vanilla-extract/css';

export const [themeClass, vars] = createTheme({
  color: {
    text: 'blue',
    background: 'blue',
  },
  font: {
    body: 'arial',
  },
});

export const button = recipe({
  base: {
    all: 'unset',
    userSelect: 'none',
    fontFamily: 'var(--font-regular)',
    fontWeight: 600,
    fontSize: '0.875rem',
    lineHeight: '1.5',
    padding: 0,
    transition: 'all 150ms ease',
    cursor: 'pointer',
  },
  variants: {
    variant: {
      primary: {
        backgroundColor: 'var(--button-primary-background-color)',
        color: 'var(--button-primary-text-color)',
        borderRadius: 'var(--button-primary-border-radius)',
        border: '1px solid var(--button-primary-border-color)',
        '&:hover': {
          backgroundColor: 'var(--button-primary-background-color-hover)',
          borderColor: 'var(--button-primary-border-color-hover)',
        },
      },
      secondary: {
        backgroundColor: 'transparent',
        color: 'var(--button-secondary-text-color)',
        borderRadius: 'var(--button-secondary-border-radius)',
        border: '1px solid var(--button-secondary-border-color)',
        '&:hover': {
          backgroundColor: 'var(--button-secondary-background-color-hover)',
          borderColor: 'var(--button-secondary-border-color-hover)',
        },
      },
    },
    size: {
      small: {
        paddingLeft: '16px',
        paddingRight: '16px',
        height: 'var(--button-size-small)',
      },
      medium: {
        paddingLeft: '32px',
        paddingRight: '32px',
        height: 'var(--button-size-medium)',
      },
    },
    disabled: {
      true: {
        opacity: 0.3,
        cursor: 'not-allowed',
      },
    },
  },
});
