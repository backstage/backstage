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
import { withLocations } from './withLocations';

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

describe('withLocations', () => {
  it('should test withLocations function for API Entity', () => {
    expect(withLocations('http://test.com', 'test', apiEntity)).toEqual({
      apiVersion: '',
      kind: 'api',
      metadata: {
        annotations: {
          'backstage.io/managed-by-location': 'url:http://test.com/api',
          'backstage.io/managed-by-origin-location': 'url:http://test.com/api',
        },
        name: 'api',
      },
    });
  });

  it('should test withLocations function for Component Entity', () => {
    expect(withLocations('http://test.com', 'test', componentEntity)).toEqual({
      apiVersion: '',
      kind: 'component',
      metadata: {
        annotations: {
          'backstage.io/managed-by-location': 'url:http://test.com/Component',
          'backstage.io/managed-by-origin-location':
            'url:http://test.com/Component',
        },
        name: 'Component',
      },
    });
  });

  it('should test withLocations function for Domain Entity', () => {
    expect(withLocations('http://test.com', 'test', domainEntity)).toEqual({
      apiVersion: '',
      kind: 'domain',
      metadata: {
        annotations: {
          'backstage.io/managed-by-location': 'url:http://test.com/Domain',
          'backstage.io/managed-by-origin-location':
            'url:http://test.com/Domain',
        },
        name: 'Domain',
      },
    });
  });

  it('should test withLocations function for Group Entity', () => {
    expect(withLocations('http://test.com', 'test', groupEntity)).toEqual({
      apiVersion: '',
      kind: 'group',
      metadata: {
        annotations: {
          'backstage.io/managed-by-location': 'url:http://test.com/Group',
          'backstage.io/managed-by-origin-location':
            'url:http://test.com/Group',
        },
        name: 'Group',
      },
    });
  });

  it('should test withLocations function for Location Entity', () => {
    expect(withLocations('http://test.com', 'test', locationEntity)).toEqual({
      apiVersion: '',
      kind: 'location',
      metadata: {
        annotations: {
          'backstage.io/managed-by-location': 'url:http://test.com/Location',
          'backstage.io/managed-by-origin-location':
            'url:http://test.com/Location',
        },
        name: 'Location',
      },
    });
  });

  it('should test withLocations function for Resource Entity', () => {
    expect(withLocations('http://test.com', 'test', resourceEntity)).toEqual({
      apiVersion: '',
      kind: 'resource',
      metadata: {
        annotations: {
          'backstage.io/managed-by-location': 'url:http://test.com/Resource',
          'backstage.io/managed-by-origin-location':
            'url:http://test.com/Resource',
        },
        name: 'Resource',
      },
    });
  });

  it('should test withLocations function for System Entity', () => {
    expect(withLocations('http://test.com', 'test', systemEntity)).toEqual({
      apiVersion: '',
      kind: 'system',
      metadata: {
        annotations: {
          'backstage.io/managed-by-location': 'url:http://test.com/System',
          'backstage.io/managed-by-origin-location':
            'url:http://test.com/System',
        },
        name: 'System',
      },
    });
  });

  it('should test withLocations function for User Entity', () => {
    expect(withLocations('http://test.com', 'test', userEntity)).toEqual({
      apiVersion: '',
      kind: 'user',
      metadata: {
        annotations: {
          'backstage.io/managed-by-location': 'url:http://test.com/User',
          'backstage.io/managed-by-origin-location': 'url:http://test.com/User',
        },
        name: 'User',
      },
    });
  });
});
