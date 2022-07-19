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
import { getPagerDutyEntity } from './pagerDutyEntity';

const entity: Entity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Component',
  metadata: {
    name: 'pagerduty-test',
    annotations: {
      'pagerduty.com/integration-key': 'abc123',
    },
  },
};

const entityWithoutAnnotations: Entity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Component',
  metadata: {
    name: 'pagerduty-test',
    annotations: {},
  },
};

const entityWithServiceId: Entity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Component',
  metadata: {
    name: 'pagerduty-test',
    annotations: {
      'pagerduty.com/service-id': 'def456',
    },
  },
};

const entityWithAllAnnotations: Entity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Component',
  metadata: {
    name: 'pagerduty-test',
    annotations: {
      'pagerduty.com/integration-key': 'abc123',
      'pagerduty.com/service-id': 'def456',
    },
  },
};

describe('getPagerDutyEntity', () => {
  describe('when entity has no annotations', () => {
    it('returns a PagerDutyEntity', () => {
      expect(getPagerDutyEntity(entityWithoutAnnotations)).toEqual({
        name: 'pagerduty-test',
      });
    });
  });

  describe('when entity has integration key annotation', () => {
    it('returns a PagerDutyEntity', () => {
      expect(getPagerDutyEntity(entity)).toEqual({
        name: 'pagerduty-test',
        integrationKey: 'abc123',
      });
    });
  });

  describe('when entity has service id annotation', () => {
    it('returns a PagerDutyEntity', () => {
      expect(getPagerDutyEntity(entityWithServiceId)).toEqual({
        name: 'pagerduty-test',
        serviceId: 'def456',
      });
    });
  });

  describe('when entity has all annotations', () => {
    it('returns a PagerDutyEntity', () => {
      expect(getPagerDutyEntity(entityWithAllAnnotations)).toEqual({
        name: 'pagerduty-test',
        integrationKey: 'abc123',
        serviceId: 'def456',
      });
    });
  });
});
