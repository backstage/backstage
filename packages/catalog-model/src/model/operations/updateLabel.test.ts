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

import { createUpdateLabelOp } from './updateLabel';

describe('createUpdateLabelOp', () => {
  it('should create a valid op with the op field filled in', () => {
    const result = createUpdateLabelOp({
      name: 'backstage.io/environment',
      properties: {
        title: 'Environment',
      },
    });

    expect(result).toEqual({
      op: 'updateLabel.v1',
      name: 'backstage.io/environment',
      properties: {
        title: 'Environment',
      },
    });
  });

  it('should accept all-optional properties', () => {
    const result = createUpdateLabelOp({
      name: 'backstage.io/environment',
      properties: {},
    });

    expect(result.op).toBe('updateLabel.v1');
    expect(result.properties).toEqual({});
  });

  it('should reject unknown fields', () => {
    expect(() =>
      createUpdateLabelOp({
        name: 'backstage.io/environment',
        properties: {},
        extra: 'should be rejected',
      } as any),
    ).toThrow(/extra/);
  });

  it('should throw on missing required fields', () => {
    expect(() =>
      createUpdateLabelOp({
        properties: {},
      } as any),
    ).toThrow(/name/);
  });

  it('should throw on wrong field types', () => {
    expect(() =>
      createUpdateLabelOp({
        name: 123,
        properties: {},
      } as any),
    ).toThrow(/name/);
  });
});
