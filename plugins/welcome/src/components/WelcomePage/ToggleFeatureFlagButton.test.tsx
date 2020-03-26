/*
 * Copyright 2020 Spotify AB
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
import { render, fireEvent } from '@testing-library/react';
import ToggleFeatureFlagButton from './ToggleFeatureFlagButton';
import {
  ApiRegistry,
  featureFlagsApiRef,
  ApiProvider,
  FeatureFlags,
} from '@backstage/core';

describe('ToggleFeatureFlagButton', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('should enable the feature flag', () => {
    const rendered = render(
      <ApiProvider
        apis={ApiRegistry.from([[featureFlagsApiRef, FeatureFlags]])}
      >
        <ToggleFeatureFlagButton />
      </ApiProvider>,
    );

    const button = rendered.getByTestId('button-switch-feature-flag-state');
    expect(button).toBeInTheDocument();

    expect(window.localStorage.featureFlags).toBeUndefined();
    fireEvent.click(button);
    expect(window.localStorage.featureFlags).toBe(
      '{"enable-welcome-box":true}',
    );
  });

  it('should disable the feature flag', () => {
    const rendered = render(
      <ApiProvider
        apis={ApiRegistry.from([[featureFlagsApiRef, FeatureFlags]])}
      >
        <ToggleFeatureFlagButton />
      </ApiProvider>,
    );

    const button = rendered.getByTestId('button-switch-feature-flag-state');
    expect(button).toBeInTheDocument();

    expect(window.localStorage.featureFlags).toBeUndefined();
    fireEvent.click(button);
    fireEvent.click(button);
    expect(window.localStorage.featureFlags).toBe('{}');
  });
});
