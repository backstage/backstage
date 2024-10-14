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

import { configApiRef, errorApiRef } from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { TestApiProvider, mockApis } from '@backstage/test-utils';
import TextField from '@material-ui/core/TextField';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { AnalyzeResult, catalogImportApiRef } from '../../api';
import { asInputRef } from '../helpers';
import {
  generateEntities,
  StepPrepareCreatePullRequest,
} from './StepPrepareCreatePullRequest';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';

describe('<StepPrepareCreatePullRequest />', () => {
  const catalogImportApi: jest.Mocked<typeof catalogImportApiRef.T> = {
    analyzeUrl: jest.fn(),
    submitPullRequest: jest.fn(),
    preparePullRequest: jest.fn(),
  };

  const catalogApi = catalogApiMock.mock();

  const errorApi: jest.Mocked<typeof errorApiRef.T> = {
    error$: jest.fn(),
    post: jest.fn(),
  };

  const configApi = mockApis.config();

  const Wrapper = ({ children }: { children?: React.ReactNode }) => (
    <TestApiProvider
      apis={[
        [catalogImportApiRef, catalogImportApi],
        [catalogApiRef, catalogApi],
        [errorApiRef, errorApi],
        [configApiRef, configApi],
      ]}
    >
      {children}
    </TestApiProvider>
  );

  const onPrepareFn = jest.fn();
  const analyzeResult = {
    type: 'repository',
    url: 'https://my-repository',
    integrationType: 'github',
    generatedEntities: [
      {
        apiVersion: '1',
        kind: 'Component',
        metadata: {
          name: 'my-component',
          namespace: 'default',
        },
        spec: {
          owner: 'my-owner',
        },
      },
    ],
  } as Extract<AnalyzeResult, { type: 'repository' }>;

  beforeEach(() => {
    jest.resetAllMocks();

    (catalogImportApi.preparePullRequest! as jest.Mock).mockResolvedValue({
      title: 'My title',
      body: 'My **body**',
    });
  });

  it('renders without exploding', async () => {
    catalogApi.getEntities.mockReturnValue(Promise.resolve({ items: [] }));

    render(
      <StepPrepareCreatePullRequest
        analyzeResult={analyzeResult}
        onPrepare={onPrepareFn}
        renderFormFields={({ register }) => {
          return (
            <>
              <TextField {...asInputRef(register('title'))} />
              <TextField {...asInputRef(register('body'))} />
              <TextField {...asInputRef(register('componentName'))} />
              <TextField {...asInputRef(register('owner'))} />
            </>
          );
        }}
      />,
      {
        wrapper: Wrapper,
      },
    );

    const title = await screen.findByText('My title');
    const description = await screen.findByText('body', {
      selector: 'strong',
    });
    expect(title).toBeInTheDocument();
    expect(title).toBeVisible();
    expect(description).toBeInTheDocument();
    expect(description).toBeVisible();
  });

  it('should submit created PR', async () => {
    catalogApi.getEntities.mockReturnValue(Promise.resolve({ items: [] }));
    catalogImportApi.submitPullRequest.mockReturnValue(
      Promise.resolve({
        location: 'https://my/location.yaml',
        link: 'https://my/pull',
      }),
    );

    render(
      <StepPrepareCreatePullRequest
        analyzeResult={analyzeResult}
        onPrepare={onPrepareFn}
        renderFormFields={({ register }) => {
          return (
            <>
              <TextField {...asInputRef(register('title'))} />
              <TextField {...asInputRef(register('body'))} />
              <TextField
                {...asInputRef(register('componentName'))}
                id="name"
                label="name"
              />
              <TextField
                {...asInputRef(register('owner'))}
                id="owner"
                label="owner"
              />
            </>
          );
        }}
      />,
      {
        wrapper: Wrapper,
      },
    );

    await userEvent.type(await screen.findByLabelText('name'), '-changed');
    await userEvent.type(await screen.findByLabelText('owner'), '-changed');
    await userEvent.click(screen.getByRole('button', { name: /Create PR/i }));

    expect(catalogImportApi.submitPullRequest).toHaveBeenCalledTimes(1);
    expect(catalogImportApi.submitPullRequest.mock.calls[0]).toMatchObject([
      {
        body: 'My **body**',
        fileContent: `apiVersion: "1"
kind: Component
metadata:
  name: my-component-changed
  namespace: default
spec:
  owner: my-owner-changed
`,
        repositoryUrl: 'https://my-repository',
        title: 'My title',
      },
    ]);
    expect(onPrepareFn).toHaveBeenCalledTimes(1);
    expect(onPrepareFn.mock.calls[0]).toMatchObject([
      {
        type: 'repository',
        url: 'https://my-repository',
        integrationType: 'github',
        pullRequest: {
          url: 'https://my/pull',
        },
        locations: [
          {
            entities: [
              {
                kind: 'Component',
                name: 'my-component-changed',
                namespace: 'default',
              },
            ],
            target: 'https://my/location.yaml',
          },
        ],
      },
      {
        notRepeatable: true,
      },
    ]);
  });

  it('should show error message', async () => {
    catalogApi.getEntities.mockResolvedValueOnce({ items: [] });
    catalogImportApi.submitPullRequest.mockRejectedValueOnce(
      new Error('some error'),
    );

    render(
      <StepPrepareCreatePullRequest
        analyzeResult={analyzeResult}
        onPrepare={onPrepareFn}
        renderFormFields={({ register }) => {
          return (
            <>
              <TextField {...asInputRef(register('title'))} />
              <TextField {...asInputRef(register('body'))} />
              <TextField {...asInputRef(register('componentName'))} />
              <TextField {...asInputRef(register('owner'))} />
            </>
          );
        }}
      />,
      {
        wrapper: Wrapper,
      },
    );

    await userEvent.click(
      await screen.findByRole('button', { name: /Create PR/i }),
    );

    expect(screen.getByText('some error')).toBeInTheDocument();
    expect(catalogImportApi.submitPullRequest).toHaveBeenCalledTimes(1);
    expect(onPrepareFn).toHaveBeenCalledTimes(0);
  });

  it('should load groups', async () => {
    const renderFormFieldsFn = jest.fn();
    catalogApi.getEntities.mockReturnValue(
      Promise.resolve({
        items: [
          {
            apiVersion: '1',
            kind: 'Group',
            metadata: {
              name: 'my-group',
            },
          },
        ],
      }),
    );

    render(
      <StepPrepareCreatePullRequest
        analyzeResult={analyzeResult}
        onPrepare={onPrepareFn}
        renderFormFields={renderFormFieldsFn}
      />,
      {
        wrapper: Wrapper,
      },
    );

    await waitFor(() => {
      expect(catalogApi.getEntities).toHaveBeenCalledTimes(1);
    });

    expect(renderFormFieldsFn).toHaveBeenCalled();
    expect(renderFormFieldsFn.mock.calls[0][0]).toMatchObject({
      groups: ['my-group'],
      groupsLoading: false,
    });
  });

  describe('generateEntities', () => {
    it.each([[undefined], [null]])(
      'should not include blank namespace for %s',
      namespace => {
        expect(
          generateEntities(
            [{ metadata: { namespace: namespace as any } }],
            'my-component',
            'group-1',
          ),
        ).toEqual([
          expect.objectContaining({
            metadata: expect.not.objectContaining({
              namespace: 'default',
            }),
          }),
        ]);
      },
    );

    it.each([['default'], ['my-namespace']])(
      'should include explicit namespace %s',
      namespace => {
        expect(
          generateEntities(
            [{ metadata: { namespace } }],
            'my-component',
            'group-1',
          ),
        ).toEqual([
          expect.objectContaining({
            metadata: expect.objectContaining({
              namespace,
            }),
          }),
        ]);
      },
    );
  });
});
