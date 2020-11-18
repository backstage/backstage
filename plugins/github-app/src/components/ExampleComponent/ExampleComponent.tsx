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
import { Typography, Grid, Input } from '@material-ui/core';
import {
  InfoCard,
  Header,
  Page,
  Content,
  ContentHeader,
  HeaderLabel,
  SupportButton,
  useApi,
  configApiRef,
} from '@backstage/core';
import ExampleFetchComponent from '../ExampleFetchComponent';

const defaultManifest = require('../../manifest.yaml');

const ExampleComponent: FC<{}> = () => {
  const configApi = useApi(configApiRef);

  const callbackUrl = configApi.getOptionalString(
    'integrations.githubApp.installation.callbackUrl',
  );

  const redirectUrl = configApi.getOptionalString(
    'integrations.githubApp.installation.redirectUrl',
  );

  const Manifest = {
    ...defaultManifest,
    redirect_url: redirectUrl,
    hook_attributes: {
      url: callbackUrl,
    },
  };

  console.warn(Manifest);
  return (
    <Page>
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
};

export default ExampleComponent;
