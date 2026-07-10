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

import { screen, waitFor, within } from '@testing-library/react';
import { Route, Routes, useParams } from 'react-router-dom';
import { renderTestApp } from '@backstage/frontend-test-utils';
import {
  BreadcrumbEntry,
  PageBlueprint,
  SubPageBlueprint,
  createFrontendPlugin,
} from '@backstage/frontend-plugin-api';

describe('PageLayout', () => {
  it('should render without the header when noHeader is true', async () => {
    const myPlugin = createFrontendPlugin({
      pluginId: 'my-plugin',
      extensions: [
        PageBlueprint.make({
          name: 'index-page',
          params: {
            noHeader: true, // <---
            title: 'My Plugin',
            path: '/my-plugin',
            loader: async () => (
              <div data-testid="test-content">Plugin content</div>
            ),
          },
        }),
      ],
    });

    renderTestApp({
      features: [myPlugin],
      initialRouteEntries: ['/my-plugin'],
    });

    await waitFor(() => {
      expect(screen.getByTestId('test-content')).toBeInTheDocument();
    });

    expect(
      screen.queryByRole('navigation', { name: 'Breadcrumbs' }),
    ).not.toBeInTheDocument();
  });

  it('should render with the header by default', async () => {
    const myPlugin = createFrontendPlugin({
      pluginId: 'my-plugin',
      extensions: [
        PageBlueprint.make({
          name: 'index-page',
          params: {
            title: 'My Plugin',
            path: '/my-plugin',
            loader: async () => (
              <div data-testid="test-content">Plugin content</div>
            ),
          },
        }),
      ],
    });

    renderTestApp({
      features: [myPlugin],
      initialRouteEntries: ['/my-plugin'],
    });

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'My Plugin' }),
      ).toBeInTheDocument();
    });
  });

  describe('Breadcrumbs', () => {
    it('should register a breadcrumb for the plugin root page with a title and path', async () => {
      const myPlugin = createFrontendPlugin({
        pluginId: 'my-plugin',
        extensions: [
          PageBlueprint.make({
            name: 'index-page',
            params: {
              title: 'My Plugin',
              path: '/my-plugin',
              loader: async () => (
                <div data-testid="test-content">Plugin content</div>
              ),
            },
          }),
        ],
      });

      renderTestApp({
        features: [myPlugin],
        initialRouteEntries: ['/my-plugin'],
      });

      await waitFor(() => {
        const breadcrumbList = screen.getByRole('navigation', {
          name: 'Breadcrumbs',
        });
        const breadcrumbLink = within(breadcrumbList).getByRole('link', {
          name: 'My Plugin',
        });
        expect(breadcrumbLink).toHaveAttribute('href', '/my-plugin');
      });
    });

    it('should fall back to the plugin id for the breadcrumb label when no title is provided', async () => {
      const myPlugin = createFrontendPlugin({
        pluginId: 'my-plugin',
        extensions: [
          PageBlueprint.make({
            name: 'index-page',
            params: {
              path: '/my-plugin',
              loader: async () => (
                <div data-testid="test-content">Plugin content</div>
              ),
            },
          }),
        ],
      });

      renderTestApp({
        features: [myPlugin],
        initialRouteEntries: ['/my-plugin'],
      });

      await waitFor(() => {
        const breadcrumbList = screen.getByRole('navigation', {
          name: 'Breadcrumbs',
        });
        const breadcrumbLink = within(breadcrumbList).getByRole('link', {
          name: 'my-plugin',
        });
        expect(breadcrumbLink).toHaveAttribute('href', '/my-plugin');
      });
    });

    it('should fall back to / when the page is mounted at the root', async () => {
      const myPlugin = createFrontendPlugin({
        pluginId: 'root-plugin',
        extensions: [
          PageBlueprint.make({
            name: 'index-page',
            params: {
              title: 'Root',
              path: '/',
              loader: async () => <div>Root content</div>,
            },
          }),
        ],
      });

      renderTestApp({
        features: [myPlugin],
        initialRouteEntries: ['/'],
      });

      await waitFor(() => {
        const breadcrumbList = screen.getByRole('navigation', {
          name: 'Breadcrumbs',
        });
        const breadcrumbLink = within(breadcrumbList).getByRole('link', {
          name: 'Root',
        });
        expect(breadcrumbLink).toHaveAttribute('href', '/');
      });
    });

    it('should register breadcrumbs for sub-pages', async () => {
      // Unnamed parent → page:test; the sub-page attaches relatively (same
      // pattern as PageBlueprint.test.tsx / SubPageBlueprint.test.tsx).
      const myPage = PageBlueprint.make({
        params: {
          title: 'My Plugin',
          path: '/my-plugin',
        },
      });

      const overviewSubPage = SubPageBlueprint.make({
        name: 'overview',
        params: {
          path: 'overview',
          title: 'Overview',
          loader: async () => <div>Overview content</div>,
        },
      });

      renderTestApp({
        extensions: [myPage, overviewSubPage],
        initialRouteEntries: ['/my-plugin/overview'],
      });

      await waitFor(() => {
        expect(screen.getByText('Overview content')).toBeInTheDocument();
        const breadcrumbList = screen.getByRole('navigation', {
          name: 'Breadcrumbs',
        });
        expect(breadcrumbList).toHaveTextContent('My Plugin');
        expect(breadcrumbList).toHaveTextContent('Overview');
      });
    });

    it('should register breadcrumbs for inner routes within a sub-page', async () => {
      function TaskDetail() {
        const { taskId } = useParams<{ taskId: string }>();
        return (
          <BreadcrumbEntry
            entry={{ label: taskId ?? 'Task', href: taskId ?? '' }}
          >
            <div>Task detail: {taskId}</div>
          </BreadcrumbEntry>
        );
      }

      function TasksSubPage() {
        return (
          <Routes>
            <Route index element={<div>Tasks list</div>} />
            <Route path=":taskId" element={<TaskDetail />} />
          </Routes>
        );
      }

      // Unnamed parent → page:test; the sub-page attaches relatively (same
      // pattern as PageBlueprint.test.tsx / SubPageBlueprint.test.tsx).
      const myPage = PageBlueprint.make({
        params: {
          title: 'Create',
          path: '/create',
        },
      });

      const tasksSubPage = SubPageBlueprint.make({
        name: 'tasks',
        params: {
          path: 'tasks',
          title: 'Tasks',
          loader: async () => <TasksSubPage />,
        },
      });

      renderTestApp({
        extensions: [myPage, tasksSubPage],
        initialRouteEntries: ['/create/tasks/abc-123'],
      });

      await waitFor(() => {
        expect(screen.getByText('Task detail: abc-123')).toBeInTheDocument();
        const breadcrumbList = screen.getByRole('navigation', {
          name: 'Breadcrumbs',
        });
        expect(breadcrumbList).toHaveTextContent('Create');
        expect(breadcrumbList).toHaveTextContent('Tasks');
        expect(breadcrumbList).toHaveTextContent('abc-123');
      });
    });
  });
});
