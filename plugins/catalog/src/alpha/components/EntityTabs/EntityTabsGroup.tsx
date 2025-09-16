/*
 * Copyright 2025 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {
  ReactNode,
  forwardRef,
  useState,
  MouseEvent,
  MouseEventHandler,
  ReactElement,
} from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';

import Typography from '@material-ui/core/Typography';
import Popover from '@material-ui/core/Popover';
import { TabProps, TabClassKey } from '@material-ui/core/Tab';
import { capitalize } from '@material-ui/core/utils';
import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import { useApi } from '@backstage/core-plugin-api';
import { IconsApi, iconsApiRef } from '@backstage/frontend-plugin-api';

const styles = (theme: Theme) =>
  createStyles({
    /* Styles applied to the root element. */
    root: {
      ...theme.typography.button,
      maxWidth: 264,
      minWidth: 72,
      position: 'relative',
      boxSizing: 'border-box',
      minHeight: 48,
      flexShrink: 0,
      padding: '6px 12px',
      [theme.breakpoints.up('sm')]: {
        padding: '6px 24px',
      },
      overflow: 'hidden',
      whiteSpace: 'normal',
      textAlign: 'center',
      [theme.breakpoints.up('sm')]: {
        minWidth: 160,
      },
    },
    defaultTab: {
      ...theme.typography.caption,
      padding: theme.spacing(3, 3),
      textTransform: 'uppercase',
      fontWeight: theme.typography.fontWeightBold,
      color: theme.palette.text.secondary,
    },
    /* Styles applied to the root element if both `icon` and `label` are provided. */
    labelIcon: {
      minHeight: 72,
      paddingTop: 9,
      '& $wrapper > *:first-child': {
        marginBottom: 6,
      },
    },
    /* Styles applied to the root element if the parent [`Tabs`](/api/tabs/) has `textColor="inherit"`. */
    textColorInherit: {
      color: 'inherit',
      opacity: 0.7,
      '&$selected': {
        opacity: 1,
      },
      '&$disabled': {
        opacity: 0.5,
      },
    },
    selectedButton: {
      color: `${theme.palette.text.primary}`,
      opacity: `${1}`,
    },
    unselectedButton: {
      color: `${theme.palette.text.secondary}`,
      opacity: `${0.7}`,
    },
    /* Styles applied to the root element if the parent [`Tabs`](/api/tabs/) has `textColor="primary"`. */
    textColorPrimary: {
      color: theme.palette.text.secondary,
      '&$selected': {
        color: theme.palette.primary.main,
      },
      '&$disabled': {
        color: theme.palette.text.disabled,
      },
    },
    /* Styles applied to the root element if the parent [`Tabs`](/api/tabs/) has `textColor="secondary"`. */
    textColorSecondary: {
      color: theme.palette.text.secondary,
      '&$selected': {
        color: theme.palette.secondary.main,
      },
      '&$disabled': {
        color: theme.palette.text.disabled,
      },
    },
    /* Pseudo-class applied to the root element if `selected={true}` (controlled by the Tabs component). */
    selected: {},
    /* Pseudo-class applied to the root element if `disabled={true}` (controlled by the Tabs component). */
    disabled: {},
    /* Styles applied to the root element if `fullWidth={true}` (controlled by the Tabs component). */
    fullWidth: {
      flexShrink: 1,
      flexGrow: 1,
      flexBasis: 0,
      maxWidth: 'none',
    },
    /* Styles applied to the root element if `wrapped={true}`. */
    wrapped: {
      fontSize: theme.typography.pxToRem(12),
      lineHeight: 1.5,
    },
    /* Styles applied to the `icon` and `label`'s wrapper element. */
    wrapper: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      flexDirection: 'row',
    },
  });

type EntityTabsGroupItem = {
  id: string;
  label: string;
  path: string;
  icon?: string | ReactElement;
};

type EntityTabsGroupProps = TabProps & {
  classes?: Partial<ReturnType<typeof styles>>;
  indicator?: ReactNode;
  highlightedButton?: string;
  items: EntityTabsGroupItem[];
  onSelectTab?: MouseEventHandler<HTMLAnchorElement>;
  showIcons?: boolean;
};

