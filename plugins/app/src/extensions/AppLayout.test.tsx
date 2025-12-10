/*
 * Copyright 2025 The Backstage Authors
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

import { ReactNode, useEffect } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { AppLayoutComponent } from './AppLayout';
import { PluginRouteProvider, usePluginRoute } from './PluginRouteContext';

jest.mock('@backstage/core-components', () => ({
  ...jest.requireActual('@backstage/core-components'),
  SidebarPage: ({ children }: { children: ReactNode }) => (
    <div data-testid="sidebar-page">{children}</div>
  ),
}));

const navElement = <nav>Navigation</nav>;
const contentElement = <main>Content</main>;

describe('AppLayoutComponent', () => {
  it('applies the current plugin id to the layout wrapper', () => {
    render(
      <PluginRouteProvider initialPluginId="catalog">
        <AppLayoutComponent nav={navElement} content={contentElement} />
      </PluginRouteProvider>,
    );

    const wrapper = screen.getByText('Content').parentElement;
    expect(wrapper).toHaveAttribute('data-plugin', 'catalog');
  });

  it('reacts to plugin id updates from the route context', async () => {
    const PluginIdUpdater = ({ pluginId }: { pluginId: string }) => {
      const { setPluginId } = usePluginRoute();
      useEffect(() => {
        setPluginId(pluginId);
      }, [pluginId, setPluginId]);
      return null;
    };

    render(
      <PluginRouteProvider initialPluginId="app">
        <PluginIdUpdater pluginId="techdocs" />
        <AppLayoutComponent nav={navElement} content={contentElement} />
      </PluginRouteProvider>,
    );

    await waitFor(() => {
      const wrapper = screen.getByText('Content').parentElement;
      expect(wrapper).toHaveAttribute('data-plugin', 'techdocs');
    });
  });
});
