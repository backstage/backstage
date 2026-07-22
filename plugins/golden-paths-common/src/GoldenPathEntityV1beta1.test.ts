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
import {
  isGoldenPathEntityV1beta1,
  goldenPathEntityV1beta1Validator,
} from './GoldenPathEntityV1beta1';
import { Entity } from '@backstage/catalog-model';

describe('isGoldenPathEntityV1beta1', () => {
  it('should return true for valid GoldenPathEntityV1beta1', () => {
    const entity: Entity = {
      apiVersion: 'backstage.io/v1beta1',
      kind: 'GoldenPath',
      metadata: { name: 'example' },
      spec: {
        type: 'example-type',
        steps: [],
      },
    };
    expect(isGoldenPathEntityV1beta1(entity)).toBe(true);
  });

  it('should return false for invalid GoldenPathEntityV1beta1', () => {
    const entity: Entity = {
      apiVersion: 'backstage.io/v1beta1',
      kind: 'NotGoldenPath',
      metadata: { name: 'example' },
      spec: {
        type: 'example-type',
        steps: [],
      },
    };
    expect(isGoldenPathEntityV1beta1(entity)).toBe(false);
  });
});

describe('goldenPathEntityV1beta1Validator', () => {
  it('should validate a correct entity', async () => {
    const entity: Entity = {
      apiVersion: 'backstage.io/v1beta1',
      kind: 'GoldenPath',
      metadata: { name: 'example' },
      spec: {
        type: 'example-type',
        steps: [],
      },
    };
    const result = await goldenPathEntityV1beta1Validator.check(entity);
    expect(result).toBe(true);
  });
});
