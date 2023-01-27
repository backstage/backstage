/*
 * Copyright 2023 The Backstage Authors
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
import { Header, Page, Content, Progress } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import 'graphql-voyager/dist/voyager.css';
import { graphQlVoyagerApiRef } from '../../lib/api';
import useAsync from 'react-use/lib/useAsync';
import { Typography } from '@material-ui/core';
import { GraphQLVoyagerBrowser } from '../GraphQLVoyagerBrowser';

/** @public */
export const GraphQLVoyagerPage = () => {
  const graphQLVoyagerApi = useApi(graphQlVoyagerApiRef);
  const { value, loading, error } = useAsync(() =>
    graphQLVoyagerApi.getEndpoints(),
  );

  let content: JSX.Element;

  if (loading) {
    content = (
      <Content>
        <Progress />
      </Content>
    );
  } else if (error) {
    content = (
      <Content>
        <Typography variant="h4" color="error">
          Failed to load GraphQL endpoints, {String(error)}
        </Typography>
      </Content>
    );
  } else {
    content = (
      <Content noPadding>
        <GraphQLVoyagerBrowser endpoints={value!} />
      </Content>
    );
  }

  return (
    <Page themeId="tool">
      <Header title="Welcome to Voyager!" />
      {content}
    </Page>
  );
};
