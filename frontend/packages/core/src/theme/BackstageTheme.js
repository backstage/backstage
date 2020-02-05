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
  COMPONENT_TYPES: {
    SERVICE: '#39732E',
    ENDPOINT: '#B71C1C',
    PROJECT: '#E657AA',
    WORKFLOW: '#c15013',
  },
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
        service: COLORS.COMPONENT_TYPES.SERVICE,
        endpoint: COLORS.COMPONENT_TYPES.ENDPOINT,
        project: COLORS.COMPONENT_TYPES.PROJECT,
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
    h4: {
      // Page name/heading | Dialog titles
      fontSize: 48,
      color: '#2D2D2D',
      fontWeight: 'bold',
    },
    h3: {
      // Page titles
      fontSize: 32,
      color: '#2D2D2D',
      fontWeight: 'bold',
    },
    h2: {
      // Card titles | Sub headings in dialogs
      fontSize: 24,
      color: '#2D2D2D',
      fontWeight: 'bold',
      lineHeight: 1.2,
      marginBottom: 6,
    },
    header3: {
      // Table headers (ALL CAPS!)
      fontSize: 12,
      color: '#9E9E9E',
    },
    menuItem1: {
      // Sidebar menu item
      fontSize: 16,
      color: '#828282',
      fontWeight: 'bold',
    },
    menuItem2: {
      // Dropdown menu items | Form labels | Deep links from cards (Go to...)
      fontSize: 16,
      color: '#2D2D2D',
    },
    text: {
      // Table entries | Information/error text/messages | General copy/paragraphs
      fontSize: 13,
      color: '#2D2D2D',
    },
    links: {
      // Table entries | Information/error text/messages | General copy/paragraphs
      color: '#509BF5',
    },
    tabSelected: {
      // Selected tab
      fontSize: 18,
      color: '#2D2D2D',
    },
    tabUnselected: {
      // Unselected tab
      fontSize: 18,
      color: '#9E9E9E',
    },
    code: {
      fontFamily: 'monospace',
      whiteSpace: 'pre',
      fontSize: '16px',
    },
    caption: {
      // Restores caption to display: block to match MUI3 behavior; this global override should
      // be removed if possible.
      display: 'block',
    },
  },
};

const createOverrides = theme => {
  const overrides = {
    MuiAppBar: {
      root: {
        zIndex: 1049,
        height: 44,
      },
      colorPrimary: {
        backgroundColor: '#212121',
      },
    },
    MuiToolbar: {
      root: {
        '@media (min-width:600px)': {
          minHeight: 44,
        },
      },
    },
    MuiTableRow: {
      root: {
        height: 'auto',
        '&:nth-of-type(odd)': {
          backgroundColor: theme.palette.background.default,
        },
      },
      hover: {
        '&:hover': {
          cursor: 'pointer',
        },
      },
      head: {
        height: 'auto',
        '&:nth-of-type(odd)': {
          backgroundColor: COLORS.NAMED.WHITE,
        },
      },
    },
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
      root: {
        minHeight: 24,
      },
    },
    MuiTab: {
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
      root: {
        color: 'inherit',
        '&:hover': {
          color: 'inherit',
        },
        '&:focus': {
          color: 'inherit',
        },
      },
      active: {
        fontWeight: 'bold',
        color: 'inherit',
      },
    },
    MuiListItemText: {
      dense: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      },
    },
    MuiButton: {
      text: {
        padding: '6px 16px',
      },
    },
    MuiChip: {
      root: {
        marginRight: theme.spacing(1),
        marginBottom: theme.spacing(1),
      },
    },
    MuiDivider: {
      light: {
        backgroundColor: '#727272',
      },
    },
    MuiDialogTitle: {
      root: {
        minWidth: 600,
      },
    },
    MuiCardHeader: {
      root: {
        // Remove bottom padding on titles; there is always a CardContent below that also has padding,
        // so without this fix there will be too much space below the title.
        paddingBottom: '0',
        // Mui 1.2.1 introduced more padding left and right with media queries.
        // Question is if we should override them or just go with the defaults
        '@media (min-width:600px)': {
          paddingLeft: theme.spacing(2),
          paddingRight: theme.spacing(2),
        },
      },
    },
    MuiCardContent: {
      root: {
        '&:last-child': {
          // There is some odd extra whitespace at the bottom of card content, which makes it look
          // bottom-heavy and uneven; set it to the same as the other sides
          paddingBottom: theme.spacing(2),
        },
        // Mui 1.2.1 introduced more padding left and right with media queries.
        // Question is if we should override them or just go with the defaults
        '@media (min-width:600px)': {
          paddingLeft: theme.spacing(2),
          paddingRight: theme.spacing(2),
        },
      },
    },
    MuiCardActions: {
      root: {
        justifyContent: 'flex-end',
      },
    },
    MuiListSubheader: {
      sticky: {
        // Sticky subheaders need to be opaque so that they overwrite list items as you scroll down.
        backgroundColor: theme.palette.background.paper,
      },
    },
    Toolbar: {
      toolbar: {
        // Override the toolbar in dx-react-grid table
        marginTop: '-64px',
      },
    },
  };
  return {
    overrides,
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
