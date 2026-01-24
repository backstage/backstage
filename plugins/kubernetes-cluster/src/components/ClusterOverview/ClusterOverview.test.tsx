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
import { ClusterOverview } from './ClusterOverview';
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

jest.mock('./useCluster', () => ({
  useCluster: jest.fn().mockReturnValue({
    loading: false,
    value: {
      name: 'some-cluster',
      authProvider: 'google',
    },
  }),
}));

describe('ClusterOverview', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('displays ClusterOverview', async () => {
    const { getByText, queryAllByText } = await renderInTestApp(
      <ClusterOverview />,
    );

    expect(getByText('Name')).toBeInTheDocument();
    expect(getByText('some-cluster')).toBeInTheDocument();
    expect(getByText('Backstage Auth Provider')).toBeInTheDocument();
    expect(getByText('google')).toBeInTheDocument();
    expect(getByText('OIDC Token Provider')).toBeInTheDocument();
    expect(getByText('Dashboard Link')).toBeInTheDocument();
    expect(queryAllByText('N/A')).toHaveLength(2);
  });
});
