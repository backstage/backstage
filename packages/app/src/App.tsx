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

import { CssBaseline, ThemeProvider } from '@material-ui/core';
import { lightTheme, darkTheme } from '@backstage/theme';
import { createApp } from '@backstage/core';
import React, { FC } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Root from './components/Root';
import AlertDisplay from './components/AlertDisplay';
import * as plugins from './plugins';
import apis, { alertApiForwarder } from './apis';
import { ThemeContextType, ThemeContext, useThemeType } from './ThemeContext';

const app = createApp();
app.registerApis(apis);
app.registerPlugin(...Object.values(plugins));
const AppComponent = app.build();

const App: FC<{}> = () => {
  const [theme, toggleTheme] = useThemeType(
    localStorage.getItem('theme') || 'auto',
  );

  let backstageTheme = lightTheme;
  switch (theme) {
    case 'light':
      backstageTheme = lightTheme;
      break;
    case 'dark':
      backstageTheme = darkTheme;
      break;
    default:
      if (!window.matchMedia) {
        backstageTheme = lightTheme;
        break;
      }
      backstageTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? darkTheme
        : lightTheme;
      break;
  }

  const themeContext: ThemeContextType = {
    theme,
    toggleTheme,
  };
  return (
    <ThemeContext.Provider value={themeContext}>
      <ThemeProvider theme={backstageTheme}>
        <CssBaseline>
          <AlertDisplay forwarder={alertApiForwarder} />
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
