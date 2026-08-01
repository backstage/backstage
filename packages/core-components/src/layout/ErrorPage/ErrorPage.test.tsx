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

import { fireEvent, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { appHistoryApiRef } from '@backstage/frontend-plugin-api';
import { createMockAppHistory } from '@backstage/frontend-test-utils';
import { ErrorPage } from './ErrorPage';
import { Link } from '../../components/Link';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';

describe('<ErrorPage/>', () => {
  it('should render with status code, status message and go back link', async () => {
    const { getByText, getByTestId } = await renderInTestApp(
      <ErrorPage status="404" statusMessage="PAGE NOT FOUND" />,
    );
    expect(getByText(/page not found/i)).toBeInTheDocument();
    expect(getByText(/404/i)).toBeInTheDocument();
    expect(
      getByText(/looks like someone dropped the mic!/i),
    ).toBeInTheDocument();
    expect(getByTestId('go-back-link')).toBeInTheDocument();
  });

  it('should render with additional information of type string', async () => {
    const { getByText } = await renderInTestApp(
      <ErrorPage
        status="404"
        statusMessage="PAGE NOT FOUND"
        additionalInfo="This is a string based additional information"
      />,
    );
    expect(
      getByText(/looks like someone dropped the mic!/i),
    ).toBeInTheDocument();
    expect(
      getByText(/This is a string based additional information/i),
    ).toBeInTheDocument();
  });

  it('should render with additional information including link', async () => {
    const { getByText } = await renderInTestApp(
      <ErrorPage
        status="404"
        statusMessage="PAGE NOT FOUND"
        additionalInfo={
          <>
            This is some additional information including{' '}
            <Link to="/test">a link</Link>
          </>
        }
      />,
    );
    expect(
      getByText(/looks like someone dropped the mic!/i),
    ).toBeInTheDocument();
    expect(getByText(/a link/i)).toBeInTheDocument();
    expect(getByText(/a link/i)).toHaveAttribute('href', '/test');
  });

  it('should render with default support url if supportUrl is not provided', async () => {
    const { getByText } = await renderInTestApp(
      <ErrorPage status="404" statusMessage="PAGE NOT FOUND" />,
    );
    expect(
      getByText(/looks like someone dropped the mic!/i),
    ).toBeInTheDocument();
    expect(getByText(/contact support/i)).toBeInTheDocument();
    expect(getByText(/contact support/i)).toHaveAttribute(
      'href',
      'https://github.com/backstage/backstage/issues',
    );
  });

  it('should override support url if supportUrl property is provided', async () => {
    const { getByText } = await renderInTestApp(
      <ErrorPage
        status="404"
        statusMessage="PAGE NOT FOUND"
        supportUrl="https://error-page-test-support-url.com"
      />,
    );
    expect(
      getByText(/looks like someone dropped the mic!/i),
    ).toBeInTheDocument();
    expect(getByText(/contact support/i)).toBeInTheDocument();
    expect(getByText(/contact support/i)).toHaveAttribute(
      'href',
      'https://error-page-test-support-url.com',
    );
  });

  it('should render show details if stack is provided', async () => {
    const { getByText } = await renderInTestApp(
      <ErrorPage
        status="500"
        statusMessage="INTERNAL ERROR"
        stack="this is my stack trace!"
      />,
    );
    expect(getByText(/Show more details/i)).toBeInTheDocument();
  });

  describe('go back link', () => {
    /** Renders the location the ambient React Router is at. */
    function CurrentLocation() {
      const { pathname } = useLocation();
      return <p>at {pathname}</p>;
    }

    it('goes back a page without an app history (OFS)', async () => {
      // A real browser router rather than the default in-memory one: going
      // back is only observable in the history the app actually runs on, and
      // this is the history a deployed app has.
      window.history.pushState({}, '', '/ofs-one');
      window.history.pushState({}, '', '/ofs-two');

      await renderInTestApp(
        <>
          <ErrorPage status="404" statusMessage="PAGE NOT FOUND" />
          <CurrentLocation />
        </>,
        {
          components: {
            Router: ({ children }) => <BrowserRouter>{children}</BrowserRouter>,
          },
        },
      );
      expect(screen.getByText('at /ofs-two')).toBeInTheDocument();

      fireEvent.click(screen.getByTestId('go-back-link'));

      expect(await screen.findByText('at /ofs-one')).toBeInTheDocument();
      expect(window.location.pathname).toBe('/ofs-one');
    });

    it('goes back through the browser, leaving the router alone, when an app history is registered (NFS)', async () => {
      window.history.pushState({}, '', '/nfs-one');
      window.history.pushState({}, '', '/nfs-two');
      const appHistory = createMockAppHistory({ initialLocation: '/nfs-two' });

      await renderInTestApp(
        <TestApiProvider apis={[[appHistoryApiRef, appHistory]]}>
          <ErrorPage status="404" statusMessage="PAGE NOT FOUND" />
          <CurrentLocation />
        </TestApiProvider>,
        { routeEntries: ['/router-one', '/router-two'] },
      );

      fireEvent.click(screen.getByTestId('go-back-link'));

      // The app history has no `go()` of its own and listens for `popstate`, so
      // the browser is what goes back. The ambient router is a separate history
      // here, and stays where it was rather than being popped a second time.
      await waitFor(() => expect(window.location.pathname).toBe('/nfs-one'));
      expect(screen.getByText('at /router-two')).toBeInTheDocument();
      expect(appHistory.navigateCalls).toEqual([]);
    });
  });
});
