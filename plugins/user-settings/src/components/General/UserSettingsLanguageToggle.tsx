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

import React, { useState } from 'react';
import {
  useTranslationRef,
  appLanguageApiRef,
} from '@backstage/core-plugin-api/alpha';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import { makeStyles } from '@material-ui/core/styles';
import { userSettingsTranslationRef } from '../../translation';
import { useApi } from '@backstage/core-plugin-api';
import useObservable from 'react-use/esm/useObservable';
import { Select } from '@backstage/core-components';

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
  const languageApi = useApi(appLanguageApiRef);
  const { t } = useTranslationRef(userSettingsTranslationRef);

  const [languageObservable] = useState(() => languageApi.language$());
  const { language: currentLanguage } = useObservable(
    languageObservable,
    languageApi.getLanguage(),
  );

  const { languages } = languageApi.getAvailableLanguages();

  if (languages.length <= 1) {
    return null;
  }

  const handleSetLanguage = (newLanguage: string | undefined) => {
    languageApi.setLanguage(newLanguage);
  };

  const getLanguageDisplayName = (language: string) => {
    try {
      const names = new Intl.DisplayNames([language], {
        type: 'language',
      });
      return names.of(language) || language;
    } catch (err) {
      return language;
    }
  };

  return (
    <ListItem
      className={classes.list}
      classes={{ container: classes.container }}
    >
      <ListItemText
        className={classes.listItemText}
        primary={t('languageToggle.title')}
        secondary={t('languageToggle.description')}
      />
      <ListItemSecondaryAction className={classes.listItemSecondaryAction}>
        <Select
          label=""
          selected={currentLanguage}
          items={languages.map(language => ({
            label: getLanguageDisplayName(language),
            value: language,
          }))}
          onChange={selectedItems => handleSetLanguage(selectedItems as string)}
        />
      </ListItemSecondaryAction>
    </ListItem>
  );
};
