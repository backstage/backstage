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
import { DefaultComponentsApi } from './DefaultComponentsApi';
import { render, screen } from '@testing-library/react';

const { ref: testRefA } = createSwappableComponent({ id: 'test.a' });
const { ref: testRefB1 } = createSwappableComponent({ id: 'test.b' });
const { ref: testRefB2 } = createSwappableComponent({ id: 'test.b' });

describe('DefaultComponentsApi', () => {
  it('should provide components', () => {
    const api = DefaultComponentsApi.fromComponents([
      {
        ref: testRefA,
        loader: () => () => <div>test.a</div>,
      },
    ]);

    const ComponentA = api.getComponent(testRefA)?.() as () => JSX.Element;

    render(<ComponentA />);

    expect(screen.getByText('test.a')).toBeInTheDocument();
  });

  it('should key extension refs by ID', () => {
    const mockLoader = jest.fn(() => <div>test.b</div>);
    const api = DefaultComponentsApi.fromComponents([
      {
        ref: testRefB1,
        loader: () => mockLoader,
      },
    ]);

    const ComponentB2 = api.getComponent(testRefB2)?.() as () => JSX.Element;
    const ComponentB1 = api.getComponent(testRefB1)?.() as () => JSX.Element;

    expect(ComponentB1).toBe(ComponentB2);

    render(<ComponentB1 />);

    expect(screen.getByText('test.b')).toBeInTheDocument();
  });
});
