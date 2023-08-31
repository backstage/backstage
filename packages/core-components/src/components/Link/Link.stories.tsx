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
import { createRouteRef, useRouteRef } from '@backstage/core-plugin-api';
import { wrapInTestApp } from '@backstage/test-utils';
import React, { PropsWithChildren } from 'react';
import {
  Route,
  NavLink as RouterNavLink,
  Routes,
  useLocation,
} from 'react-router-dom';
import { Link } from './Link';

const routeRef = createRouteRef({
  id: 'storybook.test-route',
});

const Location = () => {
  const location = useLocation();
  return <pre>Current location: {location.pathname}</pre>;
};

export default {
  title: 'Navigation/Link',
  component: Link,
  decorators: [
    (Story: (props: PropsWithChildren<{}>) => JSX.Element) =>
      wrapInTestApp(
        <div>
          <div>
            <Location />
          </div>
          <Story />
        </div>,
        { mountedRoutes: { '/hello': routeRef } },
      ),
  ],
};

export const Default = () => {
  const link = useRouteRef(routeRef);

  return (
    <>
      <Link to={link()}>This link</Link>&nbsp;will utilize the react-router
      MemoryRouter's navigation
      <Routes>
        <Route path={link()} element={<h1>Hi there!</h1>} />
      </Routes>
    </>
  );
};

export const PassProps = () => {
  const link = useRouteRef(routeRef);

  return (
    <>
      <Link
        to={link()}
        /** react-router-dom related prop */
        component={RouterNavLink}
        /** material-ui related prop */
        color="secondary"
      >
        This link
      </Link>
      &nbsp;has props for both material-ui's component as well as for
      react-router-dom's
      <Routes>
        <Route path={link()} element={<h1>Hi there!</h1>} />
      </Routes>
    </>
  );
};
PassProps.story = {
  name: `Accepts material-ui Link's and react-router-dom Link's props`,
};
