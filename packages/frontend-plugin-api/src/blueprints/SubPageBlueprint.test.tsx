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

import { act, screen, waitFor } from '@testing-library/react';
import { renderTestApp } from '@backstage/frontend-test-utils';
import { Link, useLocation } from 'react-router-dom';
import type { PageRouterComponent } from '../apis/definitions/PageRouterApi';
import { PageBlueprint } from './PageBlueprint';
import { PageRouterBlueprint } from './PageRouterBlueprint';
import { SubPageBlueprint } from './SubPageBlueprint';
import { useRoutingContract } from '../routing/RoutingContractContext';

describe('SubPageBlueprint', () => {
  it('should expose an optional singleton router input', () => {
    const subPage = SubPageBlueprint.make({
      name: 'overview',
      params: {
        path: 'overview',
        title: 'Overview',
        loader: async () => <div>Overview</div>,
      },
    });

    expect(subPage.inputs.router).toEqual(
      expect.objectContaining({
        $$type: '@backstage/ExtensionInput',
        config: expect.objectContaining({
          optional: true,
          singleton: true,
        }),
      }),
    );
  });

  it('should give each subpage its own contract at parentBase + / + subPath', async () => {
    // Unnamed parent → page:test; named subpages attach relatively (same as
    // production plugins such as app-visualizer).
    const parentPage = PageBlueprint.make({
      params: {
        path: '/devtools',
        title: 'DevTools',
      },
    });

    const infoSubPage = SubPageBlueprint.make({
      name: 'info',
      params: {
        path: 'info',
        title: 'Info',
        loader: async () => {
          const Probe = () => {
            const contract = useRoutingContract();
            return (
              <div data-testid="info-page">
                <div data-testid="contract-base">{contract.basePath}</div>
              </div>
            );
          };
          return <Probe />;
        },
      },
    });

    const configSubPage = SubPageBlueprint.make({
      name: 'config',
      params: {
        path: 'config',
        title: 'Config',
        loader: async () => {
          const Probe = () => {
            const contract = useRoutingContract();
            return (
              <div data-testid="config-page">
                <div data-testid="contract-base">{contract.basePath}</div>
              </div>
            );
          };
          return <Probe />;
        },
      },
    });

    const { unmount } = renderTestApp({
      extensions: [parentPage, infoSubPage, configSubPage],
      initialRouteEntries: ['/devtools/info'],
    });

    await waitFor(() => {
      expect(screen.getByTestId('info-page')).toBeInTheDocument();
      expect(screen.getByTestId('contract-base')).toHaveTextContent(
        '/devtools/info',
      );
    });

    unmount();

    renderTestApp({
      extensions: [parentPage, infoSubPage, configSubPage],
      initialRouteEntries: ['/devtools/config'],
    });

    await waitFor(() => {
      expect(screen.getByTestId('config-page')).toBeInTheDocument();
      expect(screen.getByTestId('contract-base')).toHaveTextContent(
        '/devtools/config',
      );
    });
  });

  it('should resolve an empty subpage router input via the API-holder default', async () => {
    const parentPage = PageBlueprint.make({
      params: {
        path: '/settings',
        title: 'Settings',
      },
    });

    const generalSubPage = SubPageBlueprint.make({
      name: 'general',
      params: {
        path: 'general',
        title: 'General',
        loader: async () => {
          // useLocation only works if a page adapter wrapped this subpage
          // (empty router input → pageRouterApiRef default).
          const Probe = () => {
            const location = useLocation();
            const contract = useRoutingContract();
            return (
              <div data-testid="general-page">
                <div data-testid="pathname">{location.pathname}</div>
                <div data-testid="contract-base">{contract.basePath}</div>
              </div>
            );
          };
          return <Probe />;
        },
      },
    });

    renderTestApp({
      extensions: [parentPage, generalSubPage],
      initialRouteEntries: ['/settings/general'],
    });

    await waitFor(() => {
      expect(screen.getByTestId('general-page')).toBeInTheDocument();
      expect(screen.getByTestId('contract-base')).toHaveTextContent(
        '/settings/general',
      );
      expect(screen.getByTestId('pathname')).toHaveTextContent(
        '/settings/general',
      );
    });
  });

  it('should allow a subpage router override while the parent stays on the default', async () => {
    const CustomSubpageRouter: PageRouterComponent = ({
      contract,
      children,
    }) => (
      <div data-testid="custom-subpage-router" data-base={contract.basePath}>
        {children}
      </div>
    );

    const parentPage = PageBlueprint.make({
      params: {
        path: '/visualizer',
        title: 'Visualizer',
      },
    });

    const treeSubPage = SubPageBlueprint.make({
      name: 'tree',
      params: {
        path: 'tree',
        title: 'Tree',
        loader: async () => {
          const Probe = () => {
            const contract = useRoutingContract();
            return (
              <div data-testid="tree-page">
                <div data-testid="tree-contract">{contract.basePath}</div>
              </div>
            );
          };
          return <Probe />;
        },
      },
    });

    // renderTestApp mounts extensions under pluginId "test"
    const treeRouter = PageRouterBlueprint.make({
      name: 'tree-router',
      attachTo: { id: 'sub-page:test/tree', input: 'router' },
      params: {
        component: CustomSubpageRouter,
      },
    });

    const detailedSubPage = SubPageBlueprint.make({
      name: 'detailed',
      params: {
        path: 'detailed',
        title: 'Detailed',
        loader: async () => {
          const Probe = () => {
            const contract = useRoutingContract();
            return (
              <div data-testid="detailed-page">
                <div data-testid="detailed-contract">{contract.basePath}</div>
              </div>
            );
          };
          return <Probe />;
        },
      },
    });

    const { unmount } = renderTestApp({
      extensions: [parentPage, treeSubPage, treeRouter, detailedSubPage],
      initialRouteEntries: ['/visualizer/tree'],
    });

    await waitFor(() => {
      expect(screen.getByTestId('tree-page')).toBeInTheDocument();
      expect(screen.getByTestId('custom-subpage-router')).toHaveAttribute(
        'data-base',
        '/visualizer/tree',
      );
      expect(screen.getByTestId('tree-contract')).toHaveTextContent(
        '/visualizer/tree',
      );
    });

    unmount();

    renderTestApp({
      extensions: [parentPage, treeSubPage, treeRouter, detailedSubPage],
      initialRouteEntries: ['/visualizer/detailed'],
    });

    await waitFor(() => {
      expect(screen.getByTestId('detailed-page')).toBeInTheDocument();
      expect(
        screen.queryByTestId('custom-subpage-router'),
      ).not.toBeInTheDocument();
      expect(screen.getByTestId('detailed-contract')).toHaveTextContent(
        '/visualizer/detailed',
      );
    });
  });

  it('should keep relative subpage routes and tabbed layouts working under parent/child scopes', async () => {
    const parentPage = PageBlueprint.make({
      params: {
        path: '/create',
        title: 'Scaffolder',
      },
    });

    const templatesSubPage = SubPageBlueprint.make({
      name: 'templates',
      params: {
        path: 'templates',
        title: 'Templates',
        loader: async () => {
          const Templates = () => {
            const location = useLocation();
            const contract = useRoutingContract();
            return (
              <div data-testid="templates-page">
                <div data-testid="pathname">{location.pathname}</div>
                <div data-testid="contract-base">{contract.basePath}</div>
                <Link to="./actions" data-testid="relative-link">
                  Actions
                </Link>
              </div>
            );
          };
          return <Templates />;
        },
      },
    });

    const tasksSubPage = SubPageBlueprint.make({
      name: 'tasks',
      params: {
        path: 'tasks',
        title: 'Tasks',
        loader: async () => <div data-testid="tasks-page">Tasks</div>,
      },
    });

    const { navigationController } = renderTestApp({
      extensions: [parentPage, templatesSubPage, tasksSubPage],
      initialRouteEntries: ['/create/templates'],
    });

    await waitFor(() => {
      expect(screen.getByTestId('templates-page')).toBeInTheDocument();
      expect(screen.getByTestId('pathname')).toHaveTextContent(
        '/create/templates',
      );
      expect(screen.getByTestId('contract-base')).toHaveTextContent(
        '/create/templates',
      );
      expect(screen.getByTestId('relative-link')).toHaveAttribute(
        'href',
        '/create/templates/actions',
      );
      // Tabbed layout still renders sibling tabs from the parent page.
      expect(
        screen.getByRole('tab', { name: 'Templates' }),
      ).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Tasks' })).toBeInTheDocument();
    });

    await act(async () => {
      navigationController.navigate('/create/tasks');
    });

    await waitFor(() => {
      expect(screen.getByTestId('tasks-page')).toBeInTheDocument();
    });
  });
});
