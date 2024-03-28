/*
 * Copyright 2021 The Backstage Authors
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

import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { Entity } from '@backstage/catalog-model';
import { BuildRun } from '@backstage/plugin-azure-devops-common';
import { TestApiProvider } from '@backstage/test-utils';
import { AzureDevOpsApi, azureDevOpsApiRef } from '../api';
import { useBuildRuns } from './useBuildRuns';

describe('useBuildRuns', () => {
  const azureDevOpsApiMock = {
    getBuildRuns: jest.fn(),
  };
  const azureDevOpsApi =
    azureDevOpsApiMock as Partial<AzureDevOpsApi> as AzureDevOpsApi;

  const Wrapper = (props: { children?: React.ReactNode }) => (
    <TestApiProvider apis={[[azureDevOpsApiRef, azureDevOpsApi]]}>
      {props.children}
    </TestApiProvider>
  );

  it('should provide an array of BuildRun', async () => {
    const entity: Entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: {
        namespace: 'default',
        name: 'project-repo',
        annotations: {
          'dev.azure.com/project-repo': 'projectName/repoName',
        },
      },
    };
    const buildRuns: BuildRun[] = [
      {
        id: 1,
        title: 'title-1',
        source: 'awanlin',
        link: 'https://dev.azure.com/org/project/repo',
      },
      {
        id: 2,
        title: 'title-2',
        source: 'awanlin',
        link: 'https://dev.azure.com/org/project/repo',
      },
      {
        id: 3,
        title: 'title-3',
        source: 'awanlin',
        link: 'https://dev.azure.com/org/project/repo',
      },
    ];
    azureDevOpsApiMock.getBuildRuns.mockResolvedValue({
      items: buildRuns,
    });
    const { result } = renderHook(() => useBuildRuns(entity), {
      wrapper: Wrapper,
    });

    expect(result.current.loading).toEqual(true);

    await waitFor(() => {
      expect(result.current).toEqual({
        error: undefined,
        items: buildRuns,
        loading: false,
      });
    });
  });

  it('should return throw when annotation missing', async () => {
    const entity: Entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: {
        namespace: 'default',
        name: 'project-repo',
      },
    };

    expect(() =>
      renderHook(() => useBuildRuns(entity), {
        wrapper: Wrapper,
      }),
    ).toThrow('Expected "dev.azure.com" annotations were not found');
  });

  it('should return throw when annotation invalid', async () => {
    const entity: Entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: {
        namespace: 'default',
        name: 'project-repo',
        annotations: {
          'dev.azure.com/project-repo': 'fake',
        },
      },
    };

    expect(() =>
      renderHook(() => useBuildRuns(entity), {
        wrapper: Wrapper,
      }),
    ).toThrow(
      'Invalid value for annotation "dev.azure.com/project-repo"; expected format is: <project-name>/<repo-name>, found: "fake"',
    );
  });
});
