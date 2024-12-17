/*
 * Copyright 2024 The Backstage Authors
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

import { screen } from '@testing-library/react';
import { renderInTestApp } from '@backstage/test-utils';
import { AppIcon } from './icons';

describe('AppIcon', () => {
  it('should render the correct system icon', async () => {
    await renderInTestApp(<AppIcon data-testid="Api Icon" id="kind:api" />);
    expect(screen.getByTestId('Api Icon')).toBeDefined();
  });

  it('should render the default fallback component', async () => {
    await renderInTestApp(
      <AppIcon data-testid="Fallback Icon" id="kind:api" />,
    );
    expect(screen.getByTestId('Fallback Icon')).toBeDefined();
  });

  it('should render the custom fallback component', async () => {
    await renderInTestApp(
      <AppIcon id="unknown" Fallback={() => <div>Fallback Icon</div>} />,
    );
    expect(screen.getByText('Fallback Icon')).toBeInTheDocument();
  });
});
