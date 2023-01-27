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
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Divider, makeStyles, Tab, Tabs, Typography } from '@material-ui/core';
import React, { Suspense } from 'react';
import { BackstageTheme } from '@backstage/theme';
import { Content, Progress } from '@backstage/core-components';
import { Voyager } from 'graphql-voyager';

const useStyles = makeStyles<BackstageTheme>(theme => ({
  root: {
    height: '100%',
    display: 'flex',
    flexFlow: 'column nowrap',
  },
  tabs: {
    background: theme.palette.background.paper,
  },
}));

type GraphQLVoyagerBrowserProps = {
  endpoints: GraphQLVoyagerEndpoint[];
};

type IntrospectionResult = {
  data?: Object;
};

const NoEndpoints = () => {
  return <Typography variant="h4">No endpoints available</Typography>;
};

const VoyagerBrowser = (props: GraphQLVoyagerBrowserProps) => {
  const { endpoints } = props;
  const [tabIndex, setTabIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [introspectionResult, setIntrospectionResult]: [
    IntrospectionResult,
    Dispatch<SetStateAction<IntrospectionResult>>,
  ] = useState({});
  const classes = useStyles();

  const {
    voyagerProps = {},
    introspectionErrorMessage,
    introspection,
  } = endpoints[tabIndex];

  useEffect(() => {
    const fetchIntrospection = async () => {
      setIsLoading(true);

      const data = await introspection(introspectionQuery);
      setIntrospectionResult(data);

      setIsLoading(false);
    };

    fetchIntrospection();
  }, [tabIndex, introspection]);

  let voyagerContent: JSX.Element;

  if (isLoading) {
    voyagerContent = <Typography variant="body1">Loading...</Typography>;
  } else if (!introspectionResult.data) {
    voyagerContent = (
      <Typography variant="h4" color="error">
        {introspectionErrorMessage}
      </Typography>
    );
  } else {
    voyagerContent = (
      <Voyager
        key={tabIndex}
        introspection={introspectionResult}
        {...voyagerProps}
      />
    );
  }

  return (
    <div className={classes.root}>
      <Suspense fallback={<Progress />}>
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
        <Content>{voyagerContent}</Content>
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
