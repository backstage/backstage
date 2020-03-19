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
import { BackstageTheme, createApp } from '@spotify-backstage/core';
import React, { FC } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Root from './components/Root';
import * as plugins from './plugins';
import apis from './apis';

const useStyles = makeStyles(theme => ({
  '@global': {
    html: {
      height: '100%',
      fontFamily: theme.typography.fontFamily,
    },
    body: {
      height: '100%',
      fontFamily: theme.typography.fontFamily,
      'overscroll-behavior-y': 'none',
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
  return (
    <CssBaseline>
      <ThemeProvider theme={BackstageTheme}>
        <Router>
          <Root>
            <AppComponent />
          </Root>
        </Router>
      </ThemeProvider>
    </CssBaseline>
  );
};

export default App;
