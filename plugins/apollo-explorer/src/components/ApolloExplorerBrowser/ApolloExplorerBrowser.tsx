/*
 * Copyright 2020 The Backstage Authors
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
import React, { useState } from 'react';
import { Divider, makeStyles, Tab, Tabs } from '@material-ui/core';
import { BackstageTheme } from '@backstage/theme';
import { JSONObject } from '@apollo/explorer/src/helpers/types';
import { ApolloExplorer } from '@apollo/explorer/react';
import { Content } from '@backstage/core-components';

const useStyles = makeStyles<BackstageTheme>(theme => ({
  tabs: {
    background: theme.palette.background.paper,
  },
  root: {
    height: '100%',
  },
  content: {
    height: '100%',
  },
  explorer: {
    height: '95%',
  },
}));

export type ApolloEndpointProps = {
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

type Props = {
  endpoints: ApolloEndpointProps[];
};

export const ApolloExplorerBrowser = ({ endpoints }: Props) => {
  const classes = useStyles();
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <div className={classes.root}>
      <Tabs
        classes={{ root: classes.tabs }}
        value={tabIndex}
        onChange={(_, value) => setTabIndex(value)}
        indicatorColor="primary"
      >
        {endpoints.map(({ title }, index) => (
          <Tab key={index} label={title} value={index} />
        ))}
      </Tabs>
      <Divider />
      <Content className={classes.content}>
        <ApolloExplorer
          className={classes.explorer}
          graphRef={endpoints[tabIndex].graphRef}
          persistExplorerState={endpoints[tabIndex].persistExplorerState}
          initialState={endpoints[tabIndex].initialState}
        />
      </Content>
    </div>
  );
};
