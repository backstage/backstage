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
import { ApolloExplorer as ApolloExplorerReact } from '@apollo/explorer/react';
import { makeStyles } from '@material-ui/core';
import { JSONObject } from '@apollo/explorer/src/helpers/types';

const useStyles = makeStyles(() => ({
  explorer: {
    height: '100%',
  },
}));

type PluginProps = {
  title?: string;
  subtitle?: string | undefined;
};

type GraphProps = {
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

type Props = PluginProps & GraphProps;

export const ApolloExplorer = ({
  graphRef,
  persistExplorerState = true,
  initialState,
  title = 'Welcome to the Apollo Explorer 👩‍🚀',
  subtitle,
}: Props) => {
  const classes = useStyles();
  return (
    <Page themeId="tool">
      <Header title={title} subtitle={subtitle ?? ''} />
      <Content>
        <ApolloExplorerReact
          className={classes.explorer}
          graphRef={graphRef}
          persistExplorerState={persistExplorerState}
          initialState={initialState}
        />
      </Content>
    </Page>
  );
};
