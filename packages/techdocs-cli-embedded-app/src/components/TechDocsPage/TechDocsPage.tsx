/*
 * Copyright 2021 The Backstage Authors
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

import { Theme, makeStyles } from '@material-ui/core';

import { Box, Tooltip, IconButton } from '@material-ui/core';
import LightIcon from '@material-ui/icons/Brightness7';
import DarkIcon from '@material-ui/icons/Brightness4';

import { appThemeApiRef, useApi } from '@backstage/core-plugin-api';

import {
  TechDocsReaderPage,
  TechDocsReaderPageHeader,
  TechDocsReaderPageContent,
} from '@backstage/plugin-techdocs';

const useStyles = makeStyles((theme: Theme) => ({
  headerIcon: {
    color: theme.palette.common.white,
    width: '32px',
    height: '32px',
  },
  content: {
    backgroundColor: theme.palette.background.default,
  },
  contentToolbar: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: 0,
  },
}));

enum Themes {
  LIGHT = 'light',
  DARK = 'dark',
}

export const TechDocsThemeToggle = () => {
  const appThemeApi = useApi(appThemeApiRef);
  const classes = useStyles();
  const [theme, setTheme] = useState<Themes>(
    appThemeApi.getActiveThemeId() === Themes.DARK ? Themes.DARK : Themes.LIGHT,
  );

  const themes = {
    [Themes.LIGHT]: {
      icon: DarkIcon,
      title: 'Dark theme',
    },
    [Themes.DARK]: {
      icon: LightIcon,
      title: 'Light theme',
    },
  };

  const { title, icon: Icon } = themes[theme];

  const handleSetTheme = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === Themes.LIGHT ? Themes.DARK : Themes.LIGHT;
      appThemeApi.setActiveThemeId(newTheme);
      return newTheme;
    });
  };

  return (
    <Box display="flex" alignItems="center" mr={2}>
      <Tooltip title={title} arrow>
        <IconButton size="small" onClick={handleSetTheme}>
          <Icon className={classes.headerIcon} />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

const DefaultTechDocsPage = () => {
  return (
    <TechDocsReaderPage>
      <TechDocsReaderPageHeader />
      <TechDocsReaderPageContent withSearch={false} />
    </TechDocsReaderPage>
  );
};

export const techDocsPage = <DefaultTechDocsPage />;
