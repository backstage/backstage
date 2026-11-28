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

import { ConfigReader } from '@backstage/config';
import {
  TECHDOCS_ANNOTATION,
  TECHDOCS_EXTERNAL_ANNOTATION,
  TECHDOCS_EXTERNAL_PATH_ANNOTATION,
} from '@backstage/plugin-techdocs-common';
import { getEntityDocsRoute } from './helpers';

describe('getEntityDocsRoute', () => {
  const getRoute = jest.fn(
    ({
      namespace,
      kind,
      name,
    }: {
      namespace: string;
      kind: string;
      name: string;
    }) => `/docs/${namespace}/${kind}/${name}`,
  );
  const config = new ConfigReader({});

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('links to the entity itself when using techdocs-ref', () => {
    const url = getEntityDocsRoute(
      {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          name: 'my-service',
          namespace: 'default',
          annotations: {
            [TECHDOCS_ANNOTATION]: 'dir:.',
          },
        },
      },
      getRoute,
      config,
    );

    expect(url).toBe('/docs/default/component/my-service');
  });

  it('links to the referenced entity docs when using techdocs-entity', () => {
    const url = getEntityDocsRoute(
      {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          name: 'feature-1',
          namespace: 'example-1',
          annotations: {
            [TECHDOCS_EXTERNAL_ANNOTATION]:
              'component:example-1/my-component-1',
          },
        },
      },
      getRoute,
      config,
    );

    expect(url).toBe('/docs/example-1/component/my-component-1');
  });

  it('appends techdocs-entity-path for deep links into referenced docs', () => {
    const url = getEntityDocsRoute(
      {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          name: 'feature-1',
          namespace: 'example-1',
          annotations: {
            [TECHDOCS_EXTERNAL_ANNOTATION]:
              'component:example-1/my-component-1',
            [TECHDOCS_EXTERNAL_PATH_ANNOTATION]: '/feature-1/',
          },
        },
      },
      getRoute,
      config,
    );

    expect(url).toBe('/docs/example-1/component/my-component-1/feature-1/');
  });

  it('falls back to the entity own docs route for a malformed techdocs-entity value', () => {
    const url = getEntityDocsRoute(
      {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          name: 'feature-1',
          namespace: 'example-1',
          annotations: {
            [TECHDOCS_EXTERNAL_ANNOTATION]: 'my-component',
          },
        },
      },
      getRoute,
      config,
    );

    expect(url).toBe('/docs/example-1/component/feature-1');
  });
});
