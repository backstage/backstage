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

import React, {
  FC,
  createContext,
  useContext,
  useState,
  useCallback,
} from 'react';

import { Theme, makeStyles } from '@material-ui/core';

import { ThemeProvider, Box, Tooltip, IconButton } from '@material-ui/core';
import LightIcon from '@material-ui/icons/Brightness7';
import DarkIcon from '@material-ui/icons/Brightness4';

import { lightTheme, darkTheme } from '@backstage/theme';
import { EntityName } from '@backstage/catalog-model';

import { Content } from '@backstage/core-components';

import {
  Reader,
  TechDocsPage,
  TechDocsPageHeader,
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

type TechDocsThemeValue = {
  theme: Themes;
  toggleTheme: () => void;
};

const TechDocsThemeContext = createContext<TechDocsThemeValue>({
  theme: Themes.LIGHT,
  toggleTheme: () => {},
});

const TechdocsThemeProvider: FC = ({ children }) => {
  const [theme, setTheme] = useState<Themes>(Themes.LIGHT);

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme =>
      prevTheme === Themes.LIGHT ? Themes.DARK : Themes.LIGHT,
    );
  }, [setTheme]);

  const value = { theme, toggleTheme };

  const themes = {
    [Themes.LIGHT]: lightTheme,
    [Themes.DARK]: darkTheme,
  };

  return (
    <TechDocsThemeContext.Provider value={value}>
      <ThemeProvider theme={themes[theme]}>{children}</ThemeProvider>
    </TechDocsThemeContext.Provider>
  );
};

const useTechDocsTheme = () => useContext(TechDocsThemeContext);

const TechDocsThemeToggle = () => {
  const classes = useStyles();
  const { theme, toggleTheme } = useTechDocsTheme();

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

  return (
    <Box display="flex" alignItems="center" mr={2}>
      <Tooltip title={title} arrow>
        <IconButton size="small" onClick={toggleTheme}>
          <Icon className={classes.headerIcon} />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

const TechDocsPageContent = ({
  onReady,
  entityRef,
}: {
  entityRef: EntityName;
  onReady: () => void;
}) => {
  const classes = useStyles();

  return (
    <Content className={classes.content} data-testid="techdocs-content">
      <Reader onReady={onReady} entityRef={entityRef} withSearch={false} />
    </Content>
  );
};

const DefaultTechDocsPage = () => {
  const techDocsMetadata = {
    site_name: 'Live preview environment',
    site_description: '',
  };

  return (
    <TechDocsPage>
      {({ entityRef, onReady }) => (
        <>
          <TechDocsPageHeader
            entityRef={entityRef}
            techDocsMetadata={techDocsMetadata}
          >
            <TechDocsThemeToggle />
          </TechDocsPageHeader>
          <TechDocsPageContent entityRef={entityRef} onReady={onReady} />
        </>
      )}
    </TechDocsPage>
  );
};

export const techDocsPage = (
  <TechdocsThemeProvider>
    <DefaultTechDocsPage />
  </TechdocsThemeProvider>
);
