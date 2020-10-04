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
import { customPageTheme } from '@backstage/theme';
import React from 'react';
import { Header } from '.';
import { HeaderLabel } from '../HeaderLabel';
import { Page } from '../Page';

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
  <Page pageTheme={customPageTheme.pageTheme.home}>
    <Header title="Start/Home Page" type="home">
      {labels}
    </Header>
  </Page>
);

export const HomeWithSubtitle = () => (
  <Page pageTheme={customPageTheme.pageTheme.home}>
    <Header title="Start/Home Page" subtitle="This is a subtitle">
      {labels}
    </Header>
  </Page>
);

export const Tool = () => (
  <Page pageTheme={customPageTheme.pageTheme.tool}>
    <Header title="Stand-alone tool" type="tool">
      {labels}
    </Header>
  </Page>
);

export const Service = () => (
  <Page pageTheme={customPageTheme.pageTheme.service}>
    <Header title="Service component page" type="service">
      {labels}
    </Header>
  </Page>
);

export const Website = () => (
  <Page pageTheme={customPageTheme.pageTheme.website}>
    <Header title="Website component page" type="website">
      {labels}
    </Header>
  </Page>
);

export const Library = () => (
  <Page pageTheme={customPageTheme.pageTheme.library}>
    <Header title="Library component page" type="library">
      {labels}
    </Header>
  </Page>
);

export const App = () => (
  <Page pageTheme={customPageTheme.pageTheme.app}>
    <Header title="App component page" type="app">
      {labels}
    </Header>
  </Page>
);

export const Documentation = () => (
  <Page pageTheme={customPageTheme.pageTheme.documentation}>
    <Header title="Documentation component page" type="documentation">
      {labels}
    </Header>
  </Page>
);

export const Other = () => (
  <Page pageTheme={customPageTheme.pageTheme.other}>
    <Header title="Other/generic component page" type="other">
      {labels}
    </Header>
  </Page>
);
