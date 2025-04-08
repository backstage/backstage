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

import { createComponentRef } from '@backstage/frontend-plugin-api';
import { DefaultComponentsApi } from './DefaultComponentsApi';
import { render, screen } from '@testing-library/react';

const testRefA = createComponentRef({ id: 'test.a' });
const testRefB1 = createComponentRef({ id: 'test.b' });
const testRefB2 = createComponentRef({ id: 'test.b' });

describe('DefaultComponentsApi', () => {
  it('should provide components', () => {
    const api = DefaultComponentsApi.fromComponents([
      {
        ref: testRefA,
        impl: () => <div>test.a</div>,
      },
    ]);

    const ComponentA = api.getComponent(testRefA);
    render(<ComponentA />);

    expect(screen.getByText('test.a')).toBeInTheDocument();
  });

  it('should key extension refs by ID', () => {
    const api = DefaultComponentsApi.fromComponents([
      {
        ref: testRefB1,
        impl: () => <div>test.b</div>,
      },
    ]);

    const ComponentB1 = api.getComponent(testRefB1);
    const ComponentB2 = api.getComponent(testRefB2);

    expect(ComponentB1).toBe(ComponentB2);

    render(<ComponentB2 />);

    expect(screen.getByText('test.b')).toBeInTheDocument();
  });
});
