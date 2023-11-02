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

import { EntityProvider } from '@backstage/plugin-catalog-react';
import React from 'react';
import { useWorkflowRuns } from '../useWorkflowRuns';
import { WorkflowRunsCard, WorkflowRunsCardView } from './WorkflowRunsCard';

import { ConfigReader } from '@backstage/core-app-api';
import {
  ConfigApi,
  configApiRef,
  errorApiRef,
} from '@backstage/core-plugin-api';
import { TestApiProvider, renderInTestApp } from '@backstage/test-utils';
import { rootRouteRef } from '../../routes';
import { fireEvent, screen, within } from '@testing-library/react';

jest.mock('../useWorkflowRuns', () => ({
  useWorkflowRuns: jest.fn(),
}));

const mockErrorApi: jest.Mocked<typeof errorApiRef.T> = {
  post: jest.fn(),
  error$: jest.fn(),
};

const configApi: ConfigApi = new ConfigReader({});

describe('WorkflowRunsCardView', () => {
  const workflowRuns = [1, 2].map(i => ({
    workflowName: 'Workflow runs on GitHub',
    message: 'Update catalog-info.yaml',
    id: `run-id${i}`,
    source: {
      branchName: 'master',
      commit: {
        hash: 'e15eb99ea35f135f2dc0c6cbb5356853a11c97f1',
        url: 'https://api.github.com/repos/greenroom-test/sonar-test10/branchesmaster',
      },
    },
    status: 'completed',
    conclusion: 'success',
    url: 'https://api.github.com/repos/greenroom-test/sonar-test10/actions/runs/3054717514',
    githubUrl:
      'https://github.com/greenroom-test/sonar-test10/actions/runs/3054717514',
    onReRunClick: jest.fn(),
  }));

  const renderCardViewSubject = async (props: any = {}) => {
    renderInTestApp(
      <TestApiProvider
        apis={[
          [errorApiRef, mockErrorApi],
          [configApiRef, configApi],
        ]}
      >
        <WorkflowRunsCardView
          loading
          runs={...props}
          onChangePageSize={() => {}}
          onChangePage={() => {}}
          page={0}
          total={0}
          pageSize={6}
          searchTerm=""
          projectName="test-project"
        />
        ,
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/ci-cd': rootRouteRef,
        },
      },
    );
  };

  it('renders loading progress bar', async () => {
    await renderCardViewSubject(null);

    const loadingElement = screen.getByRole('progressbar');
    expect(loadingElement).toBeInTheDocument();
  });

  it('renders runs when provided', async () => {
    await renderCardViewSubject(workflowRuns);

    const runElements = screen.getAllByText('Workflow runs on GitHub');
    expect(runElements.length).toBe(workflowRuns.length * 2);
  });
});

