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
import { Content, Header, Page } from '@backstage/core-components';
import { ApolloExplorerBrowser } from '../ApolloExplorerBrowser';
import { JSONObject } from '@apollo/explorer/src/helpers/types';
import { ApiHolder, useApiHolder } from '@backstage/core-plugin-api';
import { useAsync } from 'react-use';
import { CircularProgress } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

type EndpointProps = {
  title: string;
  graphRef: string;
  persistExplorerState?: boolean;
  initialState?: {
    document?: string;
    variables?: JSONObject;
    headers?: Record<string, string>;
    displayOptions: {
      docsPanelState?: 'open' | 'closed';
      showHeadersAndEnvVars?: boolean;
      theme?: 'dark' | 'light';
    };
  };
};

type EndpointPropsCallback = (options: {
  apiHolder: ApiHolder;
}) => Promise<EndpointProps[]>;

type Props = {
  title?: string | undefined;
  subtitle?: string | undefined;
  endpoints: EndpointProps[] | EndpointPropsCallback;
};

export const ApolloExplorerPage = (props: Props) => {
  const { title, subtitle, endpoints } = props;
  const apiHolder = useApiHolder();

  const { value, loading, error } = useAsync(async () => {
    if (typeof endpoints === 'function') {
      return await endpoints({ apiHolder });
    }
    return endpoints;
  }, []);

  return (
    <Page themeId="tool">
      <Header title={title ?? 'Apollo Explorer 👩‍🚀'} subtitle={subtitle ?? ''} />
      <Content noPadding>
        {loading && <CircularProgress style={{ padding: 5 }} />}
        {error && <Alert severity="error">{error?.message}</Alert>}
        {value && <ApolloExplorerBrowser endpoints={value} />}
      </Content>
    </Page>
  );
};
