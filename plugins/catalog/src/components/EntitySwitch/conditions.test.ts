/*
 * Copyright 2022 The Backstage Authors
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
import { isComponentType, isKind, isNamespace } from './conditions';

const serviceComponent: Entity = {
  apiVersion: '',
  kind: 'component',
  metadata: { name: 'aService' },
  spec: { type: 'service' },
};

const websiteComponent: Entity = {
  apiVersion: '',
  kind: 'component',
  metadata: { name: 'aService' },
  spec: { type: 'website' },
};

const notComponent: Entity = {
  apiVersion: '',
  kind: 'not-component',
  metadata: { name: 'aService' },
  spec: { type: 'service' },
};

const apiKind: Entity = {
  apiVersion: '',
  kind: 'api',
  metadata: { name: 'api' },
  spec: { type: 'api' },
};

const aNamespace: Entity = {
  apiVersion: '',
  kind: 'component',
  metadata: { name: 'aService', namespace: 'a' },
  spec: { type: 'service' },
};

const bNamespace: Entity = {
  apiVersion: '',
  kind: 'component',
  metadata: { name: 'aService', namespace: 'b' },
  spec: { type: 'service' },
};

describe('isComponentType', () => {
  it('should false on non component kinds', () => {
    const checkEntity = isComponentType('service');

    expect(checkEntity(notComponent)).not.toBeTruthy();
  });
  it('should check for the intended type', () => {
    const checkEntity = isComponentType('service');

    expect(checkEntity(websiteComponent)).not.toBeTruthy();
    expect(checkEntity(serviceComponent)).toBeTruthy();
  });
  it('should check for multiple types', () => {
    const checkEntity = isComponentType(['service', 'website']);

    expect(checkEntity(serviceComponent)).toBeTruthy();
    expect(checkEntity(websiteComponent)).toBeTruthy();
  });
});

describe('isKind', () => {
  it('should check for the intended kind', () => {
    const checkEntity = isKind('component');

    expect(checkEntity(notComponent)).not.toBeTruthy();
    expect(checkEntity(serviceComponent)).toBeTruthy();
  });
  it('should check for multiple types', () => {
    const checkEntity = isKind(['component', 'api']);

    expect(checkEntity(serviceComponent)).toBeTruthy();
    expect(checkEntity(apiKind)).toBeTruthy();
  });
});

describe('isNamespace', () => {
  it('should check for the intended type', () => {
    const checkEntity = isNamespace('a');

    expect(checkEntity(aNamespace)).toBeTruthy();
    expect(checkEntity(bNamespace)).not.toBeTruthy();
  });
  it('should check for multiple types', () => {
    const checkEntity = isNamespace(['a', 'b']);

    expect(checkEntity(aNamespace)).toBeTruthy();
    expect(checkEntity(bNamespace)).toBeTruthy();
  });
});
