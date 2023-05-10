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

import React, { useCallback, useMemo } from 'react';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  makeStyles,
} from '@material-ui/core';
import { usePluginTranslation } from '@backstage/core-plugin-api';
import { TooltipToggleButton } from './TooltipToggleButton';
import { settingsTranslationRef } from '../../translation';

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
export const UserSettingsLanguageToggle = () => {
  const classes = useStyles();

  const { t, i18n } = usePluginTranslation(settingsTranslationRef);

  const supportedLngs = useMemo(
    () => (i18n.options.supportedLngs || []).filter(lng => lng !== 'cimode'),
    [i18n.options.supportedLngs],
  );

  const handleSetLanguage = useCallback(
    (_event: React.MouseEvent<HTMLElement>, newValue: string) => {
      if (!newValue || newValue === i18n.language) {
        return;
      }
      if (supportedLngs.some(l => l === newValue)) {
        i18n.changeLanguage(newValue);
      } else {
        i18n.changeLanguage(undefined);
      }
    },
    [i18n, supportedLngs],
  );

  if (!supportedLngs.length) {
    return null;
  }

  return (
    <ListItem
      className={classes.list}
      classes={{ container: classes.container }}
    >
      <ListItemText
        className={classes.listItemText}
        primary={t('language', 'Language')}
        secondary={t('change_the_language', 'Change the language')}
      />
      <ListItemSecondaryAction className={classes.listItemSecondaryAction}>
        <ToggleButtonGroup
          exclusive
          size="small"
          value={i18n.language}
          onChange={handleSetLanguage}
        >
          {supportedLngs.map(lng => {
            return (
              <TooltipToggleButton
                key={lng}
                title={t('select_lng', { lng })}
                value={lng}
              >
                {t('lng', { lng })}
              </TooltipToggleButton>
            );
          })}
        </ToggleButtonGroup>
      </ListItemSecondaryAction>
    </ListItem>
  );
};
