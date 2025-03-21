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
import {
  isComponentType,
  isKind,
  isNamespace,
  isResourceType,
  isApiType,
  isEntityWith,
} from './conditions';

const kubernetesClusterResource: Entity = {
  apiVersion: '',
  kind: 'Resource',
  metadata: { name: 'aKubernetesCluster' },
  spec: { type: 'kubernetes-cluster' },
};

const databaseResource: Entity = {
  apiVersion: '',
  kind: 'Resource',
  metadata: { name: 'aDatabase' },
  spec: { type: 'database' },
};

const notResource: Entity = {
  apiVersion: '',
  kind: 'not-Resource',
  metadata: { name: 'aService' },
  spec: { type: 'service' },
};

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

const graphqlApi: Entity = {
  apiVersion: '',
  kind: 'api',
  metadata: { name: 'aProtocol' },
  spec: { type: 'graphql' },
};

const grpcApi: Entity = {
  apiVersion: '',
  kind: 'api',
  metadata: { name: 'aProtocol' },
  spec: { type: 'grpc' },
};

const notApi: Entity = {
  apiVersion: '',
  kind: 'not-api',
  metadata: { name: 'aProtocol' },
  spec: { type: 'grpc' },
};

const missingSpecType: Entity = {
  apiVersion: '',
  kind: 'another-type',
  metadata: { name: 'anEntity' },
  spec: {},
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

describe('isResourceType', () => {
  it('should false on non resource kinds', () => {
    const checkEntity = isResourceType('kubernetes-cluster');

    expect(checkEntity(notResource)).not.toBeTruthy();
  });
  it('should check for the intended type', () => {
    const checkEntity = isResourceType('kubernetes-cluster');

    expect(checkEntity(databaseResource)).not.toBeTruthy();
    expect(checkEntity(kubernetesClusterResource)).toBeTruthy();
  });
  it('should check for multiple types', () => {
    const checkEntity = isResourceType(['database', 'kubernetes-cluster']);

    expect(checkEntity(databaseResource)).toBeTruthy();
    expect(checkEntity(kubernetesClusterResource)).toBeTruthy();
  });
});

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

describe('isApiType', () => {
  it('should false on non API kinds', () => {
    const checkEntity = isApiType('openapi');

    expect(checkEntity(notApi)).not.toBeTruthy();
  });
  it('should check for the intended type', () => {
    const checkEntity = isApiType('grpc');

    expect(checkEntity(graphqlApi)).not.toBeTruthy();
    expect(checkEntity(grpcApi)).toBeTruthy();
  });
  it('should check for multiple types', () => {
    const checkEntity = isApiType(['grpc', 'graphql']);

    expect(checkEntity(graphqlApi)).toBeTruthy();
    expect(checkEntity(grpcApi)).toBeTruthy();
  });
});

describe('isEntityWith', () => {
  it('allows for a kind-only check (empty type array)', () => {
    const checkEntity = isEntityWith({ kind: 'api', type: [] });
    expect(checkEntity(apiKind)).toBeTruthy();
  });
  it('handles missing spec.type field', () => {
    const checkEntity = isEntityWith({ kind: 'another-type', type: 'service' });
    expect(checkEntity(missingSpecType)).not.toBeTruthy();
  });
  it('allows a check against no criteria', () => {
    const checkEntity = isEntityWith({});
    expect(checkEntity(apiKind)).toBeTruthy();
  });
  it('allows a check against empty criteria', () => {
    const checkEntity = isEntityWith({ kind: [], type: [] });
    expect(checkEntity(apiKind)).toBeTruthy();
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
