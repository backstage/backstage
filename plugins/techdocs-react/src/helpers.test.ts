/*
 * Copyright 2026 The Backstage Authors
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
import {
  TECHDOCS_EXTERNAL_PATH_ANNOTATION,
  TECHDOCS_EXTERNAL_ANNOTATION,
} from '@backstage/plugin-techdocs-common';
import {
  toLowercaseEntityRefMaybe,
  getEntityRootTechDocsPath,
  buildTechDocsURL,
} from './helpers';
import { ConfigReader } from '@backstage/config';
import { CompoundEntityRef, Entity } from '@backstage/catalog-model';

describe('helpers', () => {
  describe('toLowercaseEntityRefMaybe', () => {
    let entityRef: CompoundEntityRef;

    beforeEach(() => {
      entityRef = {
        kind: 'Component',
        namespace: 'Default',
        name: 'Test',
      };
    });

    it('returns a lowercased entity ref by default', () => {
      const config = new ConfigReader({});

      expect(toLowercaseEntityRefMaybe(entityRef, config)).toEqual({
        kind: 'component',
        namespace: 'default',
        name: 'test',
      });
    });

    it('returns unchanged entityref with legacyUseCaseSensitiveTripletPaths', () => {
      const config = new ConfigReader({
        techdocs: {
          legacyUseCaseSensitiveTripletPaths: true,
        },
      });

      expect(toLowercaseEntityRefMaybe(entityRef, config)).toEqual({
        kind: 'Component',
        namespace: 'Default',
        name: 'Test',
      });
    });
  });

  describe('getEntityRootTechDocsPath', () => {
    it('returns empty string when entity has no annotations', () => {
      const entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          name: 'test',
        },
      };

      expect(getEntityRootTechDocsPath(entity)).toBe('');
    });

    it('returns path with leading slash when annotation has leading slash', () => {
      const entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          name: 'test',
          annotations: {
            [TECHDOCS_EXTERNAL_PATH_ANNOTATION]: '/docs/guide',
          },
        },
      };

      expect(getEntityRootTechDocsPath(entity)).toBe('/docs/guide');
    });

    it('adds leading slash when annotation does not have one', () => {
      const entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          name: 'test',
          annotations: {
            [TECHDOCS_EXTERNAL_PATH_ANNOTATION]: 'docs/guide',
          },
        },
      };

      expect(getEntityRootTechDocsPath(entity)).toBe('/docs/guide');
    });
  });

  describe('buildTechDocsURL', () => {
    const mockRouteFunc = (params: CompoundEntityRef) => {
      return `/docs/${params.namespace}/${params.kind}/${params.name}`;
    };

    it('returns undefined when routeFunc is undefined', () => {
      const entity: Entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          name: 'test',
          namespace: 'default',
        },
      };

      expect(buildTechDocsURL(entity, undefined)).toBeUndefined();
    });

    it('builds URL with lowercase entity ref', () => {
      const entity: Entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          name: 'TestComponent',
          namespace: 'Default',
        },
      };

      const result = buildTechDocsURL(entity, mockRouteFunc);

      expect(result).toBe('/docs/default/component/testcomponent');
    });

    it('uses techdocs-entity annotation when present', () => {
      const entity: Entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          name: 'test',
          namespace: 'default',
          annotations: {
            [TECHDOCS_EXTERNAL_ANNOTATION]:
              'component:other-namespace/other-component',
          },
        },
      };

      const result = buildTechDocsURL(entity, mockRouteFunc);

      expect(result).toBe('/docs/other-namespace/component/other-component');
    });

    it('falls back to original entity when techdocs-entity annotation is invalid', () => {
      const entity: Entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          name: 'test',
          namespace: 'default',
          annotations: {
            [TECHDOCS_EXTERNAL_ANNOTATION]: 'invalid-ref',
          },
        },
      };

      const result = buildTechDocsURL(entity, mockRouteFunc);

      expect(result).toBe('/docs/default/component/test');
    });

    it('combines techdocs-entity and techdocs-entity-path annotations', () => {
      const entity: Entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          name: 'test',
          namespace: 'default',
          annotations: {
            [TECHDOCS_EXTERNAL_ANNOTATION]:
              'component:other-namespace/other-component',
            [TECHDOCS_EXTERNAL_PATH_ANNOTATION]: '/api/reference',
          },
        },
      };

      const result = buildTechDocsURL(entity, mockRouteFunc);

      expect(result).toBe(
        '/docs/other-namespace/component/other-component/api/reference',
      );
    });
  });
});
