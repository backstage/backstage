/*
 * Copyright 2026 The Backstage Authors
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

import { createDeclareTagOp } from './declareTag';

describe('createDeclareTagOp', () => {
  it('should create a valid op with the op field filled in', () => {
    const result = createDeclareTagOp({
      name: 'java',
      properties: {
        description: 'Indicates a Java-based component',
      },
    });

    expect(result).toEqual({
      op: 'declareTag.v1',
      name: 'java',
      properties: {
        description: 'Indicates a Java-based component',
      },
    });
  });

  it('should reject unknown fields', () => {
    expect(() =>
      createDeclareTagOp({
        name: 'java',
        properties: {
          description: 'Indicates a Java-based component',
        },
        extra: 'should be rejected',
      } as any),
    ).toThrow(/extra/);
  });

  it('should throw on missing required fields', () => {
    expect(() =>
      createDeclareTagOp({
        name: 'java',
        properties: {},
      } as any),
    ).toThrow(/description/);
  });

  it('should throw on wrong field types', () => {
    expect(() =>
      createDeclareTagOp({
        name: 123,
        properties: {
          description: 'Indicates a Java-based component',
        },
      } as any),
    ).toThrow(/name/);
  });
});
