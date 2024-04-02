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

import { parseEntityOrderFieldParams } from './parseEntityOrderFieldParams';

describe('parseEntityOrderFieldParams', () => {
  it('supports no order fields', () => {
    const result = parseEntityOrderFieldParams({});
    expect(result).toEqual(undefined);
  });

  it('supports single orderField', () => {
    const result = parseEntityOrderFieldParams({
      orderField: ['metadata.name,desc'],
    })!;
    expect(result).toEqual([{ field: 'metadata.name', order: 'desc' }]);
  });

  it('supports single orderField without order', () => {
    const result = parseEntityOrderFieldParams({
      orderField: ['metadata.name'],
    })!;
    expect(result).toEqual([{ field: 'metadata.name' }]);
  });

  it('supports multiple order fields', () => {
    const result = parseEntityOrderFieldParams({
      orderField: ['metadata.name,desc', 'metadata.uid,asc'],
    });

    expect(result).toEqual([
      { field: 'metadata.name', order: 'desc' },
      { field: 'metadata.uid', order: 'asc' },
    ]);
  });

  it('throws if orderField order is not valid', () => {
    expect(() =>
      parseEntityOrderFieldParams({
        orderField: ['metadata.name,desc', 'metadata.uid,invalid'],
      }),
    ).toThrow(/Invalid order field order/);
  });
});
