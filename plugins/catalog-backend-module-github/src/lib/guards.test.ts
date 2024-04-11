/*
 * Copyright 2020 The Backstage Authors
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
import { areGroupEntities, areUserEntities } from './guards';

const apiEntity: Entity = {
  apiVersion: '',
  kind: 'api',
  metadata: { name: 'api' },
};
const componentEntity: Entity = {
  apiVersion: '',
  kind: 'component',
  metadata: { name: 'Component' },
};
const domainEntity: Entity = {
  apiVersion: '',
  kind: 'domain',
  metadata: { name: 'Domain' },
};
const groupEntity: Entity = {
  apiVersion: '',
  kind: 'group',
  metadata: { name: 'Group' },
};
const locationEntity: Entity = {
  apiVersion: '',
  kind: 'location',
  metadata: { name: 'Location' },
};

const resourceEntity: Entity = {
  apiVersion: '',
  kind: 'resource',
  metadata: { name: 'Resource' },
};

const systemEntity: Entity = {
  apiVersion: '',
  kind: 'system',
  metadata: { name: 'System' },
};

const userEntity: Entity = {
  apiVersion: '',
  kind: 'user',
  metadata: { name: 'User' },
};

describe('Guards', () => {
  it('should check if all entities are user entities', () => {
    expect(areUserEntities([userEntity, systemEntity])).not.toBeTruthy();
    expect(areUserEntities([userEntity, resourceEntity])).not.toBeTruthy();
    expect(areUserEntities([userEntity, groupEntity])).not.toBeTruthy();
    expect(areUserEntities([userEntity, apiEntity])).not.toBeTruthy();
    expect(areUserEntities([userEntity, locationEntity])).not.toBeTruthy();
    expect(areUserEntities([userEntity, domainEntity])).not.toBeTruthy();
    expect(areUserEntities([userEntity, componentEntity])).not.toBeTruthy();
    expect(areUserEntities([userEntity])).toBeTruthy();
  });

  it('should check if all entities are group entities', () => {
    expect(areGroupEntities([groupEntity, systemEntity])).not.toBeTruthy();
    expect(areGroupEntities([groupEntity, resourceEntity])).not.toBeTruthy();
    expect(areGroupEntities([groupEntity, userEntity])).not.toBeTruthy();
    expect(areUserEntities([groupEntity, apiEntity])).not.toBeTruthy();
    expect(areUserEntities([groupEntity, locationEntity])).not.toBeTruthy();
    expect(areUserEntities([groupEntity, domainEntity])).not.toBeTruthy();
    expect(areUserEntities([groupEntity, componentEntity])).not.toBeTruthy();
    expect(areGroupEntities([groupEntity])).toBeTruthy();
  });
});
