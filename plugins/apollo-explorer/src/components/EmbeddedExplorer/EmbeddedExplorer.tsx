/*
 * Copyright 2022 The Backstage Authors
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
// import { Typography, Grid } from '@material-ui/core';
import {
  // InfoCard,
  Header,
  Page,
  Content,
  // ContentHeader,
  HeaderLabel,
  // SupportButton,
} from '@backstage/core-components';
import { ApolloExplorerReact } from '@apollo/explorer';
import './style.css';

export const EmbeddedExplorer = () => (
  <Page themeId="tool">
    <Header title="Apollo Studio Explorer">
      {' '}
      {/* subtitle="Optional subtitle"> */}
      <HeaderLabel label="Owner" value="Apollo GraphQL" />
      <HeaderLabel label="Lifecycle" value="Alpha" />
    </Header>
    <Content noPadding stretch>
      <ApolloExplorerReact
        className="embeddableExplorer"
        graphRef="acephei@current"
        endpointUrl="https://acephei-gateway.herokuapp.com"
        initialState={{
          document: `query Example {
            me {
              id
            }
          }`,
          variables: {
            test: 'abcxyz',
          },
          displayOptions: {
            showHeadersAndEnvVars: true,
          },
        }}
      />
      {/* <ContentHeader title="Plugin title">
        <SupportButton>The Apollo Studio Explorer is a powerful web IDE for creating, running, and managing GraphQL operations.</SupportButton>
      </ContentHeader> */}
      {/* <Grid container spacing={3} direction="column">
        {/* <Grid item>
          <InfoCard title="Information card">
            <Typography variant="body1">
              All content should be wrapped in a card like this.
            </Typography>
          </InfoCard>
        </Grid> */}
      {/* <Grid item>
          <ExampleFetchComponent />
        </Grid>
      </Grid> */}
    </Content>
  </Page>
);
