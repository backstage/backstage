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

import { Entity } from './Entity';
import {
  isApiEntity,
  isComponentEntity,
  isDomainEntity,
  isGroupEntity,
  isLocationEntity,
  isResourceEntity,
  isSystemEntity,
  isUserEntity,
} from './conditions';

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

describe('isApiEntity', () => {
  it('should check for the intended type', () => {
    expect(isApiEntity(componentEntity)).not.toBeTruthy();
    expect(isApiEntity(domainEntity)).not.toBeTruthy();
    expect(isApiEntity(groupEntity)).not.toBeTruthy();
    expect(isApiEntity(locationEntity)).not.toBeTruthy();
    expect(isApiEntity(resourceEntity)).not.toBeTruthy();
    expect(isApiEntity(systemEntity)).not.toBeTruthy();
    expect(isApiEntity(userEntity)).not.toBeTruthy();
    expect(isApiEntity(apiEntity)).toBeTruthy();
  });
});

describe('isComponentEntity', () => {
  it('should check for the intended type', () => {
    expect(isComponentEntity(apiEntity)).not.toBeTruthy();
    expect(isComponentEntity(domainEntity)).not.toBeTruthy();
    expect(isComponentEntity(groupEntity)).not.toBeTruthy();
    expect(isComponentEntity(locationEntity)).not.toBeTruthy();
    expect(isComponentEntity(resourceEntity)).not.toBeTruthy();
    expect(isComponentEntity(systemEntity)).not.toBeTruthy();
    expect(isComponentEntity(userEntity)).not.toBeTruthy();
    expect(isComponentEntity(componentEntity)).toBeTruthy();
  });
});

describe('isDomainEntity', () => {
  it('should check for the intended type', () => {
    expect(isDomainEntity(apiEntity)).not.toBeTruthy();
    expect(isDomainEntity(componentEntity)).not.toBeTruthy();
    expect(isDomainEntity(groupEntity)).not.toBeTruthy();
    expect(isDomainEntity(locationEntity)).not.toBeTruthy();
    expect(isDomainEntity(resourceEntity)).not.toBeTruthy();
    expect(isDomainEntity(systemEntity)).not.toBeTruthy();
    expect(isDomainEntity(userEntity)).not.toBeTruthy();
    expect(isDomainEntity(domainEntity)).toBeTruthy();
  });
});

describe('isGroupEntity', () => {
  it('should check for the intended type', () => {
    expect(isGroupEntity(apiEntity)).not.toBeTruthy();
    expect(isGroupEntity(componentEntity)).not.toBeTruthy();
    expect(isGroupEntity(domainEntity)).not.toBeTruthy();
    expect(isGroupEntity(locationEntity)).not.toBeTruthy();
    expect(isGroupEntity(resourceEntity)).not.toBeTruthy();
    expect(isGroupEntity(systemEntity)).not.toBeTruthy();
    expect(isGroupEntity(userEntity)).not.toBeTruthy();
    expect(isGroupEntity(groupEntity)).toBeTruthy();
  });
});

describe('isLocationEntity', () => {
  it('should check for the intended type', () => {
    expect(isLocationEntity(apiEntity)).not.toBeTruthy();
    expect(isLocationEntity(componentEntity)).not.toBeTruthy();
    expect(isLocationEntity(domainEntity)).not.toBeTruthy();
    expect(isLocationEntity(groupEntity)).not.toBeTruthy();
    expect(isLocationEntity(resourceEntity)).not.toBeTruthy();
    expect(isLocationEntity(systemEntity)).not.toBeTruthy();
    expect(isLocationEntity(userEntity)).not.toBeTruthy();
    expect(isLocationEntity(locationEntity)).toBeTruthy();
  });
});

describe('isResourceEntity', () => {
  it('should check for the intended type', () => {
    expect(isResourceEntity(apiEntity)).not.toBeTruthy();
    expect(isResourceEntity(componentEntity)).not.toBeTruthy();
    expect(isResourceEntity(domainEntity)).not.toBeTruthy();
    expect(isResourceEntity(groupEntity)).not.toBeTruthy();
    expect(isResourceEntity(locationEntity)).not.toBeTruthy();
    expect(isResourceEntity(systemEntity)).not.toBeTruthy();
    expect(isResourceEntity(userEntity)).not.toBeTruthy();
    expect(isResourceEntity(resourceEntity)).toBeTruthy();
  });
});

describe('isSystemEntity', () => {
  it('should check for the intended type', () => {
    expect(isSystemEntity(apiEntity)).not.toBeTruthy();
    expect(isSystemEntity(componentEntity)).not.toBeTruthy();
    expect(isSystemEntity(domainEntity)).not.toBeTruthy();
    expect(isSystemEntity(groupEntity)).not.toBeTruthy();
    expect(isSystemEntity(locationEntity)).not.toBeTruthy();
    expect(isSystemEntity(resourceEntity)).not.toBeTruthy();
    expect(isSystemEntity(userEntity)).not.toBeTruthy();
    expect(isSystemEntity(systemEntity)).toBeTruthy();
  });
});

describe('isUserEntity', () => {
  it('should check for the intended type', () => {
    expect(isUserEntity(apiEntity)).not.toBeTruthy();
    expect(isUserEntity(componentEntity)).not.toBeTruthy();
    expect(isUserEntity(domainEntity)).not.toBeTruthy();
    expect(isUserEntity(groupEntity)).not.toBeTruthy();
    expect(isUserEntity(locationEntity)).not.toBeTruthy();
    expect(isUserEntity(resourceEntity)).not.toBeTruthy();
    expect(isUserEntity(systemEntity)).not.toBeTruthy();
    expect(isUserEntity(userEntity)).toBeTruthy();
  });
});
