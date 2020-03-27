/*
 * Copyright 2020 Spotify AB
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

import { CssBaseline, makeStyles, ThemeProvider } from '@material-ui/core';
import { BackstageThemeLight, BackstageThemeDark, createApp } from '@backstage/core';
import React, {FC, useState} from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Root from './components/Root';
import ErrorDisplay from './components/ErrorDisplay';
import * as plugins from './plugins';
import apis, { errorDialogForwarder } from './apis';
import useMediaQuery from "@material-ui/core/useMediaQuery";

import { ThemeContext } from './ThemeContext';

const useStyles = makeStyles(theme => ({
  '@global': {
    html: {
      height: '100%',
      fontFamily: theme.typography.fontFamily,
    },
    body: {
      height: '100%',
      fontFamily: theme.typography.fontFamily,
      'overscroll-behavior-y': 'none'
    },
    a: {
      color: 'inherit',
      textDecoration: 'none',
    },
  },
}));

const app = createApp();
app.registerApis(apis);
app.registerPlugin(...Object.values(plugins));
const AppComponent = app.build();

const App: FC<{}> = () => {
  useStyles();
  let themeId : string = localStorage.getItem('light') || 'auto';
  if (['light', 'dark'].indexOf(themeId) < 0) {
    themeId = useMediaQuery('(prefers-color-scheme: dark)') ? 'dark' : 'light';
  }
  const [theme, setTheme] = useState(themeId);
  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
      localStorage.setItem('light', 'dark');
    } else if (theme === 'light') {
      setTheme('auto');
      localStorage.setItem('light', 'auto');
      themeId = useMediaQuery('(prefers-color-scheme: dark)') ? 'dark' : 'light';
    } else {
      setTheme('light');
      localStorage.setItem('light', 'light');
    }
  }
  const backstageThemeDark = BackstageThemeDark;
  const backstageThemeLight = BackstageThemeLight;
  return (
    <ThemeContext.Provider value={{theme, toggleTheme}}>
      <ThemeProvider theme={theme === 'dark' ? backstageThemeDark : backstageThemeLight}>
        <CssBaseline>
          <ErrorDisplay forwarder={errorDialogForwarder} />
          <Router>
            <Root>
              <AppComponent />
            </Root>
          </Router>
        </CssBaseline>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default App;
