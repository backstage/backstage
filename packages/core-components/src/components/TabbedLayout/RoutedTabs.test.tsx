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

import { renderInTestApp } from '@backstage/test-utils';
import { act, fireEvent } from '@testing-library/react';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { RoutedTabs } from './RoutedTabs';

const testRoute1 = {
  path: '',
  title: 'tabbed-test-title',
  children: <div>tabbed-test-content</div>,
};
const testRoute2 = {
  title: 'tabbed-test-title-2',
  path: '/some-other-path',
  children: <div>tabbed-test-content-2</div>,
};

const testRoute3 = {
  title: 'tabbed-test-title-3',
  path: 'some-other-path-similar',
  children: <div>tabbed-test-content-3</div>,
};

describe('RoutedTabs', () => {
  it('renders simplest case', async () => {
    const rendered = await renderInTestApp(
      <RoutedTabs routes={[testRoute1]} />,
    );

    expect(rendered.getByText('tabbed-test-title')).toBeInTheDocument();
    expect(rendered.getByText('tabbed-test-content')).toBeInTheDocument();
  });

  it('navigates when user clicks different tab', async () => {
    const rendered = await renderInTestApp(
      <Routes>
        <Route
          path="/*"
          element={<RoutedTabs routes={[testRoute1, testRoute2, testRoute3]} />}
        />
      </Routes>,
    );

    const secondTab = rendered.queryAllByRole('tab')[1];
    act(() => {
      fireEvent.click(secondTab);
    });

    expect(rendered.getByText('tabbed-test-title')).toBeInTheDocument();
    expect(rendered.queryByText('tabbed-test-content')).not.toBeInTheDocument();

    expect(rendered.getByText('tabbed-test-title-2')).toBeInTheDocument();
    expect(rendered.getByText('tabbed-test-content-2')).toBeInTheDocument();

    const thirdTab = rendered.queryAllByRole('tab')[2];
    act(() => {
      fireEvent.click(thirdTab);
    });
    expect(rendered.getByText('tabbed-test-title-3')).toBeInTheDocument();
    expect(rendered.getByText('tabbed-test-content-3')).toBeInTheDocument();
  });

  describe('correctly delegates nested links', () => {
    const renderRoute = (route: string) =>
      renderInTestApp(
        <Routes>
          <Route
            path="/*"
            element={
              <RoutedTabs
                routes={[
                  testRoute1,
                  {
                    ...testRoute2,
                    children: (
                      <div>
                        tabbed-test-content-2
                        <Routes>
                          <Route
                            path="/nested"
                            element={<div>tabbed-test-nested-content-2</div>}
                          />
                        </Routes>
                      </div>
                    ),
                  },
                ]}
              />
            }
          />
        </Routes>,
        { routeEntries: [route] },
      );

    it('works for nested content', async () => {
      const rendered = await renderRoute('/some-other-path/nested');

      expect(
        rendered.queryByText('tabbed-test-content'),
      ).not.toBeInTheDocument();
      expect(rendered.getByText('tabbed-test-content-2')).toBeInTheDocument();
      expect(
        rendered.getByText('tabbed-test-nested-content-2'),
      ).toBeInTheDocument();
    });

    it('works for non-nested content', async () => {
      const rendered = await renderRoute('/some-other-path/');

      expect(
        rendered.queryByText('tabbed-test-content'),
      ).not.toBeInTheDocument();
      expect(rendered.getByText('tabbed-test-content-2')).toBeInTheDocument();
      expect(
        rendered.queryByText('tabbed-test-nested-content-2'),
      ).not.toBeInTheDocument();
    });
  });

  it('shows only one tab contents at a time', async () => {
    const rendered = await renderInTestApp(
      <RoutedTabs routes={[testRoute1, testRoute2]} />,
      { routeEntries: ['/some-other-path'] },
    );

    expect(rendered.getByText('tabbed-test-title')).toBeInTheDocument();
    expect(rendered.queryByText('tabbed-test-content')).not.toBeInTheDocument();

    expect(rendered.getByText('tabbed-test-title-2')).toBeInTheDocument();
    expect(rendered.getByText('tabbed-test-content-2')).toBeInTheDocument();
  });

  it('redirects to the top level when no route is matching the url', async () => {
    const rendered = await renderInTestApp(
      <RoutedTabs routes={[testRoute1, testRoute2]} />,
      { routeEntries: ['/non-existing-path'] },
    );

    expect(rendered.getByText('tabbed-test-title')).toBeInTheDocument();
    expect(rendered.getByText('tabbed-test-content')).toBeInTheDocument();
    expect(rendered.getByText('tabbed-test-title-2')).toBeInTheDocument();

    expect(
      rendered.queryByText('tabbed-test-content-2'),
    ).not.toBeInTheDocument();
  });

  it('should render the tabs as <a> links', async () => {
    const routes = [testRoute1, testRoute2, testRoute3];
    const expectedHrefs = ['/', '/some-other-path', '/some-other-path-similar'];
    const rendered = await renderInTestApp(<RoutedTabs routes={routes} />);

    const tabs = rendered.queryAllByRole('tab');

    for (const [k, v] of Object.entries(tabs)) {
      expect(v.tagName).toBe('A');
      expect(v).toHaveAttribute('href', expectedHrefs[Number(k)]);
    }
  });
});
