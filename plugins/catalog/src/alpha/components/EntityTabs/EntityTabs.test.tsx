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

import { screen } from '@testing-library/react';
import { EntityTabs } from './EntityTabs';
import { EntityTabsList } from './EntityTabsList';
import { Route, Routes } from 'react-router-dom';
import { renderInTestApp } from '@backstage/frontend-test-utils';

describe('EntityTabsList', () => {
  it('should render groups in the order defined by groupDefinitions', () => {
    const tabs = [
      { id: '/cicd', label: 'CI/CD', path: 'cicd', group: 'cicd' },
      {
        id: '/overview',
        label: 'Overview',
        path: 'overview',
        group: 'overview',
      },
      {
        id: '/techdocs',
        label: 'TechDocs',
        path: 'techdocs',
        group: 'techdocs',
      },
    ];

    const groupDefinitions = {
      overview: { title: 'Overview' },
      techdocs: { title: 'TechDocs' },
      cicd: { title: 'CI/CD' },
    };

    renderInTestApp(
      <EntityTabsList
        tabs={tabs}
        groupDefinitions={groupDefinitions}
        selectedIndex={0}
      />,
    );

    const tabElements = screen.getAllByRole('tab');
    expect(tabElements).toHaveLength(3);
    expect(tabElements[0]).toHaveTextContent('Overview');
    expect(tabElements[1]).toHaveTextContent('TechDocs');
    expect(tabElements[2]).toHaveTextContent('CI/CD');
  });

  it('should place ungrouped tabs after defined groups', () => {
    const tabs = [
      { id: '/standalone', label: 'Standalone', path: 'standalone' },
      {
        id: '/overview',
        label: 'Overview',
        path: 'overview',
        group: 'overview',
      },
      {
        id: '/techdocs',
        label: 'TechDocs',
        path: 'techdocs',
        group: 'techdocs',
      },
    ];

    const groupDefinitions = {
      overview: { title: 'Overview' },
      techdocs: { title: 'TechDocs' },
    };

    renderInTestApp(
      <EntityTabsList
        tabs={tabs}
        groupDefinitions={groupDefinitions}
        selectedIndex={0}
      />,
    );

    const tabElements = screen.getAllByRole('tab');
    expect(tabElements).toHaveLength(3);
    expect(tabElements[0]).toHaveTextContent('Overview');
    expect(tabElements[1]).toHaveTextContent('TechDocs');
    expect(tabElements[2]).toHaveTextContent('Standalone');
  });
});

describe('EntityTabs', () => {
  describe('rendering', () => {
    const tabRoutes = [
      {
        group: 'overview',
        path: '/',
        title: 'Overview',
        children: <div>Overview Content</div>,
      },
      {
        group: 'overview',
        path: '/details',
        title: 'Details',
        children: <div>Details Content</div>,
      },
    ];

    it('renders the matched route content and no not-found page', async () => {
      await renderInTestApp(
        <Routes>
          <Route
            path="/*"
            element={
              <EntityTabs
                routes={tabRoutes}
                groupDefinitions={{ overview: { title: 'Overview' } }}
              />
            }
          />
        </Routes>,
        { initialRouteEntries: ['/details'] },
      );

      expect(await screen.findByText('Details Content')).toBeInTheDocument();
      expect(screen.queryByTestId('error')).toBeNull();
    });

    it('renders the not-found page for unknown sub-paths', async () => {
      await renderInTestApp(
        <Routes>
          <Route
            path="/*"
            element={
              <EntityTabs
                routes={tabRoutes}
                groupDefinitions={{ overview: { title: 'Overview' } }}
              />
            }
          />
        </Routes>,
        { initialRouteEntries: ['/blob'] },
      );

      expect(await screen.findByTestId('error')).toBeInTheDocument();
      expect(screen.queryByText('Overview Content')).not.toBeInTheDocument();
      expect(screen.queryByText('Details Content')).not.toBeInTheDocument();
    });

    it('still routes nested sub-paths to the matching tab content', async () => {
      const nestedRoutes = [
        {
          group: 'overview',
          path: '/',
          title: 'Overview',
          children: <div>Overview Content</div>,
        },
        {
          group: 'overview',
          path: '/docs',
          title: 'Docs',
          children: <div>Docs Content</div>,
        },
      ];

      await renderInTestApp(
        <Routes>
          <Route
            path="/*"
            element={
              <EntityTabs
                routes={nestedRoutes}
                groupDefinitions={{ overview: { title: 'Overview' } }}
              />
            }
          />
        </Routes>,
        { initialRouteEntries: ['/docs/api/v1'] },
      );

      expect(await screen.findByText('Docs Content')).toBeInTheDocument();
      expect(screen.queryByTestId('error')).toBeNull();
    });
  });
});
