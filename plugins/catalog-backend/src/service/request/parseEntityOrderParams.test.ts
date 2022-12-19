/*
 * Copyright 2021 The Backstage Authors
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

import { parseEntityOrderParams } from './parseEntityOrderParams';

describe('parseEntityOrderParams', () => {
  it('handles missing parameter', () => {
    expect(parseEntityOrderParams({})).toBeUndefined();
  });

  it('handles parameters with various orders', () => {
    expect(parseEntityOrderParams({ order: ['a', '+b', '-c'] })).toEqual([
      { field: 'a', order: 'asc' },
      { field: 'b', order: 'asc' },
      { field: 'c', order: 'desc' },
    ]);
  });

  it('rejects missing order or key', () => {
    expect(() => parseEntityOrderParams({ order: [''] })).toThrow(
      'Invalid order parameter "", no field given',
    );
    expect(() => parseEntityOrderParams({ order: ['+'] })).toThrow(
      'Invalid order parameter "+", no field given',
    );
    expect(() => parseEntityOrderParams({ order: ['-'] })).toThrow(
      'Invalid order parameter "-", no field given',
    );
  });
});
