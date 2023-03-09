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
import { Entity } from '@backstage/catalog-model';
import { isFireHydrantAvailable, getFireHydrantServiceName } from './hooks';

describe('firehydrant-hooks-isFireHydrantAvailable', () => {
  it('should find an annotation', () => {
    const e: Entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: {
        namespace: 'default',
        name: 'test-fh-name',
        annotations: {
          'firehydrant.com/service-name': 'test-fh-name',
        },
      },
    };
    expect(isFireHydrantAvailable(e)).toEqual(true);
  });

  it('should not find an annotation', () => {
    const e: Entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: {
        namespace: 'default',
        name: 'test-fh-name',
      },
    };
    expect(isFireHydrantAvailable(e)).toEqual(false);
  });
});

describe('firehydrant-hooks-getFireHydrantServiceName', () => {
  it('should return annotation service name', () => {
    const expected = 'test-fh-name';
    const e: Entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: {
        namespace: 'default',
        name: 'test-fh-name',
        annotations: {
          'firehydrant.com/service-name': expected,
        },
      },
    };
    expect(getFireHydrantServiceName(e)).toEqual(expected);
  });

  it('should return generated service name', () => {
    const expected = 'Component:default/test-fh-name';
    const e: Entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: {
        namespace: 'default',
        name: 'test-fh-name',
        annotations: {},
      },
    };
    expect(getFireHydrantServiceName(e)).toEqual(expected);
  });
});
