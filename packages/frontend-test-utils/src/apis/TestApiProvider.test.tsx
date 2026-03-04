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

import { createApiRef } from '@backstage/frontend-plugin-api';
import { TestApiProvider } from './TestApiProvider';
import { mockApis } from './mockApis';
import { render, screen } from '@testing-library/react';

const xApiRef = createApiRef<{ a: string; b: number }>({
  id: 'x',
});
const yApiRef = createApiRef<string>({
  id: 'y',
});

describe('TestApiProvider', () => {
  it('should provide tuple APIs and check types', () => {
    render(
      <TestApiProvider
        apis={[
          [xApiRef, { a: 'a', b: 3 }],
          [yApiRef, 'y'],
        ]}
      >
        <div />
      </TestApiProvider>,
    );
  });

  it('should allow partial API implementations', () => {
    render(
      <TestApiProvider apis={[[xApiRef, { a: 'a' }]]}>
        <div />
      </TestApiProvider>,
    );
  });

  it('should reject mismatched types in tuple syntax', () => {
    render(
      // @ts-expect-error - a should be a string, not a number
      <TestApiProvider apis={[[xApiRef, { a: 3 }]]}>
        <div />
      </TestApiProvider>,
    );
  });

  it('should accept MockWithApiFactory entries', () => {
    render(
      <TestApiProvider apis={[mockApis.alert()]}>
        <div />
      </TestApiProvider>,
    );
  });

  it('should accept a mix of tuples and MockWithApiFactory entries', () => {
    render(
      <TestApiProvider apis={[[xApiRef, { a: 'a' }], mockApis.alert()]}>
        <div />
      </TestApiProvider>,
    );
  });

  it('should allow empty APIs', () => {
    render(
      <TestApiProvider apis={[]}>
        <div />
      </TestApiProvider>,
    );
  });

  it('should provide APIs at runtime', async () => {
    const alertApi = mockApis.alert();

    render(
      <TestApiProvider apis={[[xApiRef, { a: 'hello', b: 42 }], alertApi]}>
        <span>rendered</span>
      </TestApiProvider>,
    );

    expect(await screen.findByText('rendered')).toBeInTheDocument();
  });
});
