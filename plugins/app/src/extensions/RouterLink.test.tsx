/*
 * Copyright 2026 The Backstage Authors
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
  appHistoryApiRef,
  RouterLink,
  useAppLocation,
  useHref,
  type AppNode,
} from '@backstage/frontend-plugin-api';
import {
  createMockAppHistory,
  mockApis,
  TestApiProvider,
} from '@backstage/frontend-test-utils';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import {
  Link,
  Tabs,
  TabList,
  Tab,
  Menu,
  MenuItem,
} from 'react-aria-components';

const mockNode = {} as AppNode;
jest.mock(
  '../../../../packages/frontend-plugin-api/src/components/AppNodeProvider',
  () => ({
    ...jest.requireActual(
      '../../../../packages/frontend-plugin-api/src/components/AppNodeProvider',
    ),
    useAppNode: () => mockNode,
  }),
);

describe('RouterLink composition', () => {
  const history = createMockAppHistory({
    basename: '/app',
    initialLocation: '/app/tools',
  });
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <TestApiProvider
      apis={[
        [appHistoryApiRef, history],
        mockApis.routeResolution({
          resolvePath: { matches: [{ node: mockNode, basePath: '/tools' }] },
        }),
      ]}
    >
      {children}
    </TestApiProvider>
  );

  beforeEach(() => {
    history.navigate('/tools', { replace: true });
    history.navigateCalls.length = 0;
  });

  it('composes an accessible link with refs, events, options, and native interactions', async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLAnchorElement>();
    const onClick = jest.fn();
    const { rerender } = render(
      <Link
        href="details"
        ref={ref}
        className="custom-link"
        onClick={onClick}
        render={props =>
          'href' in props ? (
            <RouterLink {...props} replace state={{ source: 'link' }} />
          ) : (
            <span {...props} />
          )
        }
      >
        Details
      </Link>,
      { wrapper },
    );
    const link = screen.getByRole('link', { name: 'Details' });
    expect(ref.current).toBe(link);
    expect(link).toHaveAttribute('href', '/app/tools/details');
    expect(link).toHaveClass('custom-link');
    await user.tab();
    expect(link).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(history.navigateCalls).toHaveLength(1);
    expect(history.location).toMatchObject({
      pathname: '/tools/details',
      state: { source: 'link' },
    });
    expect(history.navigateCalls[0].options?.replace).toBe(true);
    expect(onClick).toHaveBeenCalled();

    rerender(
      <Link
        href="cancelled"
        onClick={event => event.preventDefault()}
        render={props =>
          'href' in props ? <RouterLink {...props} /> : <span {...props} />
        }
      >
        Cancelled
      </Link>,
    );
    await user.click(screen.getByRole('link', { name: 'Cancelled' }));
    expect(history.navigateCalls).toHaveLength(1);
  });

  it('composes navigable menu items without a router provider', async () => {
    const user = userEvent.setup();
    render(
      <Menu aria-label="Tool actions">
        <MenuItem
          id="details"
          href="details"
          render={props =>
            'href' in props ? <RouterLink {...props} /> : <div {...props} />
          }
        >
          Details
        </MenuItem>
      </Menu>,
      { wrapper },
    );
    const item = screen.getByRole('menuitem', { name: 'Details' });
    expect(item).toHaveAttribute('href', '/app/tools/details');
    await user.click(item);
    expect(history.location.pathname).toBe('/tools/details');
    expect(history.navigateCalls).toHaveLength(1);
  });

  it('composes navigable tabs and tracks selection through history traversal', async () => {
    const user = userEvent.setup();
    function ToolTabs() {
      const location = useAppLocation();
      const currentHref = useHref(location.pathname);
      const detailsHref = useHref('details');
      const selectedKey = currentHref === detailsHref ? 'details' : 'overview';
      return (
        <Tabs selectedKey={selectedKey}>
          <TabList aria-label="Tool">
            <Tab
              id="overview"
              href="."
              render={props =>
                'href' in props ? <RouterLink {...props} /> : <div {...props} />
              }
            >
              Overview
            </Tab>
            <Tab
              id="details"
              href="details"
              render={props =>
                'href' in props ? <RouterLink {...props} /> : <div {...props} />
              }
            >
              Details
            </Tab>
          </TabList>
        </Tabs>
      );
    }
    render(<ToolTabs />, { wrapper });
    const overview = screen.getByRole('tab', { name: 'Overview' });
    const details = screen.getByRole('tab', { name: 'Details' });
    expect(overview).toHaveAttribute('aria-selected', 'true');
    expect(details).toHaveAttribute('href', '/app/tools/details');
    await user.click(details);
    expect(history.location.pathname).toBe('/tools/details');
    expect(details).toHaveAttribute('aria-selected', 'true');
    expect(history.navigateCalls).toHaveLength(1);

    act(() => history.navigate(-1));
    expect(overview).toHaveAttribute('aria-selected', 'true');
    overview.focus();
    await user.keyboard('{ArrowRight}{Enter}');
    expect(history.location.pathname).toBe('/tools/details');
    expect(details).toHaveAttribute('aria-selected', 'true');
  });
});
