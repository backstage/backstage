import { createMuiTheme } from '@material-ui/core/styles';

export const colors = {
  PAGE_BACKGROUND: '#f8f8f8',
  ERROR_BACKGROUND_COLOR: '#FFEBEE',
  ERROR_TEXT_COLOR: '#e22134',
  INFO_TEXT_COLOR: '#004e8a',
  INFO_BACKGROUND_COLOR: '#ebf5ff',
  WARNING_TEXT_COLOR: '#ff5722',
  WARNING_BACKGROUND_COLOR: '#fff4eb',
  LINK_TEXT: '#2e77d0',
  LINK_TEXT_HOVER: '#2196F3',
  COMPONENT_TYPES: {
    SERVICE: '#39732E',
  },
  SUBTLE_TEXT_COLOR: '#616161',
  VERY_SUBTLE_TEXT_COLOR: '#d9d9d9',
  NAMED: {
    WHITE: '#ffffff',
    BLACK: '#000000',
  },
  STATUS: {
    OK: '#1db954',
    WARNING: '#ff9800',
    ERROR: '#e22134',
  },
};

export const muiTheme = createMuiTheme({});
