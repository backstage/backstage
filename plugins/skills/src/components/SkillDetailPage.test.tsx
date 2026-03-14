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
import { fireEvent, screen } from '@testing-library/react';
import { SkillDetailPage } from './SkillDetailPage';
import { skillsApiRef } from '../api';
import { rootRouteRef } from '../routes';

let currentSkillName = 'test-skill';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ name: currentSkillName }),
}));

const mockSkillsApi = {
  listSkills: jest.fn(),
  getSkill: jest.fn().mockResolvedValue({
    name: 'test-skill',
    description: 'A test skill for testing.',
    license: 'Apache-2.0',
    source: 'plugin:my-plugin',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-02T00:00:00.000Z',
  }),
  getSkillFiles: jest.fn().mockResolvedValue([
    {
      path: 'SKILL.md',
      content:
        '---\nname: test-skill\ndescription: A test skill for testing.\n---\n\n# Test Skill\n\nInstructions here.',
    },
    {
      path: 'scripts/run.py',
      content: 'print("hello")',
    },
  ]),
  createSkill: jest.fn(),
  deleteSkill: jest.fn(),
};

const mockDiscoveryApi = {
  getBaseUrl: jest.fn().mockResolvedValue('http://localhost:7007/api/skills'),
};

const writeText = jest.fn();

async function renderPage(api = mockSkillsApi) {
  return renderInTestApp(
    <TestApiProvider
      apis={[
        [skillsApiRef, api],
        [discoveryApiRef, mockDiscoveryApi],
      ]}
    >
      <SkillDetailPage />
    </TestApiProvider>,
    {
      mountedRoutes: {
        '/skills': rootRouteRef,
      },
    },
  );
}

describe('SkillDetailPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    currentSkillName = 'test-skill';
    Object.assign(globalThis.navigator, {
      clipboard: { writeText },
    });
  });

  it('renders the skill name and description', async () => {
    await renderPage();

    const headings = await screen.findAllByText('test-skill');
    expect(headings.length).toBeGreaterThanOrEqual(1);
    expect(
      await screen.findByText('A test skill for testing.'),
    ).toBeInTheDocument();
  });

  it('renders the install command', async () => {
    await renderPage();

    const installText = await screen.findByText(
      'npx skills add http://localhost:7007/.well-known/skills/test-skill',
    );
    expect(installText).toBeInTheDocument();
  });

  it('copies the install command', async () => {
    writeText.mockResolvedValue(undefined);

    await renderPage();

    fireEvent.click(await screen.findByRole('button', { name: 'Copy' }));

    expect(writeText).toHaveBeenCalledWith(
      'npx skills add http://localhost:7007/.well-known/skills/test-skill',
    );
    expect(
      await screen.findByRole('button', { name: 'Copied' }),
    ).toBeInTheDocument();
  });

  it('renders skill files', async () => {
    await renderPage();

    expect(
      await screen.findByRole('button', { name: 'SKILL.md' }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole('button', { name: 'scripts/run.py' }),
    ).toBeInTheDocument();
    expect(await screen.findByText(/# Test Skill/)).toBeInTheDocument();
  });

  it('renders license information', async () => {
    await renderPage();

    expect(await screen.findByText('Apache-2.0')).toBeInTheDocument();
  });

  it('renders the breadcrumb link from the route ref', async () => {
    await renderPage();

    expect(await screen.findByRole('link', { name: 'Skills' })).toHaveAttribute(
      'href',
      '/skills',
    );
  });

  it('shows error when skill not found', async () => {
    const errorApi = {
      ...mockSkillsApi,
      getSkill: jest.fn().mockRejectedValue(new Error('Not found')),
      getSkillFiles: jest.fn().mockRejectedValue(new Error('Not found')),
    };

    await renderPage(errorApi);

    expect(await screen.findByText('Not found')).toBeInTheDocument();
  });

  it('clears stale error state when a later request succeeds', async () => {
    currentSkillName = 'missing-skill';

    const routedApi = {
      ...mockSkillsApi,
      getSkill: jest.fn().mockImplementation(async (name: string) => {
        if (name === 'missing-skill') {
          throw new Error('Not found');
        }

        return {
          name: 'test-skill',
          description: 'A test skill for testing.',
          license: 'Apache-2.0',
          source: 'plugin:my-plugin',
          createdAt: '2025-01-01T00:00:00.000Z',
          updatedAt: '2025-01-02T00:00:00.000Z',
        };
      }),
      getSkillFiles: jest.fn().mockImplementation(async (name: string) => {
        if (name === 'missing-skill') {
          throw new Error('Not found');
        }

        return [
          {
            path: 'SKILL.md',
            content:
              '---\nname: test-skill\ndescription: A test skill for testing.\n---\n\n# Test Skill\n\nInstructions here.',
          },
        ];
      }),
    };

    const rendered = await renderPage(routedApi);

    expect(await screen.findByText('Not found')).toBeInTheDocument();

    currentSkillName = 'test-skill';
    rendered.rerender(
      <TestApiProvider
        apis={[
          [skillsApiRef, routedApi],
          [discoveryApiRef, mockDiscoveryApi],
        ]}
      >
        <SkillDetailPage />
      </TestApiProvider>,
    );

    expect(
      await screen.findByText('A test skill for testing.'),
    ).toBeInTheDocument();
    expect(screen.queryByText('Not found')).not.toBeInTheDocument();
  });
});
