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

import {
  mockApis,
  TestApiProvider,
  renderInTestApp,
} from '@backstage/test-utils';
import { renderInTestApp as renderInFrontendTestApp } from '@backstage/frontend-test-utils';
import { createEvent, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HomeIcon from '@material-ui/icons/Home';
import CreateComponentIcon from '@material-ui/icons/AddCircleOutline';
import { Sidebar } from './Bar';
import { SidebarItem, SidebarSearchField, SidebarExpandButton } from './Items';
import { renderHook } from '@testing-library/react';
import { makeStyles } from '@material-ui/core/styles';
import { analyticsApiRef } from '@backstage/core-plugin-api';

const useStyles = makeStyles({
  spotlight: {
    backgroundColor: '#2b2a2a',
  },
});

const handleSidebarItemClick = jest.fn();
const analyticsApiMock = mockApis.analytics();

async function renderSidebar() {
  const { result } = renderHook(() => useStyles());

  await renderInTestApp(
    <TestApiProvider apis={[[analyticsApiRef, analyticsApiMock]]}>
      <Sidebar>
        <SidebarSearchField onSearch={() => {}} to="/search" />
        <SidebarItem text="Home" icon={HomeIcon} to="./" />
        <SidebarItem
          icon={CreateComponentIcon}
          onClick={handleSidebarItemClick}
          text="Create..."
          className={result.current.spotlight}
        />
        <SidebarItem
          icon={CreateComponentIcon}
          to="/docs"
          onClick={handleSidebarItemClick}
          text="Docs"
          className={result.current.spotlight}
        />
        <SidebarItem
          icon={CreateComponentIcon}
          to="/explore"
          onClick={handleSidebarItemClick}
          text="Explore"
          className={result.current.spotlight}
          noTrack
        />
        <SidebarExpandButton />
      </Sidebar>
    </TestApiProvider>,
  );
  await userEvent.hover(screen.getByTestId('sidebar-root'));
}

// A bare relative target is by far the most common way sidebar items are
// written in the wild: an ecosystem scan of `backstage/community-plugins` found
// around 130 of them, four of which are shipped sidebar components that
// adopters mount straight into their own sidebar. The empty and `./` forms are
// in here too, because they mean "the app root" rather than "wherever the user
// happens to be right now".
const relativeTargets = [
  { text: 'Copilot', to: 'copilot', href: '/copilot' },
  { text: 'RBAC', to: 'rbac', href: '/rbac' },
  { text: 'Apiiro', to: 'apiiro', href: '/apiiro' },
  { text: 'Mend', to: 'mend', href: '/mend' },
  { text: 'Catalog', to: 'catalog', href: '/catalog' },
  { text: 'Empty', to: '', href: '/' },
  { text: 'Dot slash', to: './', href: '/' },
];

const relativeTargetsAnalyticsApi = mockApis.analytics();

function RelativeTargetSidebar() {
  return (
    <TestApiProvider apis={[[analyticsApiRef, relativeTargetsAnalyticsApi]]}>
      <Sidebar>
        {relativeTargets.map(({ text, to }) => (
          <SidebarItem key={text} text={text} icon={HomeIcon} to={to} />
        ))}
      </Sidebar>
    </TestApiProvider>
  );
}

// The sidebar renders as app-root chrome in both frontend systems, so both
// resolve these targets against the app root rather than the route the browser
// happens to be sitting on.
const relativeTargetRenderers: Array<
  [string, (path: string) => Promise<void>]
> = [
  [
    'old frontend system',
    async path => {
      await renderInTestApp(<RelativeTargetSidebar />, {
        routeEntries: [path],
      });
    },
  ],
  [
    'new frontend system',
    async path => {
      renderInFrontendTestApp(<RelativeTargetSidebar />, {
        initialRouteEntries: [path],
      });
    },
  ],
];

describe.each(relativeTargetRenderers)(
  'SidebarItem relative targets (%s)',
  (_system, renderSidebarAt) => {
    // The location the original bug surfaced at: deep inside a different plugin
    // than the one the sidebar item points to.
    const deepLocation = '/catalog/default/component/foo';

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('points at the app root while the browser is deep inside another plugin', async () => {
      await renderSidebarAt(deepLocation);

      await screen.findByRole('link', { name: 'RBAC' });
      for (const { text, href } of relativeTargets) {
        expect(screen.getByRole('link', { name: text })).toHaveAttribute(
          'href',
          href,
        );
      }

      // `catalog` is the one item that owns the current location, so it is the
      // only one highlighted. An empty target that resolved against the current
      // location instead would light up on every page in the app.
      expect(screen.getByRole('link', { name: 'Catalog' })).toHaveAttribute(
        'aria-current',
        'page',
      );
      for (const { text } of relativeTargets.filter(
        each => each.text !== 'Catalog',
      )) {
        expect(screen.getByRole('link', { name: text })).not.toHaveAttribute(
          'aria-current',
        );
      }
    });

    it('highlights the plugin whose relative target is the current page', async () => {
      await renderSidebarAt('/rbac');

      // `to="rbac"` means `/rbac`. Resolved against the current location it
      // would mean `/rbac/rbac`, and the item would never highlight at all.
      expect(await screen.findByRole('link', { name: 'RBAC' })).toHaveAttribute(
        'aria-current',
        'page',
      );
      for (const { text } of relativeTargets.filter(
        each => each.text !== 'RBAC',
      )) {
        expect(screen.getByRole('link', { name: text })).not.toHaveAttribute(
          'aria-current',
        );
      }
    });

    it('reports the app-root resolved target to analytics', async () => {
      await renderSidebarAt(deepLocation);

      await userEvent.click(
        await screen.findByRole('link', { name: 'Dot slash' }),
      );

      // Resolved against the current location this would have been
      // `/catalog/default/component/foo/`.
      expect(relativeTargetsAnalyticsApi.captureEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'click',
          subject: 'Dot slash',
          attributes: { to: '/' },
        }),
      );
    });
  },
);

