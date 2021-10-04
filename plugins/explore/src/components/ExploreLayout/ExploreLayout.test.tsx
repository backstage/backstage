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

import {
  ApiProvider,
  ApiRegistry,
  FeatureFlagged,
} from '@backstage/core-app-api';
import {
  FeatureFlagsApi,
  featureFlagsApiRef,
} from '@backstage/core-plugin-api';
import { renderInTestApp } from '@backstage/test-utils';
import { waitFor } from '@testing-library/react';
import React from 'react';
import { ExploreLayout } from './ExploreLayout';

const featureFlagsApi: jest.Mocked<FeatureFlagsApi> = {
  isActive: jest.fn(),
  save: jest.fn(),
  getRegisteredFlags: jest.fn(),
  registerFlag: jest.fn(),
};

const mockApis = ApiRegistry.with(featureFlagsApiRef, featureFlagsApi);

describe('<ExploreLayout />', () => {
  const Wrapper = ({ children }: { children?: React.ReactNode }) => (
    <ApiProvider apis={mockApis}>{children}</ApiProvider>
  );

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders an explore tabbed layout page with defaults', async () => {
    const { getByText } = await renderInTestApp(
      <Wrapper>
        <ExploreLayout>
          <ExploreLayout.Route path="/tools" title="Tools">
            <div>Tools Content</div>
          </ExploreLayout.Route>
        </ExploreLayout>
      </Wrapper>,
    );

    await waitFor(() => {
      expect(getByText('Explore our ecosystem')).toBeInTheDocument();
      expect(
        getByText('Discover solutions available in our ecosystem'),
      ).toBeInTheDocument();
    });
  });

  it('renders a custom page title', async () => {
    const { getByText } = await renderInTestApp(
      <Wrapper>
        <ExploreLayout title="Explore our universe">
          <ExploreLayout.Route path="/tools" title="Tools">
            <div>Tools Content</div>
          </ExploreLayout.Route>
        </ExploreLayout>
      </Wrapper>,
    );

    await waitFor(() =>
      expect(getByText('Explore our universe')).toBeInTheDocument(),
    );
  });

  it('renders a custom page subtitle', async () => {
    const { getByText } = await renderInTestApp(
      <Wrapper>
        <ExploreLayout subtitle="Browse the ACME Corp ecosystem">
          <ExploreLayout.Route path="/tools" title="Tools">
            <div>Tools Content</div>
          </ExploreLayout.Route>
        </ExploreLayout>
      </Wrapper>,
    );

    await waitFor(() =>
      expect(getByText('Browse the ACME Corp ecosystem')).toBeInTheDocument(),
    );
  });

  it('renders feature flagged route', async () => {
    featureFlagsApi.isActive.mockReturnValue(true);

    const { getByText } = await renderInTestApp(
      <Wrapper>
        <ExploreLayout subtitle="Browse the ACME Corp ecosystem">
          <FeatureFlagged with="test-flag">
            <ExploreLayout.Route path="/tools" title="Tools">
              <div>Tools Content</div>
            </ExploreLayout.Route>
          </FeatureFlagged>
          <FeatureFlagged without="test-flag">
            <ExploreLayout.Route path="/tools-v2" title="Tools V2">
              <div>Tools V2 Content</div>
            </ExploreLayout.Route>
          </FeatureFlagged>
        </ExploreLayout>
      </Wrapper>,
    );

    await waitFor(() => expect(getByText('Tools')).toBeInTheDocument());
  });

  it('skips feature flagged route', async () => {
    featureFlagsApi.isActive.mockReturnValue(false);

    const { getByText } = await renderInTestApp(
      <Wrapper>
        <ExploreLayout subtitle="Browse the ACME Corp ecosystem">
          <FeatureFlagged with="test-flag">
            <ExploreLayout.Route path="/tools" title="Tools">
              <div>Tools Content</div>
            </ExploreLayout.Route>
          </FeatureFlagged>
          <FeatureFlagged without="test-flag">
            <ExploreLayout.Route path="/tools-v2" title="Tools V2">
              <div>Tools V2 Content</div>
            </ExploreLayout.Route>
          </FeatureFlagged>
        </ExploreLayout>
      </Wrapper>,
    );

    await waitFor(() => expect(getByText('Tools V2')).toBeInTheDocument());
  });
});
