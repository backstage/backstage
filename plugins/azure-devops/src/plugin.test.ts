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
import { azureDevOpsPlugin, isAzurePipelinesAvailable } from './plugin';

describe('azure-devops', () => {
  it('should export plugin', () => {
    expect(azureDevOpsPlugin).toBeDefined();
  });

  describe('isAzurePipelinesAvailable', () => {
    it('should be true when project-repo annotation is present', () => {
      const entity: Entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          namespace: 'default',
          name: 'sample',
          annotations: {
            'dev.azure.com/project-repo': 'projectName/repoName',
          },
        },
      };
      expect(isAzurePipelinesAvailable(entity)).toBe(true);
    });

    it('should be true when project and build-definition annotation is present', () => {
      const entity: Entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          namespace: 'default',
          name: 'sample',
          annotations: {
            'dev.azure.com/project': 'projectName',
            'dev.azure.com/build-definition': 'buildDefinitionName',
          },
        },
      };
      expect(isAzurePipelinesAvailable(entity)).toBe(true);
    });

    it('should be true when project-repo and build-definition annotation is present', () => {
      const entity: Entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          namespace: 'default',
          name: 'sample',
          annotations: {
            'dev.azure.com/project-repo': 'projectName/repoName',
            'dev.azure.com/build-definition': 'buildDefinitionName',
          },
        },
      };
      expect(isAzurePipelinesAvailable(entity)).toBe(true);
    });

    it('should be false when no annotations are present', () => {
      const entity: Entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          namespace: 'default',
          name: 'sample',
        },
      };
      expect(isAzurePipelinesAvailable(entity)).toBe(false);
    });

    it('should be false when only project annotation is present', () => {
      const entity: Entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          namespace: 'default',
          name: 'sample',
          annotations: {
            'dev.azure.com/project': 'projectName',
          },
        },
      };
      expect(isAzurePipelinesAvailable(entity)).toBe(false);
    });

    it('should be false when only build-definition annotation is present', () => {
      const entity: Entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          namespace: 'default',
          name: 'sample',
          annotations: {
            'dev.azure.com/build-definition': 'buildDefinitionName',
          },
        },
      };
      expect(isAzurePipelinesAvailable(entity)).toBe(false);
    });
  });
});
