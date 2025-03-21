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
import React, { useState, MouseEvent, MouseEventHandler } from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';

import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import Popover from '@material-ui/core/Popover';
import { TabProps, TabClassKey } from '@material-ui/core/Tab';
import { capitalize } from '@material-ui/core/utils';
import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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
    popInButton: {
      width: '100%',
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
  index: number;
  label: string;
  path: string;
  group: string;
};

type EntityTabsGroupProps = TabProps & {
  classes?: Partial<ReturnType<typeof styles>>;
  indicator?: React.ReactNode;
  highlightedButton?: number;
  items: EntityTabsGroupItem[];
  onSelectTab: MouseEventHandler<HTMLAnchorElement>;
};

const Tab = React.forwardRef(function Tab(
  props: EntityTabsGroupProps,
  ref: any,
) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const open = Boolean(anchorEl);
  const submenuId = open ? 'tabbed-submenu' : undefined;

  const {
    classes,
    className,
    disabled = false,
    disableFocusRipple = false,
    items,
    fullWidth,
    icon,
    indicator,
    label,
    onSelectTab,
    selected,
    textColor = 'inherit',
    wrapped = false,
    highlightedButton,
  } = props;

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
      [classes.labelIcon!]: label && icon,
      [classes.fullWidth!]: fullWidth,
      [classes.wrapped!]: wrapped,
    },
    className,
  ];

  const innerButtonClasses = [
    classes?.root,
    classes?.[`textColor${capitalize(textColor)}` as TabClassKey],
    classes?.defaultTab,
    classes && {
      [classes.disabled!]: disabled,
      [classes.labelIcon!]: label && icon,
      [classes.fullWidth!]: fullWidth,
      [classes.wrapped!]: wrapped,
    },
  ];

  if (items.length === 1) {
    return (
      <ButtonBase
        focusRipple={!disableFocusRipple}
        data-testid={testId}
        className={classnames(classArray)}
        ref={ref}
        role="tab"
        aria-selected={selected}
        disabled={disabled}
        component={Link}
        onClick={onSelectTab}
        to={items[0]?.path}
      >
        <Typography className={classes?.wrapper} variant="button">
          {icon}
          {items[0].label}
        </Typography>
        {indicator}
      </ButtonBase>
    );
  }
  return (
    <>
      <ButtonBase
        data-testid={testId}
        focusRipple={!disableFocusRipple}
        className={classnames(classArray)}
        ref={ref}
        role="tab"
        aria-selected={selected}
        disabled={disabled}
        onClick={handleMenuClick}
      >
        <Typography className={classes?.wrapper} variant="button">
          {label}
        </Typography>
        <ExpandMoreIcon />
      </ButtonBase>
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
        {items.map((i, idx) => (
          <div key={`popover_item_${idx}`}>
            <ButtonBase
              focusRipple={!disableFocusRipple}
              className={classnames(
                innerButtonClasses,
                classes?.popInButton,
                highlightedButton === i.index
                  ? classes?.selectedButton
                  : classes?.unselectedButton,
              )}
              ref={ref}
              aria-selected={selected}
              disabled={disabled}
              component={Link}
              onClick={e => {
                handleMenuClose();
                onSelectTab(e);
              }}
              to={i.path}
            >
              <Typography className={classes?.wrapper} variant="button">
                {icon}
                {i.label}
              </Typography>
              {indicator}
            </ButtonBase>
          </div>
        ))}
      </Popover>
    </>
  );
});

// @ts-ignore
export const EntityTabsGroup = withStyles(styles, { name: 'MuiTab' })(Tab);