function resolveIcon(
  icon: string | ReactElement | undefined,
  iconsApi: IconsApi,
  showIcons: boolean,
) {
  if (!showIcons) {
    return undefined;
  }
  const itemIcon = icon;
  if (typeof itemIcon === 'string') {
    const Icon = iconsApi.getIcon(itemIcon);
    if (Icon) {
      return <Icon />;
    }
  }
  return itemIcon;
}

const Tab = forwardRef(function Tab(props: EntityTabsGroupProps, ref: any) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const iconsApi = useApi(iconsApiRef);

  const open = Boolean(anchorEl);
  const submenuId = open ? 'tabbed-submenu' : undefined;

  const {
    classes,
    className,
    disabled = false,
    disableFocusRipple = false,
    items,
    fullWidth,
    indicator,
    label,
    onSelectTab,
    selected,
    textColor = 'inherit',
    wrapped = false,
    highlightedButton,
    showIcons = false,
  } = props;

  const groupIcon = resolveIcon(props.icon, iconsApi, showIcons);
  const testId = 'data-testid' in props && props['data-testid'];

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const classArray = [
    classes?.root,
    classes?.[`textColor${capitalize(textColor)}` as TabClassKey],
    classes && {
      [classes.disabled!]: disabled,
      [classes.selected!]: selected,
      [classes.labelIcon!]: label && groupIcon,
      [classes.fullWidth!]: fullWidth,
      [classes.wrapped!]: wrapped,
    },
    className,
  ];

  if (items.length === 1) {
    return (
      <Button
        focusRipple={!disableFocusRipple}
        data-testid={testId}
        className={classnames(
          classArray,
          classes && {
            [classes.labelIcon!]: label && (items[0].icon ?? groupIcon),
          },
        )}
        ref={ref}
        role="tab"
        aria-selected={selected}
        disabled={disabled}
        component={Link}
        onClick={onSelectTab}
        to={items[0]?.path}
        startIcon={resolveIcon(items[0].icon, iconsApi, showIcons)}
      >
        <Typography className={classes?.wrapper} variant="button">
          {items[0].label}
        </Typography>
        {indicator}
      </Button>
    );
  }
  const hasIcons = showIcons && items.some(i => i.icon);
  return (
    <>
      <Button
        data-testid={testId}
        focusRipple={!disableFocusRipple}
        className={classnames(classArray)}
        ref={ref}
        role="tab"
        aria-selected={selected}
        disabled={disabled}
        onClick={handleMenuClick}
        startIcon={groupIcon}
      >
        <Typography className={classes?.wrapper} variant="button">
          {label}
        </Typography>
        <ExpandMoreIcon />
      </Button>
      <Popover
        id={submenuId}
        open={open}
        anchorEl={anchorEl}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <List component="nav">
          {items.map(i => {
            const itemIcon = resolveIcon(i.icon, iconsApi, showIcons);
            return (
              <ListItem
                key={`popover_item_${i.id}`}
                button
                focusRipple={!disableFocusRipple}
                classes={{
                  selected: classnames(classes?.selectedButton),
                  default: classnames(classes?.unselectedButton),
                  disabled: classnames(classes?.disabled),
                }}
                ref={ref}
                aria-selected={selected}
                disabled={disabled}
                selected={highlightedButton === i.id}
                component={Link}
                onClick={e => {
                  handleMenuClose();
                  onSelectTab?.(e);
                }}
                to={i.path}
              >
                {itemIcon && <ListItemIcon>{itemIcon}</ListItemIcon>}
                <ListItemText
                  inset={!itemIcon && hasIcons}
                  primary={
                    <>
                      <Typography variant="button">{i.label}</Typography>
                      {indicator}
                    </>
                  }
                />
              </ListItem>
            );
          })}
        </List>
      </Popover>
    </>
  );
});

// @ts-ignore
export const EntityTabsGroup = withStyles(styles, { name: 'MuiTab' })(Tab);
