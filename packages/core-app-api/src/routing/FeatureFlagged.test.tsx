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
import { FeatureFlagged } from './FeatureFlagged';
import { render, screen } from '@testing-library/react';
import { LocalStorageFeatureFlags } from '../apis';
import { TestApiProvider } from '@backstage/test-utils';
import { featureFlagsApiRef } from '@backstage/core-plugin-api';

const mockFeatureFlagsApi = new LocalStorageFeatureFlags();
const Wrapper = ({ children }: { children?: React.ReactNode }) => (
  <TestApiProvider apis={[[featureFlagsApiRef, mockFeatureFlagsApi]]}>
    {children}
  </TestApiProvider>
);

describe('FeatureFlagged', () => {
  describe('with', () => {
    it('should render contents when the feature flag is enabled', async () => {
      jest
        .spyOn(mockFeatureFlagsApi, 'isActive')
        .mockImplementation(() => true);

      render(
        <Wrapper>
          <div>
            <FeatureFlagged with="hello-flag">
              <p>BACKSTAGE!</p>
            </FeatureFlagged>
          </div>
        </Wrapper>,
      );

      expect(screen.getByText('BACKSTAGE!')).toBeInTheDocument();
    });
    it('should not render contents when the feature flag is disabled', async () => {
      jest
        .spyOn(mockFeatureFlagsApi, 'isActive')
        .mockImplementation(() => false);

      render(
        <Wrapper>
          <div>
            <FeatureFlagged with="hello-flag">
              <p>BACKSTAGE!</p>
            </FeatureFlagged>
          </div>
        </Wrapper>,
      );

      expect(screen.queryByText('BACKSTAGE!')).not.toBeInTheDocument();
    });
  });
  describe('without', () => {
    it('should not render contents when the feature flag is enabled', async () => {
      jest
        .spyOn(mockFeatureFlagsApi, 'isActive')
        .mockImplementation(() => true);

      render(
        <Wrapper>
          <div>
            <FeatureFlagged without="hello-flag">
              <p>BACKSTAGE!</p>
            </FeatureFlagged>
          </div>
        </Wrapper>,
      );

      expect(screen.queryByText('BACKSTAGE!')).not.toBeInTheDocument();
    });
    it('should render contents when the feature flag is disabled', async () => {
      jest
        .spyOn(mockFeatureFlagsApi, 'isActive')
        .mockImplementation(() => false);

      render(
        <Wrapper>
          <div>
            <FeatureFlagged without="hello-flag">
              <p>BACKSTAGE!</p>
            </FeatureFlagged>
          </div>
        </Wrapper>,
      );

      expect(screen.getByText('BACKSTAGE!')).toBeInTheDocument();
    });
  });
});
