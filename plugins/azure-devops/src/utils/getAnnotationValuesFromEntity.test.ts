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
import { getAnnotationValuesFromEntity } from './getAnnotationValuesFromEntity';

describe('getAnnotationValuesFromEntity', () => {
  describe('without any annotations', () => {
    it('should throw annotations not found', () => {
      const entity: Entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          namespace: 'default',
          name: 'project-repo',
        },
      };
      expect(() => getAnnotationValuesFromEntity(entity)).toThrow(
        'Expected "dev.azure.com" annotations were not found',
      );
    });
  });

  describe('with valid project-repo annotation', () => {
    it('should return project and repo', () => {
      const entity: Entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          namespace: 'default',
          name: 'project-repo',
          annotations: {
            'dev.azure.com/project-repo': 'projectName/repoName',
          },
        },
      };
      const values = getAnnotationValuesFromEntity(entity);
      expect(values).toEqual({
        project: 'projectName',
        repo: 'repoName',
        definition: undefined,
        host: undefined,
        org: undefined,
      });
    });
  });

  describe('with invalid project-repo annotation', () => {
    it('should throw incorrect format error', () => {
      const entity: Entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          namespace: 'default',
          name: 'project-repo',
          annotations: {
            'dev.azure.com/project-repo': 'project',
          },
        },
      };

      const test = () => {
        return getAnnotationValuesFromEntity(entity);
      };

      expect(test).toThrow(
        'Invalid value for annotation "dev.azure.com/project-repo"; expected format is: <project-name>/<repo-name>, found: "project"',
      );
    });
  });

  describe('with project-repo annotation missing project', () => {
    it('should throw incorrect format error', () => {
      const entity: Entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          namespace: 'default',
          name: 'project-repo',
          annotations: {
            'dev.azure.com/project-repo': '/repo',
          },
        },
      };

      const test = () => {
        return getAnnotationValuesFromEntity(entity);
      };

      expect(test).toThrow(
        'Invalid value for annotation "dev.azure.com/project-repo"; expected format is: <project-name>/<repo-name>, found: "/repo"',
      );
    });
  });

  describe('with project-repo annotation missing repo', () => {
    it('should throw incorrect format error', () => {
      const entity: Entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          namespace: 'default',
          name: 'project-repo',
          annotations: {
            'dev.azure.com/project-repo': 'project/',
          },
        },
      };

      const test = () => {
        return getAnnotationValuesFromEntity(entity);
      };

      expect(test).toThrow(
        'Invalid value for annotation "dev.azure.com/project-repo"; expected format is: <project-name>/<repo-name>, found: "project/"',
      );
    });
  });

  describe('with valid project and build-definition annotations', () => {
    it('should return project and definition', () => {
      const entity: Entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          namespace: 'default',
          name: 'project-build-definition',
          annotations: {
            'dev.azure.com/project': 'projectName',
            'dev.azure.com/build-definition': 'buildDefinitionName',
          },
        },
      };
      const values = getAnnotationValuesFromEntity(entity);
      expect(values).toEqual({
        project: 'projectName',
        repo: undefined,
        definition: 'buildDefinitionName',
        host: undefined,
        org: undefined,
      });
    });
  });

  describe('with only project annotation', () => {
    it('should throw annotation not found error', () => {
      const entity: Entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          namespace: 'default',
          name: 'project',
          annotations: {
            'dev.azure.com/project': 'projectName',
          },
        },
      };
      const test = () => {
        return getAnnotationValuesFromEntity(entity);
      };

      expect(test).toThrow(
        'Value for annotation "dev.azure.com/build-definition" was not found',
      );
    });
  });

  describe('with only build-definition annotation', () => {
    it('should throw annotation not found error', () => {
      const entity: Entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          namespace: 'default',
          name: 'build-definition',
          annotations: {
            'dev.azure.com/build-definition': 'buildDefinitionName',
          },
        },
      };
      const test = () => {
        return getAnnotationValuesFromEntity(entity);
      };

      expect(test).toThrow(
        'Value for annotation "dev.azure.com/project" was not found',
      );
    });
  });

  describe('with valid project-repo and host-org annotations', () => {
    it('should return project, repo, host, and org', () => {
      const entity: Entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          namespace: 'default',
          name: 'project-repo',
          annotations: {
            'dev.azure.com/project-repo': 'projectName/repoName',
            'dev.azure.com/host-org': 'hostName/organizationName',
          },
        },
      };
      const values = getAnnotationValuesFromEntity(entity);
      expect(values).toEqual({
        project: 'projectName',
        repo: 'repoName',
        definition: undefined,
        host: 'hostName',
        org: 'organizationName',
      });
    });
  });

  describe('with valid project, build-definition, and host-org annotations', () => {
    it('should return project, definition, host and org', () => {
      const entity: Entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          namespace: 'default',
          name: 'project-build-definition',
          annotations: {
            'dev.azure.com/project': 'projectName',
            'dev.azure.com/build-definition': 'buildDefinitionName',
            'dev.azure.com/host-org': 'hostName/organizationName',
          },
        },
      };
      const values = getAnnotationValuesFromEntity(entity);
      expect(values).toEqual({
        project: 'projectName',
        repo: undefined,
        definition: 'buildDefinitionName',
        host: 'hostName',
        org: 'organizationName',
      });
    });
  });

  describe('with invalid host-org annotation', () => {
    it('should throw incorrect format error', () => {
      const entity: Entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          namespace: 'default',
          name: 'host-org',
          annotations: {
            'dev.azure.com/host-org': 'host',
          },
        },
      };

      const test = () => {
        return getAnnotationValuesFromEntity(entity);
      };

      expect(test).toThrow(
        'Invalid value for annotation "dev.azure.com/host-org"; expected format is: <host-name>/<organization-name>, found: "host"',
      );
    });
  });

  describe('with host-org annotation missing host', () => {
    it('should throw incorrect format error', () => {
      const entity: Entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          namespace: 'default',
          name: 'host-org',
          annotations: {
            'dev.azure.com/host-org': '/org',
          },
        },
      };

      const test = () => {
        return getAnnotationValuesFromEntity(entity);
      };

      expect(test).toThrow(
        'Invalid value for annotation "dev.azure.com/host-org"; expected format is: <host-name>/<organization-name>, found: "/org"',
      );
    });
  });

  describe('with host-org annotation missing org', () => {
    it('should throw incorrect format error', () => {
      const entity: Entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          namespace: 'default',
          name: 'host-org',
          annotations: {
            'dev.azure.com/host-org': 'host/',
          },
        },
      };

      const test = () => {
        return getAnnotationValuesFromEntity(entity);
      };

      expect(test).toThrow(
        'Invalid value for annotation "dev.azure.com/host-org"; expected format is: <host-name>/<organization-name>, found: "host/"',
      );
    });
  });

  describe('with tfs subpath for org', () => {
    it('should return host and org', () => {
      const entity: Entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          namespace: 'default',
          name: 'tfs-subpath',
          annotations: {
            'dev.azure.com/project-repo': 'projectName/repoName',
            'dev.azure.com/host-org': 'company.com/tfs/organizationName',
          },
        },
      };

      const values = getAnnotationValuesFromEntity(entity);
      expect(values).toEqual({
        project: 'projectName',
        repo: 'repoName',
        definition: undefined,
        host: 'company.com/tfs',
        org: 'organizationName',
      });
    });
  });

  describe('host-org with more then expected slashes', () => {
    it('should throw incorrect format error', () => {
      const entity: Entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          namespace: 'default',
          name: 'host-org',
          annotations: {
            'dev.azure.com/host-org': 'host/subpath/another-path/org/project',
          },
        },
      };

      const test = () => {
        return getAnnotationValuesFromEntity(entity);
      };

      expect(test).toThrow(
        'Invalid value for annotation "dev.azure.com/host-org"; expected format is: <host-name>/<organization-name>, found: "host/subpath/another-path/org/project"',
      );
    });
  });

  describe('project-repo with more then expected slashes', () => {
    it('should throw incorrect format error', () => {
      const entity: Entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          namespace: 'default',
          name: 'project-repo',
          annotations: {
            'dev.azure.com/project-repo': 'project/another/repo/final',
          },
        },
      };

      const test = () => {
        return getAnnotationValuesFromEntity(entity);
      };

      expect(test).toThrow(
        'Invalid value for annotation "dev.azure.com/project-repo"; expected format is: <project-name>/<repo-name>, found: "project/another/repo/final"',
      );
    });
  });

  describe('projectRepo and buildDefinition are provided', () => {
    it('should return project, repo and buildDefinition', () => {
      const entity: Entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          namespace: 'default',
          name: 'project-repo',
          annotations: {
            'dev.azure.com/build-definition': 'buildDefinitionName',
            'dev.azure.com/project-repo': 'projectName/repoName',
          },
        },
      };
      const values = getAnnotationValuesFromEntity(entity);
      expect(values).toEqual({
        project: 'projectName',
        repo: 'repoName',
        definition: 'buildDefinitionName',
        host: undefined,
        org: undefined,
      });
    });
  });

  describe('project, projectRepo and buildDefinition are provided', () => {
    it('should prefer project over project-repo.project and return no repo', () => {
      const entity: Entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          namespace: 'default',
          name: 'project-repo',
          annotations: {
            'dev.azure.com/project': 'projectName',
            'dev.azure.com/build-definition': 'buildDefinitionName',
            'dev.azure.com/project-repo': 'ignoredProject/repoName',
          },
        },
      };
      const values = getAnnotationValuesFromEntity(entity);
      expect(values).toEqual({
        project: 'projectName',
        repo: undefined,
        definition: 'buildDefinitionName',
        host: undefined,
        org: undefined,
      });
    });
  });
});
