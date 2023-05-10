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

import React, { cloneElement } from 'react';
import useObservable from 'react-use/lib/useObservable';
import AutoIcon from '@material-ui/icons/BrightnessAuto';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Tooltip,
  makeStyles,
} from '@material-ui/core';
import {
  appThemeApiRef,
  useApi,
  usePluginTranslation,
} from '@backstage/core-plugin-api';
import { TooltipToggleButton } from './TooltipToggleButton';
import { settingsTranslationRef } from '../../translation';

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

/** @public */
export const UserSettingsThemeToggle = () => {
  const classes = useStyles();
  const appThemeApi = useApi(appThemeApiRef);
  const themeId = useObservable(
    appThemeApi.activeThemeId$(),
    appThemeApi.getActiveThemeId(),
  );

  const { t } = usePluginTranslation(settingsTranslationRef);

  const themeIds = appThemeApi.getInstalledThemes();

  const handleSetTheme = (
    _event: React.MouseEvent<HTMLElement>,
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
        primary="Theme"
        secondary="Change the theme mode"
      />
      <ListItemSecondaryAction className={classes.listItemSecondaryAction}>
        <ToggleButtonGroup
          exclusive
          size="small"
          value={themeId ?? 'auto'}
          onChange={handleSetTheme}
        >
          {themeIds.map(theme => {
            const themeIcon = themeIds.find(it => it.id === theme.id)?.icon;
            return (
              <TooltipToggleButton
                key={theme.id}
                title={t(`select_theme_${theme.id}`, `Select ${theme.title}`)}
                value={theme.id}
              >
                {t(`theme_${theme.id}`, theme.title)}&nbsp;
                <ThemeIcon id={theme.id} icon={themeIcon} activeId={themeId} />
              </TooltipToggleButton>
            );
          })}
          <Tooltip
            placement="top"
            arrow
            title={t('select_theme_auto', 'Select Auto Theme')!}
          >
            <ToggleButton value="auto" selected={themeId === undefined}>
              {t('theme_auto', 'Auto')}&nbsp;
              <AutoIcon color={themeId === undefined ? 'primary' : undefined} />
            </ToggleButton>
          </Tooltip>
        </ToggleButtonGroup>
      </ListItemSecondaryAction>
    </ListItem>
  );
};
