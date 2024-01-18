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
import { ApiResources } from './ApiResources';
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

jest.mock('./useApiResources', () => ({
  useApiResources: jest.fn().mockReturnValue({
    loading: false,
    value: {
      groups: [
        {
          name: 'some-apiVersion',
          preferredVersion: {
            groupVersion: 'some-group-version',
          },
        },
      ],
    },
  }),
}));

describe('ApiResources', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('displays ApiResources', async () => {
    const { getByText } = await renderInTestApp(<ApiResources />);

    // Title
    expect(getByText('Name')).toBeInTheDocument();
    expect(getByText('Preferred Version')).toBeInTheDocument();

    // Row 1
    expect(getByText('some-apiVersion')).toBeInTheDocument();
    expect(getByText('some-group-version')).toBeInTheDocument();
  });
});
