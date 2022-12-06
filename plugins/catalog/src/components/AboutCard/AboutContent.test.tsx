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

import {
  Entity,
  RELATION_OWNED_BY,
  RELATION_PART_OF,
} from '@backstage/catalog-model';
import { entityRouteRef } from '@backstage/plugin-catalog-react';
import { renderInTestApp } from '@backstage/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import { AboutContent } from './AboutContent';

describe('<AboutContent />', () => {
  describe('An unknown entity', () => {
    let entity: Entity;

    beforeEach(() => {
      entity = {
        apiVersion: 'custom.company/v1',
        kind: 'Unknown',
        metadata: {
          name: 'software',
          description: 'This is the description',
          tags: ['tag-1'],
        },
        spec: {
          owner: 'o',
          domain: 'd',
          system: 's',
          type: 't',
          lifecycle: 'l',
        },
        relations: [
          {
            type: RELATION_OWNED_BY,
            targetRef: 'user:default/o',
          },
          {
            type: RELATION_PART_OF,
            targetRef: 'system:default/s',
          },
          {
            type: RELATION_PART_OF,
            targetRef: 'domain:default/d',
          },
        ],
      };
    });

    it('renders info', async () => {
      await renderInTestApp(<AboutContent entity={entity} />, {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      });

      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Description').nextSibling).toHaveTextContent(
        'This is the description',
      );
      expect(screen.getByText('Owner')).toBeInTheDocument();
      expect(screen.getByText('Owner').nextSibling).toHaveTextContent('user:o');
      expect(screen.getByText('Domain')).toBeInTheDocument();
      expect(screen.getByText('Domain').nextSibling).toHaveTextContent('d');
      expect(screen.getByText('System')).toBeInTheDocument();
      expect(screen.getByText('System').nextSibling).toHaveTextContent('s');
      expect(screen.queryByText('Parent Component')).not.toBeInTheDocument();
      expect(screen.getByText('Type')).toBeInTheDocument();
      expect(screen.getByText('Type').nextSibling).toHaveTextContent('t');
      expect(screen.getByText('Lifecycle')).toBeInTheDocument();
      expect(screen.getByText('Lifecycle').nextSibling).toHaveTextContent('l');
      expect(screen.getByText('Tags')).toBeInTheDocument();
      expect(screen.getByText('Tags').nextSibling).toHaveTextContent('tag-1');
    });

    it('highlights missing required fields', async () => {
      delete entity.metadata.tags;
      entity.spec = {};
      entity.relations = [];

      await renderInTestApp(<AboutContent entity={entity} />, {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      });

      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Description').nextSibling).toHaveTextContent(
        'This is the description',
      );
      expect(screen.getByText('Owner')).toBeInTheDocument();
      expect(screen.getByText('Owner').nextSibling).toHaveTextContent(
        'No Owner',
      );
      expect(screen.queryByText('Domain')).not.toBeInTheDocument();
      expect(screen.queryByText('System')).not.toBeInTheDocument();
      expect(screen.queryByText('Parent Component')).not.toBeInTheDocument();
      expect(screen.queryByText('Type')).not.toBeInTheDocument();
      expect(screen.queryByText('Lifecycle')).not.toBeInTheDocument();
    });
  });

  describe('API entity', () => {
    let entity: Entity;

    beforeEach(() => {
      entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'API',
        metadata: {
          name: 'software',
          description: 'This is the description',
          tags: ['tag-1'],
        },
        spec: {
          type: 'openapi',
          lifecycle: 'production',
          owner: 'guest',
          definition: '...',
          system: 'system',
        },
        relations: [
          {
            type: RELATION_OWNED_BY,
            targetRef: 'user:default/guest',
          },
          {
            type: RELATION_PART_OF,
            targetRef: 'system:default/system',
          },
        ],
      };
    });

    it('renders info', async () => {
      await renderInTestApp(<AboutContent entity={entity} />, {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      });

      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Description').nextSibling).toHaveTextContent(
        'This is the description',
      );
      expect(screen.getByText('Owner')).toBeInTheDocument();
      expect(screen.getByText('Owner').nextSibling).toHaveTextContent(
        'user:guest',
      );
      expect(screen.queryByText('Domain')).not.toBeInTheDocument();
      expect(screen.getByText('System')).toBeInTheDocument();
      expect(screen.getByText('System').nextSibling).toHaveTextContent(
        'system',
      );
      expect(screen.queryByText('Parent Component')).not.toBeInTheDocument();
      expect(screen.getByText('Type')).toBeInTheDocument();
      expect(screen.getByText('Type').nextSibling).toHaveTextContent('openapi');
      expect(screen.getByText('Lifecycle')).toBeInTheDocument();
      expect(screen.getByText('Lifecycle').nextSibling).toHaveTextContent(
        'production',
      );
      expect(screen.getByText('Tags')).toBeInTheDocument();
      expect(screen.getByText('Tags').nextSibling).toHaveTextContent('tag-1');
    });

    it('highlights missing required fields', async () => {
      delete entity.metadata.tags;
      delete entity.spec!.type;
      delete entity.spec!.lifecycle;
      delete entity.spec!.system;
      entity.relations = [];

      await renderInTestApp(<AboutContent entity={entity} />, {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      });

      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Description').nextSibling).toHaveTextContent(
        'This is the description',
      );
      expect(screen.getByText('Owner')).toBeInTheDocument();
      expect(screen.getByText('Owner').nextSibling).toHaveTextContent(
        'No Owner',
      );
      expect(screen.queryByText('Domain')).not.toBeInTheDocument();
      expect(screen.getByText('System')).toBeInTheDocument();
      expect(screen.getByText('System').nextSibling).toHaveTextContent(
        'No System',
      );
      expect(screen.queryByText('Parent Component')).not.toBeInTheDocument();
      expect(screen.getByText('Type')).toBeInTheDocument();
      expect(screen.getByText('Type').nextSibling).toHaveTextContent('unknown');
      expect(screen.getByText('Lifecycle')).toBeInTheDocument();
      expect(screen.getByText('Lifecycle').nextSibling).toHaveTextContent(
        'unknown',
      );
      expect(screen.getByText('Tags')).toBeInTheDocument();
      expect(screen.getByText('Tags').nextSibling).toHaveTextContent('No Tags');
    });
  });

  describe('Component entity', () => {
    let entity: Entity;

    beforeEach(() => {
      entity = {
        apiVersion: 'v1',
        kind: 'Component',
        metadata: {
          name: 'software',
          description: 'This is the description',
          tags: ['tag-1'],
        },
        spec: {
          owner: 'guest',
          type: 'service',
          lifecycle: 'production',
          system: 'system',
          subcomponentOf: ['parent-software'],
        },
        relations: [
          {
            type: RELATION_OWNED_BY,
            targetRef: 'user:default/guest',
          },
          {
            type: RELATION_PART_OF,
            targetRef: 'system:default/system',
          },
          {
            type: RELATION_PART_OF,
            targetRef: 'component:default/parent-software',
          },
        ],
      };
    });

    it('renders info', async () => {
      await renderInTestApp(<AboutContent entity={entity} />, {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      });

      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Description').nextSibling).toHaveTextContent(
        'This is the description',
      );
      expect(screen.getByText('Owner')).toBeInTheDocument();
      expect(screen.getByText('Owner').nextSibling).toHaveTextContent(
        'user:guest',
      );
      expect(screen.queryByText('Domain')).not.toBeInTheDocument();
      expect(screen.getByText('System')).toBeInTheDocument();
      expect(screen.getByText('System').nextSibling).toHaveTextContent(
        'system',
      );
      expect(screen.getByText('Parent Component')).toBeInTheDocument();
      expect(
        screen.getByText('Parent Component').nextSibling,
      ).toHaveTextContent('parent-software');
      expect(screen.getByText('Type')).toBeInTheDocument();
      expect(screen.getByText('Type').nextSibling).toHaveTextContent('service');
      expect(screen.getByText('Lifecycle')).toBeInTheDocument();
      expect(screen.getByText('Lifecycle').nextSibling).toHaveTextContent(
        'production',
      );
      expect(screen.getByText('Tags')).toBeInTheDocument();
      expect(screen.getByText('Tags').nextSibling).toHaveTextContent('tag-1');
    });

    it('highlights missing required fields', async () => {
      delete entity.metadata.tags;
      delete entity.spec!.type;
      delete entity.spec!.lifecycle;
      delete entity.spec!.system;
      entity.relations = [];

      await renderInTestApp(<AboutContent entity={entity} />, {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      });

      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Description').nextSibling).toHaveTextContent(
        'This is the description',
      );
      expect(screen.getByText('Owner')).toBeInTheDocument();
      expect(screen.getByText('Owner').nextSibling).toHaveTextContent(
        'No Owner',
      );
      expect(screen.queryByText('Domain')).not.toBeInTheDocument();
      expect(screen.getByText('System')).toBeInTheDocument();
      expect(screen.getByText('System').nextSibling).toHaveTextContent(
        'No System',
      );
      expect(screen.queryByText('Parent Component')).not.toBeInTheDocument();
      expect(screen.getByText('Type')).toBeInTheDocument();
      expect(screen.getByText('Type').nextSibling).toHaveTextContent('unknown');
      expect(screen.getByText('Lifecycle')).toBeInTheDocument();
      expect(screen.getByText('Lifecycle').nextSibling).toHaveTextContent(
        'unknown',
      );
      expect(screen.getByText('Tags')).toBeInTheDocument();
      expect(screen.getByText('Tags').nextSibling).toHaveTextContent('No Tags');
    });
  });

  describe('Domain entity', () => {
    let entity: Entity;

    beforeEach(() => {
      entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Domain',
        metadata: {
          name: 'software',
          description: 'This is the description',
          tags: ['tag-1'],
        },
        spec: {
          owner: 'guest',
        },
        relations: [
          {
            type: RELATION_OWNED_BY,
            targetRef: 'user:default/guest',
          },
        ],
      };
    });

    it('renders info', async () => {
      await renderInTestApp(<AboutContent entity={entity} />, {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      });

      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Description').nextSibling).toHaveTextContent(
        'This is the description',
      );
      expect(screen.getByText('Owner')).toBeInTheDocument();
      expect(screen.getByText('Owner').nextSibling).toHaveTextContent(
        'user:guest',
      );
      expect(screen.queryByText('Domain')).not.toBeInTheDocument();
      expect(screen.queryByText('System')).not.toBeInTheDocument();
      expect(screen.queryByText('Parent Component')).not.toBeInTheDocument();
      expect(screen.queryByText('Type')).not.toBeInTheDocument();
      expect(screen.queryByText('Lifecycle')).not.toBeInTheDocument();
      expect(screen.getByText('Tags')).toBeInTheDocument();
      expect(screen.getByText('Tags').nextSibling).toHaveTextContent('tag-1');
    });

    it('highlights missing required fields', async () => {
      delete entity.metadata.tags;
      entity.relations = [];

      await renderInTestApp(<AboutContent entity={entity} />, {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      });

      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Description').nextSibling).toHaveTextContent(
        'This is the description',
      );
      expect(screen.getByText('Owner')).toBeInTheDocument();
      expect(screen.getByText('Owner').nextSibling).toHaveTextContent(
        'No Owner',
      );
      expect(screen.queryByText('Domain')).not.toBeInTheDocument();
      expect(screen.queryByText('System')).not.toBeInTheDocument();
      expect(screen.queryByText('Parent Component')).not.toBeInTheDocument();
      expect(screen.queryByText('Type')).not.toBeInTheDocument();
      expect(screen.queryByText('Lifecycle')).not.toBeInTheDocument();
      expect(screen.getByText('Tags')).toBeInTheDocument();
      expect(screen.getByText('Tags').nextSibling).toHaveTextContent('No Tags');
    });
  });

  describe('Location entity', () => {
    let entity: Entity;

    beforeEach(() => {
      entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Location',
        metadata: {
          name: 'software',
          description: 'This is the description',
          tags: ['tag-1'],
        },
        spec: {
          type: 'root',
          target: 'https://backstage.io',
        },
        relations: [],
      };
    });

    it('renders info', async () => {
      await renderInTestApp(<AboutContent entity={entity} />, {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      });

      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Description').nextSibling).toHaveTextContent(
        'This is the description',
      );
      expect(screen.getByText('Owner')).toBeInTheDocument();
      expect(screen.getByText('Owner').nextSibling).toHaveTextContent(
        'No Owner',
      );
      expect(screen.queryByText('Domain')).not.toBeInTheDocument();
      expect(screen.queryByText('System')).not.toBeInTheDocument();
      expect(screen.queryByText('Parent Component')).not.toBeInTheDocument();
      expect(screen.getByText('Type')).toBeInTheDocument();
      expect(screen.getByText('Type').nextSibling).toHaveTextContent('root');
      expect(screen.queryByText('Lifecycle')).not.toBeInTheDocument();
      expect(screen.getByText('Tags')).toBeInTheDocument();
      expect(screen.getByText('Tags').nextSibling).toHaveTextContent('tag-1');
      expect(screen.getByText('Targets')).toBeInTheDocument();
      expect(screen.getByText('Targets').nextSibling).toHaveTextContent(
        'https://backstage.io',
      );
    });

    it('highlights missing required fields', async () => {
      delete entity.metadata.tags;
      delete entity.spec!.type;

      await renderInTestApp(<AboutContent entity={entity} />, {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      });

      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Description').nextSibling).toHaveTextContent(
        'This is the description',
      );
      expect(screen.getByText('Owner')).toBeInTheDocument();
      expect(screen.getByText('Owner').nextSibling).toHaveTextContent(
        'No Owner',
      );
      expect(screen.queryByText('Domain')).not.toBeInTheDocument();
      expect(screen.queryByText('System')).not.toBeInTheDocument();
      expect(screen.queryByText('Parent Component')).not.toBeInTheDocument();
      expect(screen.getByText('Type')).toBeInTheDocument();
      expect(screen.getByText('Type').nextSibling).toHaveTextContent('unknown');
      expect(screen.queryByText('Lifecycle')).not.toBeInTheDocument();
      expect(screen.getByText('Tags')).toBeInTheDocument();
      expect(screen.getByText('Tags').nextSibling).toHaveTextContent('No Tags');
    });
  });

  describe('Resource entity', () => {
    let entity: Entity;

    beforeEach(() => {
      entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Resource',
        metadata: {
          name: 'software',
          description: 'This is the description',
          tags: ['tag-1'],
        },
        spec: {
          type: 's3',
          owner: 'guest',
          system: 'system',
        },
        relations: [
          {
            type: RELATION_OWNED_BY,
            targetRef: 'user:default/guest',
          },
          {
            type: RELATION_PART_OF,
            targetRef: 'system:default/system',
          },
        ],
      };
    });

    it('renders info', async () => {
      await renderInTestApp(<AboutContent entity={entity} />, {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      });

      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Description').nextSibling).toHaveTextContent(
        'This is the description',
      );
      expect(screen.getByText('Owner')).toBeInTheDocument();
      expect(screen.getByText('Owner').nextSibling).toHaveTextContent(
        'user:guest',
      );
      expect(screen.queryByText('Domain')).not.toBeInTheDocument();
      expect(screen.getByText('System')).toBeInTheDocument();
      expect(screen.getByText('System').nextSibling).toHaveTextContent(
        'system',
      );
      expect(screen.queryByText('Parent Component')).not.toBeInTheDocument();
      expect(screen.getByText('Type')).toBeInTheDocument();
      expect(screen.getByText('Type').nextSibling).toHaveTextContent('s3');
      expect(screen.queryByText('Lifecycle')).not.toBeInTheDocument();
      expect(screen.getByText('Tags')).toBeInTheDocument();
      expect(screen.getByText('Tags').nextSibling).toHaveTextContent('tag-1');
    });

    it('highlights missing required fields', async () => {
      delete entity.metadata.tags;
      delete entity.spec!.type;
      delete entity.spec!.system;
      entity.relations = [];

      await renderInTestApp(<AboutContent entity={entity} />, {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      });

      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Description').nextSibling).toHaveTextContent(
        'This is the description',
      );
      expect(screen.getByText('Owner')).toBeInTheDocument();
      expect(screen.getByText('Owner').nextSibling).toHaveTextContent(
        'No Owner',
      );
      expect(screen.queryByText('Domain')).not.toBeInTheDocument();
      expect(screen.getByText('System')).toBeInTheDocument();
      expect(screen.getByText('System').nextSibling).toHaveTextContent(
        'No System',
      );
      expect(screen.queryByText('Parent Component')).not.toBeInTheDocument();
      expect(screen.getByText('Type')).toBeInTheDocument();
      expect(screen.getByText('Type').nextSibling).toHaveTextContent('unknown');
      expect(screen.queryByText('Lifecycle')).not.toBeInTheDocument();
      expect(screen.getByText('Tags')).toBeInTheDocument();
      expect(screen.getByText('Tags').nextSibling).toHaveTextContent('No Tags');
    });
  });

  describe('System entity', () => {
    let entity: Entity;

    beforeEach(() => {
      entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'System',
        metadata: {
          name: 'software',
          description: 'This is the description',
          tags: ['tag-1'],
        },
        spec: {
          owner: 'guest',
          domain: 'domain',
        },
        relations: [
          {
            type: RELATION_OWNED_BY,
            targetRef: 'user:default/guest',
          },
          {
            type: RELATION_PART_OF,
            targetRef: 'domain:default/domain',
          },
        ],
      };
    });

    it('renders info', async () => {
      await renderInTestApp(<AboutContent entity={entity} />, {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      });

      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Description').nextSibling).toHaveTextContent(
        'This is the description',
      );
      expect(screen.getByText('Owner')).toBeInTheDocument();
      expect(screen.getByText('Owner').nextSibling).toHaveTextContent(
        'user:guest',
      );
      expect(screen.getByText('Domain')).toBeInTheDocument();
      expect(screen.getByText('Domain').nextSibling).toHaveTextContent(
        'domain',
      );
      expect(screen.queryByText('System')).not.toBeInTheDocument();
      expect(screen.queryByText('Parent Component')).not.toBeInTheDocument();
      expect(screen.queryByText('Type')).not.toBeInTheDocument();
      expect(screen.queryByText('Lifecycle')).not.toBeInTheDocument();
      expect(screen.getByText('Tags')).toBeInTheDocument();
      expect(screen.getByText('Tags').nextSibling).toHaveTextContent('tag-1');
    });

    it('highlights missing required fields', async () => {
      delete entity.metadata.tags;
      delete entity.spec!.domain;
      entity.relations = [];

      await renderInTestApp(<AboutContent entity={entity} />, {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      });

      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Description').nextSibling).toHaveTextContent(
        'This is the description',
      );
      expect(screen.getByText('Owner')).toBeInTheDocument();
      expect(screen.getByText('Owner').nextSibling).toHaveTextContent(
        'No Owner',
      );
      expect(screen.getByText('Domain')).toBeInTheDocument();
      expect(screen.getByText('Domain').nextSibling).toHaveTextContent(
        'No Domain',
      );
      expect(screen.queryByText('System')).not.toBeInTheDocument();
      expect(screen.queryByText('Parent Component')).not.toBeInTheDocument();
      expect(screen.queryByText('Type')).not.toBeInTheDocument();
      expect(screen.queryByText('Lifecycle')).not.toBeInTheDocument();
      expect(screen.getByText('Tags')).toBeInTheDocument();
      expect(screen.getByText('Tags').nextSibling).toHaveTextContent('No Tags');
    });
  });
});
