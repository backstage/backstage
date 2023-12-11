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
import React from 'react';
import { renderInTestApp } from '@backstage/test-utils';
import { Nodes } from './Nodes';
import '@testing-library/jest-dom';

jest.mock('@backstage/plugin-catalog-react', () => ({
  useEntity: () => {
    return {
      entity: {
        metadata: {
          name: 'some-cluster',
        },
      },
    };
  },
}));

jest.mock('./useNodes', () => ({
  useNodes: jest.fn().mockReturnValue({
    loading: false,
    value: {
      items: [
        {
          metadata: {
            name: 'some-node-name',
          },
          status: {
            conditions: [
              {
                type: 'Ready',
                status: 'True',
              },
            ],
            nodeInfo: {
              operatingSystem: 'linux',
              architecture: 'ARM',
            },
          },
        },
        {
          metadata: {
            name: 'some-node-bad-name',
          },
          spec: {
            unschedulable: true,
          },
          status: {
            conditions: [
              {
                type: 'Ready',
                status: 'False',
              },
            ],
            nodeInfo: {
              operatingSystem: 'windows',
              architecture: 'x86',
            },
          },
        },
      ],
    },
  }),
}));

describe('Nodes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('displays nodes table - ready schedulable node', async () => {
    const { getByText } = await renderInTestApp(<Nodes />);

    expect(getByText('Nodes')).toBeInTheDocument();

    // Titles
    expect(getByText('Name')).toBeInTheDocument();
    expect(getByText('Schedulable')).toBeInTheDocument();
    expect(getByText('Status')).toBeInTheDocument();
    expect(getByText('OS')).toBeInTheDocument();

    // Row 1
    expect(getByText('some-node-name')).toBeInTheDocument();
    expect(getByText('✅')).toBeInTheDocument();
    expect(getByText('Ready')).toBeInTheDocument();
    expect(getByText('linux (ARM)')).toBeInTheDocument();

    // Row 2
    expect(getByText('some-node-bad-name')).toBeInTheDocument();
    expect(getByText('❌')).toBeInTheDocument();
    expect(getByText('Not Ready')).toBeInTheDocument();
    expect(getByText('windows (x86)')).toBeInTheDocument();
  });
});
