import { createMuiTheme } from '@material-ui/core';
import { darken, lighten } from '@material-ui/core/styles/colorManipulator';
import { blue, yellow } from '@material-ui/core/colors';

export const COLORS = {
  PAGE_BACKGROUND: '#F8F8F8',
  DEFAULT_PAGE_THEME_COLOR: '#7C3699',
  DEFAULT_PAGE_THEME_LIGHT_COLOR: '#ECDBF2',
  ERROR_BACKGROUND_COLOR: '#FFEBEE',
  ERROR_TEXT_COLOR: '#CA001B',
  INFO_TEXT_COLOR: '#004e8a',
  LINK_TEXT: '#0A6EBE',
  LINK_TEXT_HOVER: '#2196F3',
  NAMED: {
    WHITE: '#FEFEFE',
  },
  STATUS: {
    OK: '#1db855',
    WARNING: '#f49b20',
    ERROR: '#CA001B',
  },
};

const extendedThemeConfig = {
  props: {
    MuiGrid: {
      spacing: 2,
    },
    MuiSwitch: {
      color: 'primary',
    },
  },
  palette: {
    background: {
      default: COLORS.PAGE_BACKGROUND,
      informational: '#60a3cb',
    },
    status: {
      ok: COLORS.STATUS.OK,
      warning: COLORS.STATUS.WARNING,
      error: COLORS.STATUS.ERROR,
      running: '#BEBEBE',
      pending: '#5BC0DE',
      background: COLORS.NAMED.WHITE,
    },
    bursts: {
      fontColor: COLORS.NAMED.WHITE,
      slackChannelText: '#ddd',
      backgroundColor: {
        default: COLORS.DEFAULT_PAGE_THEME_COLOR,
      },
    },
    primary: {
      main: blue[500],
    },
    border: '#E6E6E6',
    textVerySubtle: '#DDD',
    textSubtle: '#6E6E6E',
    highlight: '#FFFBCC',
    errorBackground: COLORS.ERROR_BACKGROUND_COLOR,
    warningBackground: '#F59B23',
    infoBackground: '#ebf5ff',
    errorText: COLORS.ERROR_TEXT_COLOR,
    infoText: COLORS.INFO_TEXT_COLOR,
    warningText: COLORS.NAMED.WHITE,
    linkHover: COLORS.LINK_TEXT_HOVER,
    link: COLORS.LINK_TEXT,
    gold: yellow.A700,
  },
  navigation: {
    width: 220,
    background: '#333333',
  },
  typography: {
    fontFamily: '"Helvetica Neue", Helvetica, Roboto, Arial, sans-serif',
    h5: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 700,
      fontSize: 28,
      marginBottom: 6,
    },
    h3: {
      fontSize: 32,
      fontWeight: 700,
      marginBottom: 6,
    },
    h2: {
      fontSize: 40,
      fontWeight: 700,
      marginBottom: 8,
    },
    h1: {
      fontSize: 54,
      fontWeight: 700,
      marginBottom: 10,
    },
  },
};

const createOverrides = theme => {
  return {
    MuiTableRow: {
      // Alternating row backgrounds
      root: {
        '&:nth-of-type(odd)': {
          backgroundColor: theme.palette.background.default,
        },
      },
      // Use pointer for hoverable rows
      hover: {
        '&:hover': {
          cursor: 'pointer',
        },
      },
      // Alternating head backgrounds
      head: {
        '&:nth-of-type(odd)': {
          backgroundColor: COLORS.NAMED.WHITE,
        },
      },
    },
    // Tables are more dense than default mui tables
    MuiTableCell: {
      root: {
        wordBreak: 'break-word',
        overflow: 'hidden',
        verticalAlign: 'middle',
        lineHeight: '1',
        margin: 0,
        padding: '8px',
        borderBottom: 0,
      },
      head: {
        wordBreak: 'break-word',
        overflow: 'hidden',
        color: 'rgb(179, 179, 179)',
        fontWeight: 'normal',
        lineHeight: '1',
      },
    },
    MuiTabs: {
      // Tabs are smaller than default mui tab rows
      root: {
        minHeight: 24,
      },
    },
    MuiTab: {
      // Tabs are smaller and have a hover background
      root: {
        color: theme.palette.link,
        minHeight: 24,
        textTransform: 'initial',
        '&:hover': {
          color: darken(theme.palette.link, 0.3),
          background: lighten(theme.palette.link, 0.95),
        },
        [theme.breakpoints.up('md')]: {
          minWidth: 120,
          fontSize: theme.typography.pxToRem(14),
          fontWeight: 500,
        },
      },
      textColorPrimary: {
        color: theme.palette.link,
      },
    },
    MuiTableSortLabel: {
      // No color change on hover, just rely on the arrow showing up instead.
      root: {
        color: 'inherit',
        '&:hover': {
          color: 'inherit',
        },
        '&:focus': {
          color: 'inherit',
        },
      },
      // Bold font for highlighting selected column
      active: {
        fontWeight: 'bold',
        color: 'inherit',
      },
    },
    MuiListItemText: {
      dense: {
        // Default dense list items to adding ellipsis for really long str...
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      },
    },
    MuiButton: {
      text: {
        // Text buttons have less padding by default, but we want to keep the original padding
        padding: null,
      },
    },
    MuiChip: {
      root: {
        // By default there's no margin, but it's usually wanted, so we add some trailing margin
        marginRight: theme.spacing(1),
        marginBottom: theme.spacing(1),
      },
    },
    MuiCardHeader: {
      root: {
        // Reduce padding between header and content
        paddingBottom: 0,
      },
    },
    MuiCardActions: {
      root: {
        // We default to putting the card actions at the end
        justifyContent: 'flex-end',
      },
    },
  };
};

const extendedTheme = createMuiTheme(extendedThemeConfig);

// V1 theming
// https://material-ui-next.com/customization/themes/
// For CSS it is advised to use JSS, see https://material-ui-next.com/customization/css-in-js/

const BackstageTheme = { ...extendedTheme, ...createOverrides(extendedTheme) };

// Temporary workaround for files incorrectly importing the theme directly
export const V1 = BackstageTheme;
export default BackstageTheme;
