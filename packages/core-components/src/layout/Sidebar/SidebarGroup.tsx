

import BottomNavigationAction, {
  BottomNavigationActionProps,
} from '@material-ui/core/BottomNavigationAction';
import { Theme, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import { ReactNode, ChangeEvent, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Link } from '../../components/Link/Link';
import { SidebarConfig, SidebarConfigContext } from './config';
import { MobileSidebarContext } from './MobileSidebarContext';
import { useSidebarPinState } from './SidebarPinStateContext';
import { SidebarContext } from './SidebarContext';

/**
 * Props for the `SidebarGroup`
 *
 * @public
 */
export interface SidebarGroupProps extends BottomNavigationActionProps {
  /**
   * If the `SidebarGroup` should be a `Link`, `to` should be a pathname to that location
   */
  to?: string;

  priority?: number;
 
  children?: ReactNode;

  id?: string;
}

const useStyles = makeStyles<Theme, { sidebarConfig: SidebarConfig }>(
  theme => ({
    root: {
      flexGrow: 0,
      margin: theme.spacing(0, 2),
      color: theme.palette.navigation.color,
    },
    selected: props => ({
      color: `${theme.palette.navigation.selectedColor}!important`,
      borderTop: `solid ${props.sidebarConfig.selectedIndicatorWidth}px ${theme.palette.navigation.indicator}`,
      marginTop: '-1px',
    }),
    label: {
      display: 'none',
    },
 
    expandableRoot: {
      width: '100%',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      padding: theme.spacing(1, 2),
      '&:hover': {
        backgroundColor: theme.palette.navigation.navItem?.hoverBackground ?? '#404040',
      },
    },
    headerText: {
      flex: 1,
      fontWeight: 'bold',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    expandIcon: {
      color: theme.palette.navigation.color,
      opacity: 0.7,
      transition: 'transform 200ms',
    },
    expandIconExpanded: {
      transform: 'rotate(180deg)',
    },
    nested: {
      paddingLeft: theme.spacing(6),
    },
    nestedList: {
      padding: 0,
    },
  }),
);

/**
 * Returns a Material UI `BottomNavigationAction`, which is aware of the current location & the selected item in the `BottomNavigation`,
 * such that it will highlight a `MobileSidebarGroup` either on location change or if the selected item changes.
 *
 * @param props `to`: pathname of link; `value`: index of the selected item
 * @internal
 */
const MobileSidebarGroup = (props: SidebarGroupProps) => {
  const { to, label, icon, value } = props;
  const { sidebarConfig } = useContext(SidebarConfigContext);
  const classes = useStyles({ sidebarConfig });
  const location = useLocation();
  const { selectedMenuItemIndex, setSelectedMenuItemIndex } =
    useContext(MobileSidebarContext);

  const onChange = (_: ChangeEvent<{}>, value: number) => {
    if (value === selectedMenuItemIndex) {
      setSelectedMenuItemIndex(-1);
    } else {
      setSelectedMenuItemIndex(value);
    }
  };

  const selected =
    (value === selectedMenuItemIndex && selectedMenuItemIndex >= 0) ||
    (!(value === selectedMenuItemIndex) &&
      !(selectedMenuItemIndex >= 0) &&
      to === location.pathname);

  return (
    // Material UI issue: https://github.com/mui-org/material-ui/issues/27820
    <BottomNavigationAction
      aria-label={label}
      label={label}
      icon={icon}
      component={Link as any}
      to={(to ? to : location.pathname) as any}
      onChange={onChange}
      value={value}
      selected={selected}
      classes={classes}
    />
  );
};

/**
 * Expandable sidebar group component for desktop view
 * @internal
 */
const DesktopSidebarGroup = (props: SidebarGroupProps) => {
  const { children, icon, label, id } = props;
  const { sidebarConfig } = useContext(SidebarConfigContext);
  const classes = useStyles({ sidebarConfig });
  const { isCollapsed, expandedGroups, onGroupToggle } = useContext(SidebarContext);
  
  const groupId = id || label || 'unknown';
  const isExpanded = expandedGroups?.[groupId] ?? false;

  const handleToggle = () => {
    onGroupToggle?.(groupId, !isExpanded);
  };

  if (isCollapsed) {
    // When collapsed, just show the icon with a tooltip
    return (
      <ListItem button className={classes.header} title={label}>
        <ListItemIcon>{icon}</ListItemIcon>
      </ListItem>
    );
  }

  return (
    <div className={classes.expandableRoot}>
      <ListItem button className={classes.header} onClick={handleToggle}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={label} className={classes.headerText} />
        <ExpandMoreIcon 
          className={`${classes.expandIcon} ${isExpanded ? classes.expandIconExpanded : ''}`}
        />
      </ListItem>
      
      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <List component="div" className={classes.nestedList}>
          {children}
        </List>
      </Collapse>
    </div>
  );
};

/**
 * Groups items of the `Sidebar` together.
 *
 * @remarks
 * On bigger screens, this creates an expandable navigation group.
 * On small screens, it will add an action to the bottom navigation - either triggering an overlay menu or acting as a link
 *
 * @public
 */
export const SidebarGroup = (props: SidebarGroupProps) => {
  const { children, to, label, icon, value, id } = props;
  const { isMobile } = useSidebarPinState();

  // If there's a `to` prop, this is a simple link group (not expandable)
  if (to) {
    return isMobile ? (
      <MobileSidebarGroup to={to} label={label} icon={icon} value={value} />
    ) : (
      <>{children}</>
    );
  }

  // This is an expandable group
  return isMobile ? (
    <MobileSidebarGroup to={to} label={label} icon={icon} value={value} />
  ) : (
    <DesktopSidebarGroup icon={icon} label={label} id={id}>
      {children}
    </DesktopSidebarGroup>
  );
};
