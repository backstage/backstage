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

import React, { FC } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import HomeIcon from '@material-ui/icons/Home';
import { ThemeProvider, CssBaseline } from '@material-ui/core';
import {
  createApp,
  SidebarPage,
  Sidebar,
  SidebarItem,
  SidebarSpacer,
} from '@backstage/core';
import { lightTheme } from '@backstage/theme';
import { plugin } from '../src/plugin';

const app = createApp();
app.registerPlugin(plugin);
const AppComponent = app.build();

const App: FC<{}> = () => {
  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline>
        <BrowserRouter>
          <SidebarPage>
            <Sidebar>
              <SidebarSpacer />
              <SidebarItem icon={HomeIcon} to="/graphiql" text="Home" />
            </Sidebar>
            <AppComponent />
          </SidebarPage>
        </BrowserRouter>
      </CssBaseline>
    </ThemeProvider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