describe('Items', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await renderSidebar();
  });

  describe('SidebarItem', () => {
    it('should render a link when `to` prop provided', async () => {
      expect(
        await screen.findByRole('link', { name: /home/i }),
      ).toBeInTheDocument();
    });

    it('should render a button when `to` prop is not provided', async () => {
      expect(
        await screen.findByRole('button', { name: /create/i }),
      ).toBeInTheDocument();
    });

    it('should render a button with custom style', async () => {
      expect(
        await screen.findByRole('button', { name: /create/i }),
      ).toHaveStyle(`background-color: rgba(0, 0, 0, 0)`); // transparent
    });

    it('should send button clicks to analytics', async () => {
      await userEvent.click(
        await screen.findByRole('button', { name: /create/i }),
      );
      expect(handleSidebarItemClick).toHaveBeenCalledTimes(1);
      expect(analyticsApiMock.captureEvent).toHaveBeenCalledWith({
        action: 'click',
        subject: 'Create...',
        context: { routeRef: 'unknown', pluginId: 'root', extension: 'App' },
        attributes: { to: '/' },
      });
    });

    it('should send link clicks to analytics', async () => {
      await userEvent.click(await screen.findByRole('link', { name: /docs/i }));
      expect(handleSidebarItemClick).toHaveBeenCalledTimes(1);
      expect(analyticsApiMock.captureEvent).toHaveBeenCalledWith({
        action: 'click',
        subject: 'Docs',
        context: { routeRef: 'unknown', pluginId: 'root', extension: 'App' },
        attributes: { to: '/docs' },
      });
    });

    it('should not send clicks to analytics when tracking is disabled', async () => {
      await userEvent.click(
        await screen.findByRole('link', { name: /explore/i }),
      );
      expect(analyticsApiMock.captureEvent).not.toHaveBeenCalled();
    });
  });

  describe('SidebarSearchField', () => {
    it('should be defaultPrevented when enter is pressed', async () => {
      const searchEvent = createEvent.keyDown(
        await screen.findByPlaceholderText('Search'),
        { key: 'Enter', code: 'Enter', charCode: 13 },
      );
      fireEvent(await screen.findByPlaceholderText('Search'), searchEvent);
      expect(searchEvent.defaultPrevented).toBeTruthy();
    });
  });
});
