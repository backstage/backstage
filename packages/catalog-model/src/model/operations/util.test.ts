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

import { parseOp } from './util';

describe('parseOp', () => {
  it('should parse a valid declareAnnotation op', () => {
    const result = parseOp({
      op: 'declareAnnotation.v1',
      name: 'backstage.io/techdocs-ref',
      properties: {
        description: 'A reference to the TechDocs source',
        schema: { jsonSchema: { type: 'string' } },
      },
    });

    expect(result).toEqual({
      op: {
        op: 'declareAnnotation.v1',
        name: 'backstage.io/techdocs-ref',
        properties: {
          description: 'A reference to the TechDocs source',
          schema: { jsonSchema: { type: 'string' } },
        },
      },
      order: 0,
    });
  });

  it('should parse a valid declareLabel op', () => {
    const result = parseOp({
      op: 'declareLabel.v1',
      name: 'backstage.io/source-location',
      properties: {
        description: 'The source location of the entity',
        schema: { jsonSchema: { type: 'string' } },
      },
    });

    expect(result.op.op).toBe('declareLabel.v1');
    expect(result.order).toBe(1);
  });

  it('should parse a valid declareTag op', () => {
    const result = parseOp({
      op: 'declareTag.v1',
      name: 'java',
      properties: {
        description: 'Indicates a Java-based component',
      },
    });

    expect(result.op.op).toBe('declareTag.v1');
    expect(result.order).toBe(2);
  });

  it('should throw on non-object input', () => {
    expect(() => parseOp('not an object')).toThrow(
      'Invalid op: expected a JSON object',
    );
    expect(() => parseOp(null)).toThrow('Invalid op: expected a JSON object');
    expect(() => parseOp(42)).toThrow('Invalid op: expected a JSON object');
  });

  it('should throw on missing op field', () => {
    expect(() => parseOp({ name: 'test' })).toThrow('Unknown op type');
  });

  it('should throw on unknown op type', () => {
    expect(() => parseOp({ op: 'nonExistent.v1' })).toThrow(
      'Unknown op nonExistent.v1',
    );
  });

  it('should throw on invalid op data', () => {
    expect(() =>
      parseOp({
        op: 'declareAnnotation.v1',
        name: 123,
        properties: {
          description: 'test',
          schema: { jsonSchema: { type: 'string' } },
        },
      }),
    ).toThrow('Invalid op declareAnnotation.v1');
  });
});
