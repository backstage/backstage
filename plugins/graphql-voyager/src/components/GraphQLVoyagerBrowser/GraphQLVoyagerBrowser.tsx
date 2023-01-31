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
import {
  GraphQLVoyagerEndpoint,
  introspectionQuery,
} from '../../lib/api/types';
import { useState } from 'react';
import { makeStyles, Tab, Tabs, Typography } from '@material-ui/core';
import React, { Suspense } from 'react';
import { BackstageTheme } from '@backstage/theme';
import { Content, ErrorPanel, Progress } from '@backstage/core-components';
import { Voyager } from 'graphql-voyager';
import useAsync from 'react-use/lib/useAsync';

const useStyles = makeStyles<BackstageTheme>(() => ({
  root: {
    height: '100%',
    display: 'flex',
    flexFlow: 'column nowrap',
  },
}));

type GraphQLVoyagerBrowserProps = {
  endpoints: GraphQLVoyagerEndpoint[];
};

const NoEndpoints = () => {
  return <Typography variant="h4">No endpoints available</Typography>;
};

const VoyagerBrowserContent = ({
  endpoint,
}: {
  endpoint: GraphQLVoyagerEndpoint;
}) => {
  const { id, introspection, introspectionErrorMessage, voyagerProps } =
    endpoint;
  const { value, loading, error } = useAsync(
    () => introspection(introspectionQuery),
    [endpoint],
  );

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ErrorPanel error={error} />;
  }
  return value.data ? (
    <Voyager key={id} introspection={value} {...voyagerProps} />
  ) : (
    <Typography variant="h4" color="error">
      {introspectionErrorMessage}
    </Typography>
  );
};

const VoyagerBrowser = (props: GraphQLVoyagerBrowserProps) => {
  const { endpoints } = props;
  const [tabIndex, setTabIndex] = useState(0);
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Suspense fallback={<Progress />}>
        <Tabs
          value={tabIndex}
          onChange={(_, value) => setTabIndex(value)}
          indicatorColor="primary"
        >
          {endpoints.map(({ title, id }, index) => (
            <Tab key={id} label={title} value={index} />
          ))}
        </Tabs>
        <Content>
          <VoyagerBrowserContent endpoint={endpoints[tabIndex]} />
        </Content>
      </Suspense>
    </div>
  );
};

/** @public */
export const GraphQLVoyagerBrowser = (props: GraphQLVoyagerBrowserProps) => {
  const hasEndpoints = checkEndpoints(props);

  if (!hasEndpoints) {
    return <NoEndpoints />;
  }
  return <VoyagerBrowser {...props} />;
};

function checkEndpoints(props: GraphQLVoyagerBrowserProps) {
  return props.endpoints.length;
}
