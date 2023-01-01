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

import React, { useState, Suspense } from 'react';
import { Tabs, Tab, Typography, Divider } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import 'graphiql/graphiql.css';
import { StorageBucket } from '../../lib/storage';
import { GraphQLEndpoint } from '../../lib/api';
import { Progress } from '@backstage/core-components';

const GraphiQL = React.lazy(() =>
  import('graphiql').then(m => ({ default: m.GraphiQL })),
);

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    display: 'flex',
    flexFlow: 'column nowrap',
  },
  tabs: {
    background: theme.palette.background.paper,
  },
  graphiQlWrapper: {
    flex: 1,
    '@global': {
      '.graphiql-container': {
        boxSizing: 'initial',
      },
    },
  },
}));

type GraphiQLBrowserProps = {
  endpoints: GraphQLEndpoint[];
};

export const GraphiQLBrowser = (props: GraphiQLBrowserProps) => {
  const { endpoints } = props;

  const classes = useStyles();
  const [tabIndex, setTabIndex] = useState(0);

  if (!endpoints.length) {
    return <Typography variant="h4">No endpoints available</Typography>;
  }

  const { id, fetcher } = endpoints[tabIndex];
  const storage = StorageBucket.forLocalStorage(`plugin/graphiql/data/${id}`);

  return (
    <div className={classes.root}>
      <Suspense fallback={<Progress />}>
        <Tabs
          classes={{ root: classes.tabs }}
          value={tabIndex}
          onChange={(_, value) => setTabIndex(value)}
          textColor="inherit"
        >
          {endpoints.map(({ title }, index) => (
            <Tab
              key={index}
              label={title}
              value={index}
              sx={{ color: 'inherit' }}
            />
          ))}
        </Tabs>
        <Divider />
        <div className={classes.graphiQlWrapper}>
          <GraphiQL
            headerEditorEnabled
            key={tabIndex}
            fetcher={fetcher}
            storage={storage}
          />
        </div>
      </Suspense>
    </div>
  );
};
