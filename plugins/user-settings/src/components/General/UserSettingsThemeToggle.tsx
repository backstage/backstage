/*
 * Copyright 2020 The Backstage Authors
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

import { MouseEvent, cloneElement } from 'react';
import useObservable from 'react-use/esm/useObservable';
import AutoIcon from '@material-ui/icons/BrightnessAuto';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';
import { appThemeApiRef, useApi } from '@backstage/core-plugin-api';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { userSettingsTranslationRef } from '../../translation';

type ThemeIconProps = {
  id: string;
  activeId: string | undefined;
  icon: JSX.Element | undefined;
};

const ThemeIcon = ({ id, activeId, icon }: ThemeIconProps) =>
  icon ? (
    cloneElement(icon, {
      color: activeId === id ? 'primary' : undefined,
    })
  ) : (
    <AutoIcon color={activeId === id ? 'primary' : undefined} />
  );

type TooltipToggleButtonProps = {
  children: JSX.Element;
  title: string;
  value: string;
};

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 8,
    paddingRight: 16,
  },
  list: {
    width: 'initial',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      padding: `0 0 12px`,
    },
  },
  listItemText: {
    paddingRight: 0,
    paddingLeft: 0,
  },
  listItemSecondaryAction: {
    position: 'relative',
    transform: 'unset',
    top: 'auto',
    right: 'auto',
    paddingLeft: 16,
    [theme.breakpoints.down('xs')]: {
      paddingLeft: 0,
    },
  },
}));

// ToggleButtonGroup uses React.children.map instead of context
// so wrapping with Tooltip breaks ToggleButton functionality.
const TooltipToggleButton = ({
  children,
  title,
  value,
  ...props
}: TooltipToggleButtonProps) => (
  <Tooltip placement="top" arrow title={title}>
    <ToggleButton value={value} {...props}>
      {children}
    </ToggleButton>
  </Tooltip>
);

/** @public */
export const UserSettingsThemeToggle = () => {
  const classes = useStyles();
  const appThemeApi = useApi(appThemeApiRef);
  const activeThemeId = useObservable(
    appThemeApi.activeThemeId$(),
    appThemeApi.getActiveThemeId(),
  );

  const themeIds = appThemeApi.getInstalledThemes();

  const { t } = useTranslationRef(userSettingsTranslationRef);

  const handleSetTheme = (
    _event: MouseEvent<HTMLElement>,
    newThemeId: string | undefined,
  ) => {
    if (themeIds.some(it => it.id === newThemeId)) {
      appThemeApi.setActiveThemeId(newThemeId);
    } else {
      appThemeApi.setActiveThemeId(undefined);
    }
  };

  return (
    <ListItem
      className={classes.list}
      classes={{ container: classes.container }}
    >
      <ListItemText
        className={classes.listItemText}
        primary={t('themeToggle.title')}
        secondary={t('themeToggle.description')}
      />
      <ListItemSecondaryAction className={classes.listItemSecondaryAction}>
        <ToggleButtonGroup
          exclusive
          size="small"
          value={activeThemeId ?? 'auto'}
          onChange={handleSetTheme}
        >
          {themeIds.map(theme => {
            const themeId = theme.id;
            const themeIcon = theme.icon;
            const themeTitle =
              theme.title ||
              (themeId === 'light' || themeId === 'dark'
                ? t(`themeToggle.names.${themeId}`)
                : themeId);
            return (
              <TooltipToggleButton
                key={themeId}
                title={t('themeToggle.select', { theme: themeTitle })}
                value={themeId}
              >
                <>
                  {themeTitle}&nbsp;
                  <ThemeIcon
                    id={themeId}
                    icon={themeIcon}
                    activeId={activeThemeId}
                  />
                </>
              </TooltipToggleButton>
            );
          })}
          <Tooltip placement="top" arrow title={t('themeToggle.selectAuto')}>
            <ToggleButton value="auto" selected={activeThemeId === undefined}>
              {t('themeToggle.names.auto')}&nbsp;
              <AutoIcon
                color={activeThemeId === undefined ? 'primary' : undefined}
              />
            </ToggleButton>
          </Tooltip>
        </ToggleButtonGroup>
      </ListItemSecondaryAction>
    </ListItem>
  );
};
