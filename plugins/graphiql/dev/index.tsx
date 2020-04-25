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
  ApiRegistry,
} from '@backstage/core';
import { lightTheme } from '@backstage/theme';
import { plugin, GraphQLBrowser, graphQlBrowseApiRef } from '../src';

const graphQlBrowseApi = GraphQLBrowser.fromEndpoints([
  GraphQLBrowser.createEndpoint({
    id: 'gitlab',
    title: 'GitLab',
    url: 'https://gitlab.com/api/graphql',
  }),
  GraphQLBrowser.createEndpoint({
    id: 'countries',
    title: 'Countries',
    url: 'https://countries.trevorblades.com/',
  }),
]);

const app = createApp();
app.registerApis(ApiRegistry.from([[graphQlBrowseApiRef, graphQlBrowseApi]]));
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
