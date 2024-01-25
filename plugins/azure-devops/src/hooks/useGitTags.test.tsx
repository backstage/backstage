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
import { useGitTags } from './useGitTags';
import { Entity } from '@backstage/catalog-model';
import { GitTag } from '@backstage/plugin-azure-devops-common';
import { TestApiProvider } from '@backstage/test-utils';
import { AzureDevOpsApi, azureDevOpsApiRef } from '../api';

describe('useGitTags', () => {
  const azureDevOpsApiMock = {
    getGitTags: jest.fn(),
  };
  const azureDevOpsApi =
    azureDevOpsApiMock as Partial<AzureDevOpsApi> as AzureDevOpsApi;

  const Wrapper = (props: { children?: React.ReactNode }) => (
    <TestApiProvider apis={[[azureDevOpsApiRef, azureDevOpsApi]]}>
      {props.children}
    </TestApiProvider>
  );

  it('should provide an array of GitTag', async () => {
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
    const tags: GitTag[] = [
      {
        objectId: 'tag-1',
        peeledObjectId: 'tag-1',
        name: 'tag-1',
        createdBy: 'awanlin',
        link: 'https://dev.azure.com/org/project/repo',
        commitLink: 'https://dev.azure.com/org/project/repo/commit-sha-1',
      },
      {
        objectId: 'tag-2',
        peeledObjectId: 'tag-2',
        name: 'tag-2',
        createdBy: 'awanlin',
        link: 'https://dev.azure.com/org/project/repo',
        commitLink: 'https://dev.azure.com/org/project/repo/commit-sha-2',
      },
      {
        objectId: 'tag-3',
        peeledObjectId: 'tag-3',
        name: 'tag-3',
        createdBy: 'awanlin',
        link: 'https://dev.azure.com/org/project/repo',
        commitLink: 'https://dev.azure.com/org/project/repo/commit-sha-3',
      },
    ];
    azureDevOpsApiMock.getGitTags.mockResolvedValue({ items: tags });
    const { result } = renderHook(() => useGitTags(entity), {
      wrapper: Wrapper,
    });

    expect(result.current.loading).toEqual(true);

    await waitFor(() => {
      expect(result.current).toEqual({
        error: undefined,
        items: tags,
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
      renderHook(() => useGitTags(entity), {
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
      renderHook(() => useGitTags(entity), {
        wrapper: Wrapper,
      }),
    ).toThrow(
      'Invalid value for annotation "dev.azure.com/project-repo"; expected format is: <project-name>/<repo-name>, found: "fake"',
    );
  });
});
