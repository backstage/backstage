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

import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { buildHeaderTabs, useEntityTabs } from './useEntityTabs';

describe('buildHeaderTabs', () => {
  const definitions = {
    documentation: { title: 'Documentation', aliases: ['docs'] },
    development: { title: 'Development' },
  };

  it('preserves group semantics and omits icons', () => {
    expect(
      buildHeaderTabs(
        [
          {
            path: '/overview',
            title: 'Overview',
            children: <div />,
            icon: 'x',
          },
          {
            path: '/techdocs',
            title: 'TechDocs',
            group: 'docs',
            children: <div />,
          },
          {
            path: '/apidocs',
            title: 'ApiDocs',
            group: 'documentation',
            children: <div />,
          },
          { path: '/ci', title: 'CI', group: 'development', children: <div /> },
        ],
        definitions,
        'title',
      ),
    ).toEqual([
      {
        id: 'documentation',
        label: 'Documentation',
        items: [
          { id: '/apidocs', label: 'ApiDocs', href: 'apidocs' },
          { id: '/techdocs', label: 'TechDocs', href: 'techdocs' },
        ],
      },
      { id: '/ci', label: 'CI', href: 'ci' },
      { id: '/overview', label: 'Overview', href: 'overview' },
    ]);
  });
});

function TestHook() {
  const result = useEntityTabs({
    routes: [
      { path: '/', title: 'Overview', children: <div>Overview content</div> },
      { path: '/docs/*', title: 'Docs', children: <div>Docs content</div> },
    ],
    groupDefinitions: {},
    defaultContentOrder: 'title',
  });
  return (
    <>
      <span data-testid="active">{result.activeTabId}</span>
      <div>{result.content}</div>
    </>
  );
}

it('reuses nested wildcard routing for active content', () => {
  render(
    <MemoryRouter initialEntries={['/docs/api/v1']}>
      <Routes>
        <Route path="/*" element={<TestHook />} />
      </Routes>
    </MemoryRouter>,
  );
  expect(screen.getByTestId('active')).toHaveTextContent('/docs/*');
  expect(screen.getByText('Docs content')).toBeInTheDocument();
});
