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

import { createUpdateKindVersionOp } from './updateKindVersion';

describe('createUpdateKindVersionOp', () => {
  it('should create a valid op with the op field filled in', () => {
    const result = createUpdateKindVersionOp({
      kind: 'Component',
      name: 'v1alpha1',
      properties: {
        schema: {
          jsonSchema: { type: 'object' },
        },
      },
    });

    expect(result).toEqual({
      op: 'updateKindVersion.v1',
      kind: 'Component',
      name: 'v1alpha1',
      properties: {
        schema: {
          jsonSchema: { type: 'object' },
        },
      },
    });
  });

  it('should accept optional fields', () => {
    const result = createUpdateKindVersionOp({
      kind: 'Component',
      name: 'v1alpha1',
      specType: 'service',
      properties: {
        description: 'A service component',
        relationFields: [
          {
            selector: { path: 'spec.owner' },
            relation: 'ownedBy',
            defaultKind: 'Group',
            defaultNamespace: 'inherit',
          },
        ],
      },
    });

    expect(result.op).toBe('updateKindVersion.v1');
    expect(result.specType).toBe('service');
    expect(result.properties.description).toBe('A service component');
    expect(result.properties.relationFields).toHaveLength(1);
    expect(result.properties.schema).toBeUndefined();
  });

  it('should accept all-optional properties', () => {
    const result = createUpdateKindVersionOp({
      kind: 'Component',
      name: 'v1alpha1',
      properties: {},
    });

    expect(result.op).toBe('updateKindVersion.v1');
    expect(result.properties).toEqual({});
  });

  it('should reject unknown fields', () => {
    expect(() =>
      createUpdateKindVersionOp({
        kind: 'Component',
        name: 'v1alpha1',
        properties: {},
        extra: 'should be rejected',
      } as any),
    ).toThrow(/extra/);
  });

  it('should throw on missing required fields', () => {
    expect(() =>
      createUpdateKindVersionOp({
        kind: 'Component',
      } as any),
    ).toThrow(/name/);
  });

  it('should throw on wrong field types', () => {
    expect(() =>
      createUpdateKindVersionOp({
        kind: 123,
        name: 'v1alpha1',
        properties: {},
      } as any),
    ).toThrow(/kind/);
  });
});
