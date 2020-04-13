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
import { render } from '@testing-library/react';
import BreakHints from './BreakHints';

describe('BreakHints', () => {
  it('Inserts wbr tags in camelCase expressions', () => {
    const { container } = render(<BreakHints body="aCamelCaseWord" />);
    expect(container.innerHTML).toBe('a<wbr>Camel<wbr>Case<wbr>Word');
  });

  it('Inserts wbr tags with periods', () => {
    const { container } = render(<BreakHints body="a.b" />);
    expect(container.innerHTML).toBe('a<wbr>.b');
  });

  it('Inserts wbr tags with underscores', () => {
    const { container } = render(<BreakHints body="a_b" />);
    expect(container.innerHTML).toBe('a<wbr>_b');
  });

  it('Inserts wbr tags with hyphens', () => {
    const { container } = render(<BreakHints body="a-b" />);
    expect(container.innerHTML).toBe('a<wbr>-b');
  });

  it('Inserts wbr tags with forward slashes', () => {
    const { container } = render(<BreakHints body="a/b/c" />);
    expect(container.innerHTML).toBe('a<wbr>/b<wbr>/c');
  });
});
