/*
 * Copyright 2023 The Backstage Authors
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

import { createSwappableComponent } from '@backstage/frontend-plugin-api';
import { DefaultSwappableComponentsApi } from './DefaultSwappableComponentsApi';
import { render, screen } from '@testing-library/react';

const { ref: testRefA } = createSwappableComponent({ id: 'test.a' });
const { ref: testRefB1 } = createSwappableComponent({ id: 'test.b' });
const { ref: testRefB2 } = createSwappableComponent({ id: 'test.b' });

describe('DefaultComponentsApi', () => {
  it('should provide components', async () => {
    const api = DefaultSwappableComponentsApi.fromComponents([
      {
        ref: testRefA,
        loader: () => () => <div>test.a</div>,
      },
    ]);

    const ComponentA = api.getComponent(testRefA);

    render(<ComponentA />);

    await expect(screen.findByText('test.a')).resolves.toBeInTheDocument();
  });

  it('should key extension refs by ID', async () => {
    const mockLoader = jest.fn(() => <div>test.b</div>);
    const api = DefaultSwappableComponentsApi.fromComponents([
      {
        ref: testRefB1,
        loader: () => mockLoader,
      },
    ]);

    const ComponentB2 = api.getComponent(testRefB2);

    render(<ComponentB2 />);

    await expect(screen.findByText('test.b')).resolves.toBeInTheDocument();
  });
});
