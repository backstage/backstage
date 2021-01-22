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
import React, { FunctionComponentFactory } from 'react';
import { Link } from './Link';
import {
  MemoryRouter,
  Route,
  useLocation,
  NavLink as RouterNavLink,
} from 'react-router-dom';
import { createRouteRef } from '@backstage/core-api';

const Location = () => {
  const location = useLocation();
  return <pre>Current location: {location.pathname}</pre>;
};

export default {
  title: 'Navigation/Link',
  component: Link,
  decorators: [
    (storyFn: FunctionComponentFactory<{}>) => (
      <MemoryRouter>
        <div>
          <div>
            <Location />
          </div>
          {storyFn()}
        </div>
      </MemoryRouter>
    ),
  ],
};

export const Default = () => {
  const routeRef = createRouteRef({
    path: '/hello',
    title: 'Hi there!',
  });

  return (
    <>
      <Link to={routeRef.path}>This link</Link>&nbsp;will utilise the
      react-router MemoryRouter's navigation
      <Route path={routeRef.path}>
        <h1>{routeRef.title}</h1>
      </Route>
    </>
  );
};

export const PassProps = () => {
  const routeRef = createRouteRef({
    path: '/hello',
    title: 'Hi there!',
  });

  return (
    <>
      <Link
        to={routeRef.path}
        /** react-router-dom related prop */
        component={RouterNavLink}
        /** material-ui related prop */
        color="secondary"
      >
        This link
      </Link>
      &nbsp;has props for both material-ui's component as well as for
      react-router-dom's
      <Route path={routeRef.path}>
        <h1>{routeRef.title}</h1>
      </Route>
    </>
  );
};
PassProps.story = {
  name: `Accepts material-ui Link's and react-router-dom Link's props`,
};
