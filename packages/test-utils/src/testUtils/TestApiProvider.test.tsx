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

import React from 'react';
import { createApiRef, useApiHolder } from '@backstage/core-plugin-api';
import { TestApiProvider, TestApiRegistry } from './TestApiProvider';
import { render, screen } from '@testing-library/react';

const xApiRef = createApiRef<{ a: string; b: number }>({
  id: 'x',
});
const yApiRef = createApiRef<string>({
  id: 'y',
});

function Verifier() {
  const holder = useApiHolder();
  const x = holder.get(xApiRef);
  const y = holder.get(yApiRef);

  return (
    <div>
      {x ? (
        <span>
          x={x.a},{x.b}
        </span>
      ) : (
        <span>no x</span>
      )}
      {y ? <span>y={y}</span> : <span>no y</span>}
    </div>
  );
}

describe('TestApiProvider', () => {
  it('should provide APIs', () => {
    render(
      <TestApiProvider
        apis={[
          [xApiRef, { a: 'a', b: 3 }],
          [yApiRef, 'y'],
        ]}
      >
        <Verifier />
      </TestApiProvider>,
    );
    expect(screen.getByText('x=a,3')).toBeInTheDocument();
    expect(screen.getByText('y=y')).toBeInTheDocument();
  });

  it('should provide partial APIs', () => {
    render(
      <TestApiProvider apis={[[xApiRef, { a: 'a' }]]}>
        <Verifier />
      </TestApiProvider>,
    );
    expect(screen.getByText('x=a,')).toBeInTheDocument();
    expect(screen.getByText('no y')).toBeInTheDocument();
  });

  it('should require partial implementations to still match types', () => {
    render(
      // @ts-expect-error
      <TestApiProvider apis={[[xApiRef, { a: 3 }]]}>
        <Verifier />
      </TestApiProvider>,
    );
    expect(screen.getByText('x=3,')).toBeInTheDocument();
    expect(screen.getByText('no y')).toBeInTheDocument();
  });

  it('should allow empty APIs', () => {
    render(
      <TestApiProvider apis={[]}>
        <Verifier />
      </TestApiProvider>,
    );
    expect(screen.getByText('no x')).toBeInTheDocument();
    expect(screen.getByText('no y')).toBeInTheDocument();
  });
});

describe('TestApiRegistry', () => {
  it('should be created with APIs', () => {
    const x = { a: 'a', b: 3 };
    const y = 'y';
    const registry = TestApiRegistry.from([xApiRef, x], [yApiRef, y]);

    expect(registry.get(xApiRef)).toBe(x);
    expect(registry.get(yApiRef)).toBe(y);
  });

  it('should allow partial implementations', () => {
    const x = { a: 'a' };
    const registry = TestApiRegistry.from([xApiRef, x]);

    expect(registry.get(xApiRef)).toBe(x);
    expect(registry.get(yApiRef)).toBeUndefined();
  });

  it('should require partial implementations to match types', () => {
    const x = { a: 2 };
    // @ts-expect-error
    const registry = TestApiRegistry.from([xApiRef, x]);

    expect(registry.get(xApiRef)).toBe(x);
    expect(registry.get(yApiRef)).toBeUndefined();
  });

  it('should prefer last duplicate API that was provided', () => {
    const x1 = { a: 'a' };
    const x2 = { a: 's' };
    const x3 = { a: 'd' };
    const registry = TestApiRegistry.from(
      [xApiRef, x1],
      [xApiRef, x2],
      [xApiRef, x3],
    );

    expect(registry.get(xApiRef)).toBe(x3);
  });
});
