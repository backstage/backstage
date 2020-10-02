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

import {
  ApiProvider,
  ApiRegistry,
  FeatureFlags,
  featureFlagsApiRef,
} from '@backstage/core';
import { renderWithEffects, wrapInTestApp } from '@backstage/test-utils';
import { fireEvent } from '@testing-library/react';
import React from 'react';
import { SettingsDialog } from './SettingsDialog';

const apiRegistry = ApiRegistry.from([
  [featureFlagsApiRef, new FeatureFlags()],
]);

describe('<SettingsDialog />', () => {
  const mockFn = jest.fn();

  it('displays the users name and email, and the tabs and titles and updates the position', async () => {
    const rendered = await renderWithEffects(
      wrapInTestApp(
        <ApiProvider apis={apiRegistry}>
          <SettingsDialog updatePosition={mockFn} />
        </ApiProvider>,
      ),
    );

    expect(rendered.getByText('Guest')).toBeInTheDocument();
    expect(rendered.getByText('guest@example.com')).toBeInTheDocument();
    expect(rendered.getByText('App Settings')).toBeInTheDocument();
    expect(rendered.getByText('Additional Settings')).toBeInTheDocument();
    expect(rendered.getByText('Auth Providers')).toBeInTheDocument();
    expect(rendered.getByText('Feature Flags')).toBeInTheDocument();

    const flagButton = rendered.getByText('Feature Flags');
    expect(mockFn).toBeCalledTimes(1);
    fireEvent.click(flagButton);
    expect(mockFn).toBeCalledTimes(2);
  });
});
