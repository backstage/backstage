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

import React from 'react';
import { screen } from '@testing-library/react';
import { renderInTestApp } from '@backstage/test-utils';
import { SystemIcon } from './SystemIcon';

describe('SystemIcon', () => {
  it('should render the correct system icon', async () => {
    const { container } = await renderInTestApp(<SystemIcon keys="kind:api" />);
    expect(container.querySelector('svg')).toBeDefined();
  });

  it('should render the first found icon when multiple keys are provided', async () => {
    const { container } = await renderInTestApp(
      <SystemIcon keys={['unknown', 'kind:api']} />,
    );
    expect(container.querySelector('svg')).toBeDefined();
  });

  it('should render the fallback component when no system icon is found', async () => {
    await renderInTestApp(
      <SystemIcon keys="unknown" Fallback={() => <div>Fallback Icon</div>} />,
    );
    expect(screen.getByText('Fallback Icon')).toBeInTheDocument();
  });
});