describe('<WorkflowRunsCard />', () => {
  const entity = {
    metadata: {
      namespace: 'default',
      annotations: {
        'github.com/project-slug': 'greenroom-test/sonar-test10',
      },
      name: 'sonar-test10',
      title: 'sonar-test10',
      description: 'A demo sonar-test repo',
      links: [
        {
          url: 'https://some-demo.internal.com',
          title: 'Demo',
          icon: 'dashboard',
        },
      ],
      uid: '41af856a-8f58-45bb-9a27-d8f5bb1fd8e3',
      etag: '9abe92f7496bc40f8022eb5232f08d64c45ea609',
    },
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    spec: {
      type: 'website',
      owner: 'swcoe',
      lifecycle: 'experimental',
    },
    relations: [
      {
        type: 'ownedBy',
        targetRef: 'group:default/swcoe',
        target: {
          kind: 'group',
          namespace: 'default',
          name: 'swcoe',
        },
      },
    ],
  };

  const wfRuns = [1, 2].map(i => ({
    workflowName: 'Show Me the S3cr3tz',
    message: 'Update catalog-info.yaml',
    id: `run-id${i}`,
    source: {
      branchName: `master${i}`,
      commit: {
        hash: 'e15eb99ea35f135f2dc0c6cbb5356853a11c97f1',
        url: 'https://api.github.com/repos/greenroom-test/sonar-test10/branchesmaster',
      },
    },
    status: 'completed',
    conclusion: 'success',
    url: 'https://api.github.com/repos/greenroom-test/sonar-test10/actions/runs/3054717514',
    githubUrl:
      'https://github.com/greenroom-test/sonar-test10/actions/runs/3054717514',
    onReRunClick: jest.fn(),
  }));

  const [
    { runs: runsData, branches, defaultBranch, ...cardProps },
    { retry, setPage, setPageSize },
  ] = [
    {
      page: 0,
      pageSize: 6,
      loading: false,
      runs: [
        {
          workflowName: 'Show Me the S3cr3tz',
          message: 'Update catalog-info.yaml',
          id: '3054717514',
          source: {
            branchName: 'master',
            commit: {
              hash: 'e15eb99ea35f135f2dc0c6cbb5356853a11c97f1',
              url: 'https://api.github.com/repos/greenroom-test/sonar-test10/branchesmaster',
            },
          },
          status: 'completed',
          conclusion: 'success',
          url: 'https://api.github.com/repos/greenroom-test/sonar-test10/actions/runs/3054717514',
          githubUrl:
            'https://github.com/greenroom-test/sonar-test10/actions/runs/3054717514',
        },
        {
          workflowName: 'Show Me the S3cr3tz',
          message: 'Create catalog-info.yaml',
          id: '3054675648',
          source: {
            branchName: 'master',
            commit: {
              hash: '254dec3a865a75a3695838a9a2f8d0a95f21ce45',
              url: 'https://api.github.com/repos/greenroom-test/sonar-test10/branchesmaster',
            },
          },
          status: 'completed',
          conclusion: 'success',
          url: 'https://api.github.com/repos/greenroom-test/sonar-test10/actions/runs/3054675648',
          githubUrl:
            'https://github.com/greenroom-test/sonar-test10/actions/runs/3054675648',
        },
      ],
      branches: [
        {
          name: 'master',
          commit: {
            sha: '98d913c1d5fd5f04180f7bfecec2c155eab37f2c',
            url: 'https://api.github.com/repos/greenroom-test/sonar-test10/commits/98d913c1d5fd5f04180f7bfecec2c155eab37f2c',
          },
          protected: false,
        },
        {
          name: 'greenroom---add-to-catalog-581',
          commit: {
            sha: '6cc958ad633247ba5bf329d66971723b183fc24b',
            url: 'https://api.github.com/repos/greenroom-test/sonar-test10/commits/6cc958ad633247ba5bf329d66971723b183fc24b',
          },
          protected: false,
        },
        {
          name: 'master1',
          commit: {
            sha: 'e15eb99ea35f135f2dc0c6cbb5356853a11c97f1',
            url: 'https://api.github.com/repos/greenroom-test/sonar-test10/commits/e15eb99ea35f135f2dc0c6cbb5356853a11c97f1',
          },
          protected: false,
        },
      ],
      defaultBranch: 'master',
      projectName: 'greenroom-test/sonar-test10',
      total: 2,
    },
    {
      retry: jest.fn(),
      setPage: jest.fn(),
      setPageSize: jest.fn(),
    },
  ];

  beforeEach(() => {
    (useWorkflowRuns as jest.Mock).mockReturnValue([
      { runs: wfRuns, branches, defaultBranch, ...cardProps },
      { retry, setPage, setPageSize },
    ]);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const renderSubject = async (props: any = {}) => {
    renderInTestApp(
      <TestApiProvider
        apis={[
          [errorApiRef, mockErrorApi],
          [configApiRef, configApi],
        ]}
      >
        <EntityProvider entity={entity}>
          <WorkflowRunsCard {...props} />
        </EntityProvider>
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/ci-cd': rootRouteRef,
        },
      },
    );
  };

  it('renders workflowruncard screen', async () => {
    await renderSubject();
    expect(screen.getByText(/Search/)).toBeInTheDocument();
  });

  it('renders the workflow cards', async () => {
    await renderSubject();
    const runElements = screen.getAllByText(/Show Me the S3cr3tz/);
    expect(runElements.length).toBe(2);
  });

  it('rows per page', async () => {
    await renderSubject();
    const rowsPerPageButton = screen.getByRole('button', {
      name: /Workflows per page/i,
    });

    fireEvent.click(rowsPerPageButton);
    const buttons = within(rowsPerPageButton).queryAllByRole('option');
    const expectedTexts = ['6', '12', '18'];
    buttons.forEach((button, index) => {
      expect(button.textContent).toBe(expectedTexts[index]);
    });
  });

  it('is reloading', async () => {
    await renderSubject({ retry });
    const reloadButton = screen.getByRole('button', {
      name: /Reload workflow runs/i,
    });

    fireEvent.click(reloadButton);
    expect(reloadButton).toBeInTheDocument();
  });

  it('is dropdown avaialable', async () => {
    await renderSubject();
    const selectMenu = screen.getByTestId('menu-control');
    fireEvent.click(selectMenu);

    const buttons = within(selectMenu).getAllByRole('button');
    const expectedTexts = branches.map(branch => branch.name);
    expectedTexts.push('select all branches');

    buttons.forEach((button, index) => {
      expect(button.textContent).toContain(expectedTexts[index]);
    });
  });

  it('is search changing the cards', async () => {
    await renderSubject();
    const field = screen.getByTestId('search-control').querySelector('input');
    fireEvent.change(field!, { target: { value: 'master1' } });
    const item = screen.getAllByText(/master1/i);
    expect(item.length).toBe(1);
  });
});
