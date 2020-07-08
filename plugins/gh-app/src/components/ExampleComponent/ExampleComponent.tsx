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
import {
  Header,
  Page,
  pageTheme,
  Content,
  ContentHeader,
  HeaderLabel,
} from '@backstage/core';
import { Input } from '@material-ui/core';

const defaultManifest = require('../../manifest.yaml');

const Manifest = {
  ...defaultManifest,
  redirect_url: 'http://localhost:7000/gh-app/install/callback',
  hook_attributes: {
    url: 'https://smee.io/ok6vLA8yMu3umnI',
  },
};

const ExampleComponent: FC<{}> = () => (
  <Page theme={pageTheme.tool}>
    <Header
      title="Setup Github Auth"
      subtitle="Register the Backstage Github App"
    >
      <HeaderLabel label="Owner" value="Team X" />
      <HeaderLabel label="Lifecycle" value="Alpha" />
    </Header>
    <Content>
      <ContentHeader title="Register" />

      <form
        action="https://github.com/organizations/blamdemo/settings/apps/new"
        method="post"
      >
        <Input
          style={{ display: 'none' }}
          name="manifest"
          value={JSON.stringify(Manifest)}
        />
        <Input type="submit" value="Create Github App" />
      </form>
    </Content>
  </Page>
);

export default ExampleComponent;
