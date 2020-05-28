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
import React from 'react';
import { Header } from '.';
import { HeaderLabel } from '../HeaderLabel';
import { Page, pageTheme } from '../Page';

export default {
  title: 'Header',
  component: Header,
};

const labels = (
  <>
    <HeaderLabel label="Owner" value="players" />
    <HeaderLabel label="Lifecycle" value="Production" />
    <HeaderLabel label="Tier" value="Level 1" />
  </>
);

export const Home = () => (
  <Page theme={pageTheme.home}>
    <Header title="Start/Home Page" type="home">
      {labels}
    </Header>
  </Page>
);

export const HomeWithSubtitle = () => (
  <Header title="Start/Home Page" subtitle="This is a subtitle">
    {labels}
  </Header>
);

export const Tool = () => (
  <Page theme={pageTheme.tool}>
    <Header title="Stand-alone tool" type="tool">
      {labels}
    </Header>
  </Page>
);

export const Service = () => (
  <Page theme={pageTheme.service}>
    <Header title="Service component page" type="service">
      {labels}
    </Header>
  </Page>
);

export const Website = () => (
  <Page theme={pageTheme.website}>
    <Header title="Website component page" type="website">
      {labels}
    </Header>
  </Page>
);

export const Library = () => (
  <Page theme={pageTheme.library}>
    <Header title="Library component page" type="library">
      {labels}
    </Header>
  </Page>
);

export const App = () => (
  <Page theme={pageTheme.app}>
    <Header title="App component page" type="app">
      {labels}
    </Header>
  </Page>
);

export const Other = () => (
  <Page theme={pageTheme.library}>
    <Header title="Other/generic component page" type="other">
      {labels}
    </Header>
  </Page>
);
