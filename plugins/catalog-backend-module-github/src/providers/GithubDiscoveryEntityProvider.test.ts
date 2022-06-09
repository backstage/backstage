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

import { GroupEntity, UserEntity } from '@backstage/catalog-model';
import {
  withLocations,
  validateYamlObj,
  yamlStringToObjects,
} from './GithubDiscoveryEntityProvider';
import { YamlObject } from '../lib/github';
import yaml from 'yaml';

describe('GithubDiscoveryEntityProvider', () => {
  describe('validateYamlObj', () => {
    it('should return true if the yaml object has the correct mandatory properties', () => {
      const entity: YamlObject = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'User',
        metadata: {
          name: 'githubuser',
        },
        spec: {
          owner: 'owner',
        },
      };
      expect(validateYamlObj(entity)).toBe(true);
    });
    it('should return false if the yaml object is missing any mandatory properties', () => {
      const entity: YamlObject = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'User',
        metadata: {
          name: 'githubuser',
        },
        spec: {
          owner: 'owner',
        },
      };

      const entity1 = entity;
      entity1.apiVersion = '';
      expect(validateYamlObj(entity1)).toBe(false);

      const entity2 = entity;
      entity2.kind = '';
      expect(validateYamlObj(entity2)).toBe(false);

      const entity3 = entity;
      entity3.metadata.name = '';
      expect(validateYamlObj(entity3)).toBe(false);

      const entity4 = entity;
      entity4.spec.owner = '';
      expect(validateYamlObj(entity4)).toBe(false);
    });
  });

  describe('yamlStringToObjects', () => {
    it('should return a JSON object array from a YAML string', () => {
      const obj = {
        app: 'test-application',
      };
      const yamlString = yaml.stringify(obj);
      const result = yamlStringToObjects(yamlString);
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject(obj);
    });
  });

  describe('withLocations', () => {
    it('should set location for user', () => {
      const entity: UserEntity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'User',
        metadata: {
          name: 'githubuser',
        },
        spec: {
          memberOf: [],
        },
      };

      expect(withLocations('https://github.com', 'backstage', entity)).toEqual({
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'User',
        metadata: {
          name: 'githubuser',
          annotations: {
            'backstage.io/managed-by-location':
              'url:https://github.com/githubuser',
            'backstage.io/managed-by-origin-location':
              'url:https://github.com/githubuser',
          },
        },
        spec: {
          memberOf: [],
        },
      });
    });

    it('should set location for group', () => {
      const entity: GroupEntity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Group',
        metadata: {
          name: 'mygroup',
        },
        spec: {
          type: 'team',
          children: [],
        },
      };

      expect(withLocations('https://github.com', 'backstage', entity)).toEqual({
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Group',
        metadata: {
          name: 'mygroup',
          annotations: {
            'backstage.io/managed-by-location':
              'url:https://github.com/orgs/backstage/teams/mygroup',
            'backstage.io/managed-by-origin-location':
              'url:https://github.com/orgs/backstage/teams/mygroup',
          },
        },
        spec: {
          type: 'team',
          children: [],
        },
      });
    });
  });
});
