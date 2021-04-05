/*
 * Copyright 2021 Spotify AB
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
import React, { useMemo } from 'react';
import { Grid } from '@material-ui/core';
import {
  Header,
  Page,
  Content,
  ContentHeader,
  HeaderLabel,
  SupportButton,
  useApi,
} from '@backstage/core';
import { useObservable } from 'react-use';
import { configSchemaApiRef } from '../../api';
import { SchemaViewer } from '../SchemaViewer';

export const ConfigSchemaPage = () => {
  const configSchemaApi = useApi(configSchemaApiRef);
  const schema = useObservable(
    useMemo(() => configSchemaApi.schema$(), [configSchemaApi]),
  )?.schema;

  return (
    <Page themeId="tool">
      <Header title="Welcome to config-schema!" subtitle="Optional subtitle">
        <HeaderLabel label="Owner" value="Team X" />
        <HeaderLabel label="Lifecycle" value="Alpha" />
      </Header>
      <Content>
        <ContentHeader title="Plugin title">
          <SupportButton>A description of your plugin goes here.</SupportButton>
        </ContentHeader>
        <Grid container spacing={3} direction="column">
          <Grid item>
            {schema ? <SchemaViewer schema={schema} /> : 'No schema available'}
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
