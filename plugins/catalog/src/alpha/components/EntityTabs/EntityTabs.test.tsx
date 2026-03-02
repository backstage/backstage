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
import { useSelectedSubRoute } from './EntityTabs';
import { EntityTabsList } from './EntityTabsList';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render } from '@testing-library/react';
import { renderInTestApp } from '@backstage/frontend-test-utils';

function TestSubRouteHook(props: {
  subRoutes: Array<{
    group: string;
    path: string;
    title: string;
    children: JSX.Element;
  }>;
}) {
  const { index, route, element } = useSelectedSubRoute(props.subRoutes);
  return (
    <div>
      <div data-testid="selected-index">{index}</div>
      <div data-testid="selected-route-title">{route?.title}</div>
      <div data-testid="element-container">{element}</div>
    </div>
  );
}

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
  const subRoutes = [
    {
      group: 'default',
      path: '/overview',
      title: 'Overview',
      children: <div>Overview Content</div>,
    },
    {
      group: 'default',
      path: '/details',
      title: 'Details',
      children: <div>Details Content</div>,
    },
    {
      group: 'docs',
      path: '/docs',
      title: 'Documentation',
      children: <div>Documentation Content</div>,
    },
  ];

  describe('useSelectedSubRoute', () => {
    it('should render the first route at root path', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route
              path="/*"
              element={<TestSubRouteHook subRoutes={subRoutes} />}
            />
          </Routes>
        </MemoryRouter>,
      );

      expect(screen.getByTestId('selected-index')).toHaveTextContent('0');
      expect(screen.getByTestId('selected-route-title')).toHaveTextContent(
        'Overview',
      );
    });

    it('should render a route at non-root path', () => {
      render(
        <MemoryRouter initialEntries={['/details']}>
          <Routes>
            <Route
              path="/*"
              element={<TestSubRouteHook subRoutes={subRoutes} />}
            />
          </Routes>
        </MemoryRouter>,
      );

      expect(screen.getByTestId('selected-index')).toHaveTextContent('1');
      expect(screen.getByTestId('selected-route-title')).toHaveTextContent(
        'Details',
      );
    });

    it('should handle nested paths under a route (splat path behavior)', () => {
      render(
        <MemoryRouter initialEntries={['/details/nested/path']}>
          <Routes>
            <Route
              path="/*"
              element={<TestSubRouteHook subRoutes={subRoutes} />}
            />
          </Routes>
        </MemoryRouter>,
      );

      expect(screen.getByTestId('selected-index')).toHaveTextContent('1');
      expect(screen.getByTestId('selected-route-title')).toHaveTextContent(
        'Details',
      );
    });

    it('should render correct content for matched route', () => {
      render(
        <MemoryRouter initialEntries={['/docs']}>
          <Routes>
            <Route
              path="/*"
              element={<TestSubRouteHook subRoutes={subRoutes} />}
            />
          </Routes>
        </MemoryRouter>,
      );

      expect(screen.getByTestId('element-container')).toHaveTextContent(
        'Documentation Content',
      );
    });

    it('should support relative links within routes', () => {
      const routesWithRelativeLinks = [
        {
          group: 'default',
          path: '/entity',
          title: 'Entity',
          children: (
            <div>
              Entity Content
              <a href="./child">Go to child</a>
            </div>
          ),
        },
      ];

      render(
        <MemoryRouter initialEntries={['/entity']}>
          <Routes>
            <Route
              path="/*"
              element={<TestSubRouteHook subRoutes={routesWithRelativeLinks} />}
            />
          </Routes>
        </MemoryRouter>,
      );

      expect(screen.getByText('Entity Content')).toBeInTheDocument();
      expect(screen.getByText('Go to child')).toHaveAttribute(
        'href',
        './child',
      );
    });

    it('should handle routes with nested path segments', () => {
      const nestedPathRoutes = [
        {
          group: 'default',
          path: '/catalog/entities',
          title: 'Entities',
          children: <div>Entities Content</div>,
        },
        {
          group: 'default',
          path: '/catalog',
          title: 'Catalog',
          children: <div>Catalog Content</div>,
        },
      ];

      render(
        <MemoryRouter initialEntries={['/catalog/entities/some-entity']}>
          <Routes>
            <Route
              path="/*"
              element={<TestSubRouteHook subRoutes={nestedPathRoutes} />}
            />
          </Routes>
        </MemoryRouter>,
      );

      expect(screen.getByTestId('selected-index')).toHaveTextContent('0');
      expect(screen.getByTestId('selected-route-title')).toHaveTextContent(
        'Entities',
      );
    });

    it('should fall back to first route for unknown paths', () => {
      render(
        <MemoryRouter initialEntries={['/unknown-path']}>
          <Routes>
            <Route
              path="/*"
              element={<TestSubRouteHook subRoutes={subRoutes} />}
            />
          </Routes>
        </MemoryRouter>,
      );

      expect(screen.getByTestId('selected-index')).toHaveTextContent('0');
      expect(screen.getByTestId('selected-route-title')).toHaveTextContent(
        'Overview',
      );
    });
  });
});
