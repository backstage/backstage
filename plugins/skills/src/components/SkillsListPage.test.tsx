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

import { discoveryApiRef } from '@backstage/core-plugin-api';
import { TestApiProvider, renderInTestApp } from '@backstage/test-utils';
import { screen } from '@testing-library/react';
import { SkillsListPage } from './SkillsListPage';
import { skillsApiRef } from '../api';
import { skillDetailRouteRef } from '../routes';

const mockSkillsApi = {
  listSkills: jest.fn().mockResolvedValue({
    skills: [
      {
        name: 'code-review',
        description: 'Reviews code changes.',
        source: 'plugin:my-plugin',
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-02T00:00:00.000Z',
      },
      {
        name: 'pdf-processing',
        description: 'Processes PDF files.',
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T00:00:00.000Z',
      },
    ],
    totalCount: 2,
  }),
  getSkill: jest.fn(),
  getSkillFiles: jest.fn(),
  createSkill: jest.fn(),
  deleteSkill: jest.fn(),
};

const mockDiscoveryApi = {
  getBaseUrl: jest.fn().mockResolvedValue('http://localhost:7007/api/skills'),
};

async function renderPage() {
  return renderInTestApp(
    <TestApiProvider
      apis={[
        [skillsApiRef, mockSkillsApi],
        [discoveryApiRef, mockDiscoveryApi],
      ]}
    >
      <SkillsListPage />
    </TestApiProvider>,
    {
      mountedRoutes: {
        '/skills/:name': skillDetailRouteRef,
      },
    },
  );
}

describe('SkillsListPage', () => {
  it('renders the skills page title', async () => {
    await renderPage();

    expect(await screen.findByText('Skills')).toBeInTheDocument();
  });

  it('renders skill names from the API', async () => {
    await renderPage();

    expect(await screen.findByText('code-review')).toBeInTheDocument();
    expect(await screen.findByText('pdf-processing')).toBeInTheDocument();
  });

  it('calls the API to list skills', async () => {
    await renderPage();

    expect(mockSkillsApi.listSkills).toHaveBeenCalled();
  });

  it('renders the shared install command', async () => {
    await renderPage();

    expect(
      await screen.findByText(
        'npx skills add http://localhost:7007/.well-known/skills',
      ),
    ).toBeInTheDocument();
  });

  it('renders skill detail links from the route ref', async () => {
    await renderPage();

    expect(
      await screen.findByRole('link', { name: 'code-review' }),
    ).toHaveAttribute('href', '/skills/code-review');
  });
});
