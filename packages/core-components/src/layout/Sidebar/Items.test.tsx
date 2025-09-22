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
      ).toHaveStyle(`background-color: transparent`);
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
