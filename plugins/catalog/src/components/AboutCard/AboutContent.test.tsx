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
            target: {
              kind: 'user',
              name: 'o',
              namespace: 'default',
            },
          },
          {
            type: RELATION_PART_OF,
            target: {
              kind: 'system',
              name: 's',
              namespace: 'default',
            },
          },
          {
            type: RELATION_PART_OF,
            target: {
              kind: 'domain',
              name: 'd',
              namespace: 'default',
            },
          },
        ],
      };
    });

    it('renders info', async () => {
      const { getByText, queryByText } = await renderInTestApp(
        <AboutContent entity={entity} />,
        {
          mountedRoutes: {
            '/catalog/:namespace/:kind/:name': entityRouteRef,
          },
        },
      );

      expect(getByText('Description')).toBeInTheDocument();
      expect(getByText('Description').nextSibling).toHaveTextContent(
        'This is the description',
      );
      expect(getByText('Owner')).toBeInTheDocument();
      expect(getByText('Owner').nextSibling).toHaveTextContent('user:o');
      expect(getByText('Domain')).toBeInTheDocument();
      expect(getByText('Domain').nextSibling).toHaveTextContent('d');
      expect(getByText('System')).toBeInTheDocument();
      expect(getByText('System').nextSibling).toHaveTextContent('s');
      expect(queryByText('Parent Component')).not.toBeInTheDocument();
      expect(getByText('Type')).toBeInTheDocument();
      expect(getByText('Type').nextSibling).toHaveTextContent('t');
      expect(getByText('Lifecycle')).toBeInTheDocument();
      expect(getByText('Lifecycle').nextSibling).toHaveTextContent('l');
      expect(getByText('Tags')).toBeInTheDocument();
      expect(getByText('Tags').nextSibling).toHaveTextContent('tag-1');
    });

    it('highlights missing required fields', async () => {
      delete entity.metadata.tags;
      entity.spec = {};
      entity.relations = [];

      const { getByText, queryByText } = await renderInTestApp(
        <AboutContent entity={entity} />,
        {
          mountedRoutes: {
            '/catalog/:namespace/:kind/:name': entityRouteRef,
          },
        },
      );

      expect(getByText('Description')).toBeInTheDocument();
      expect(getByText('Description').nextSibling).toHaveTextContent(
        'This is the description',
      );
      expect(getByText('Owner')).toBeInTheDocument();
      expect(getByText('Owner').nextSibling).toHaveTextContent('No Owner');
      expect(queryByText('Domain')).not.toBeInTheDocument();
      expect(queryByText('System')).not.toBeInTheDocument();
      expect(queryByText('Parent Component')).not.toBeInTheDocument();
      expect(queryByText('Type')).not.toBeInTheDocument();
      expect(queryByText('Lifecycle')).not.toBeInTheDocument();
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
            target: {
              kind: 'user',
              name: 'guest',
              namespace: 'default',
            },
          },
          {
            type: RELATION_PART_OF,
            target: {
              kind: 'system',
              name: 'system',
              namespace: 'default',
            },
          },
        ],
      };
    });

    it('renders info', async () => {
      const { getByText, queryByText } = await renderInTestApp(
        <AboutContent entity={entity} />,
        {
          mountedRoutes: {
            '/catalog/:namespace/:kind/:name': entityRouteRef,
          },
        },
      );

      expect(getByText('Description')).toBeInTheDocument();
      expect(getByText('Description').nextSibling).toHaveTextContent(
        'This is the description',
      );
      expect(getByText('Owner')).toBeInTheDocument();
      expect(getByText('Owner').nextSibling).toHaveTextContent('user:guest');
      expect(queryByText('Domain')).not.toBeInTheDocument();
      expect(getByText('System')).toBeInTheDocument();
      expect(getByText('System').nextSibling).toHaveTextContent('system');
      expect(queryByText('Parent Component')).not.toBeInTheDocument();
      expect(getByText('Type')).toBeInTheDocument();
      expect(getByText('Type').nextSibling).toHaveTextContent('openapi');
      expect(getByText('Lifecycle')).toBeInTheDocument();
      expect(getByText('Lifecycle').nextSibling).toHaveTextContent(
        'production',
      );
      expect(getByText('Tags')).toBeInTheDocument();
      expect(getByText('Tags').nextSibling).toHaveTextContent('tag-1');
    });

    it('highlights missing required fields', async () => {
      delete entity.metadata.tags;
      delete entity.spec!.type;
      delete entity.spec!.lifecycle;
      delete entity.spec!.system;
      entity.relations = [];

      const { getByText, queryByText } = await renderInTestApp(
        <AboutContent entity={entity} />,
        {
          mountedRoutes: {
            '/catalog/:namespace/:kind/:name': entityRouteRef,
          },
        },
      );

      expect(getByText('Description')).toBeInTheDocument();
      expect(getByText('Description').nextSibling).toHaveTextContent(
        'This is the description',
      );
      expect(getByText('Owner')).toBeInTheDocument();
      expect(getByText('Owner').nextSibling).toHaveTextContent('No Owner');
      expect(queryByText('Domain')).not.toBeInTheDocument();
      expect(getByText('System')).toBeInTheDocument();
      expect(getByText('System').nextSibling).toHaveTextContent('No System');
      expect(queryByText('Parent Component')).not.toBeInTheDocument();
      expect(getByText('Type')).toBeInTheDocument();
      expect(getByText('Type').nextSibling).toHaveTextContent('unknown');
      expect(getByText('Lifecycle')).toBeInTheDocument();
      expect(getByText('Lifecycle').nextSibling).toHaveTextContent('unknown');
      expect(getByText('Tags')).toBeInTheDocument();
      expect(getByText('Tags').nextSibling).toHaveTextContent('No Tags');
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
            target: {
              kind: 'user',
              name: 'guest',
              namespace: 'default',
            },
          },
          {
            type: RELATION_PART_OF,
            target: {
              kind: 'system',
              name: 'system',
              namespace: 'default',
            },
          },
          {
            type: RELATION_PART_OF,
            target: {
              kind: 'component',
              name: 'parent-software',
              namespace: 'default',
            },
          },
        ],
      };
    });

    it('renders info', async () => {
      const { getByText, queryByText } = await renderInTestApp(
        <AboutContent entity={entity} />,
        {
          mountedRoutes: {
            '/catalog/:namespace/:kind/:name': entityRouteRef,
          },
        },
      );

      expect(getByText('Description')).toBeInTheDocument();
      expect(getByText('Description').nextSibling).toHaveTextContent(
        'This is the description',
      );
      expect(getByText('Owner')).toBeInTheDocument();
      expect(getByText('Owner').nextSibling).toHaveTextContent('user:guest');
      expect(queryByText('Domain')).not.toBeInTheDocument();
      expect(getByText('System')).toBeInTheDocument();
      expect(getByText('System').nextSibling).toHaveTextContent('system');
      expect(getByText('Parent Component')).toBeInTheDocument();
      expect(getByText('Parent Component').nextSibling).toHaveTextContent(
        'parent-software',
      );
      expect(getByText('Type')).toBeInTheDocument();
      expect(getByText('Type').nextSibling).toHaveTextContent('service');
      expect(getByText('Lifecycle')).toBeInTheDocument();
      expect(getByText('Lifecycle').nextSibling).toHaveTextContent(
        'production',
      );
      expect(getByText('Tags')).toBeInTheDocument();
      expect(getByText('Tags').nextSibling).toHaveTextContent('tag-1');
    });

    it('highlights missing required fields', async () => {
      delete entity.metadata.tags;
      delete entity.spec!.type;
      delete entity.spec!.lifecycle;
      delete entity.spec!.system;
      entity.relations = [];

      const { getByText, queryByText } = await renderInTestApp(
        <AboutContent entity={entity} />,
        {
          mountedRoutes: {
            '/catalog/:namespace/:kind/:name': entityRouteRef,
          },
        },
      );

      expect(getByText('Description')).toBeInTheDocument();
      expect(getByText('Description').nextSibling).toHaveTextContent(
        'This is the description',
      );
      expect(getByText('Owner')).toBeInTheDocument();
      expect(getByText('Owner').nextSibling).toHaveTextContent('No Owner');
      expect(queryByText('Domain')).not.toBeInTheDocument();
      expect(getByText('System')).toBeInTheDocument();
      expect(getByText('System').nextSibling).toHaveTextContent('No System');
      expect(queryByText('Parent Component')).not.toBeInTheDocument();
      expect(getByText('Type')).toBeInTheDocument();
      expect(getByText('Type').nextSibling).toHaveTextContent('unknown');
      expect(getByText('Lifecycle')).toBeInTheDocument();
      expect(getByText('Lifecycle').nextSibling).toHaveTextContent('unknown');
      expect(getByText('Tags')).toBeInTheDocument();
      expect(getByText('Tags').nextSibling).toHaveTextContent('No Tags');
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
            target: {
              kind: 'user',
              name: 'guest',
              namespace: 'default',
            },
          },
        ],
      };
    });

    it('renders info', async () => {
      const { getByText, queryByText } = await renderInTestApp(
        <AboutContent entity={entity} />,
        {
          mountedRoutes: {
            '/catalog/:namespace/:kind/:name': entityRouteRef,
          },
        },
      );

      expect(getByText('Description')).toBeInTheDocument();
      expect(getByText('Description').nextSibling).toHaveTextContent(
        'This is the description',
      );
      expect(getByText('Owner')).toBeInTheDocument();
      expect(getByText('Owner').nextSibling).toHaveTextContent('user:guest');
      expect(queryByText('Domain')).not.toBeInTheDocument();
      expect(queryByText('System')).not.toBeInTheDocument();
      expect(queryByText('Parent Component')).not.toBeInTheDocument();
      expect(queryByText('Type')).not.toBeInTheDocument();
      expect(queryByText('Lifecycle')).not.toBeInTheDocument();
      expect(getByText('Tags')).toBeInTheDocument();
      expect(getByText('Tags').nextSibling).toHaveTextContent('tag-1');
    });

    it('highlights missing required fields', async () => {
      delete entity.metadata.tags;
      entity.relations = [];

      const { getByText, queryByText } = await renderInTestApp(
        <AboutContent entity={entity} />,
        {
          mountedRoutes: {
            '/catalog/:namespace/:kind/:name': entityRouteRef,
          },
        },
      );

      expect(getByText('Description')).toBeInTheDocument();
      expect(getByText('Description').nextSibling).toHaveTextContent(
        'This is the description',
      );
      expect(getByText('Owner')).toBeInTheDocument();
      expect(getByText('Owner').nextSibling).toHaveTextContent('No Owner');
      expect(queryByText('Domain')).not.toBeInTheDocument();
      expect(queryByText('System')).not.toBeInTheDocument();
      expect(queryByText('Parent Component')).not.toBeInTheDocument();
      expect(queryByText('Type')).not.toBeInTheDocument();
      expect(queryByText('Lifecycle')).not.toBeInTheDocument();
      expect(getByText('Tags')).toBeInTheDocument();
      expect(getByText('Tags').nextSibling).toHaveTextContent('No Tags');
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
        },
        relations: [],
      };
    });

    it('renders info', async () => {
      const { getByText, queryByText } = await renderInTestApp(
        <AboutContent entity={entity} />,
        {
          mountedRoutes: {
            '/catalog/:namespace/:kind/:name': entityRouteRef,
          },
        },
      );

      expect(getByText('Description')).toBeInTheDocument();
      expect(getByText('Description').nextSibling).toHaveTextContent(
        'This is the description',
      );
      expect(getByText('Owner')).toBeInTheDocument();
      expect(getByText('Owner').nextSibling).toHaveTextContent('No Owner');
      expect(queryByText('Domain')).not.toBeInTheDocument();
      expect(queryByText('System')).not.toBeInTheDocument();
      expect(queryByText('Parent Component')).not.toBeInTheDocument();
      expect(getByText('Type')).toBeInTheDocument();
      expect(getByText('Type').nextSibling).toHaveTextContent('root');
      expect(queryByText('Lifecycle')).not.toBeInTheDocument();
      expect(getByText('Tags')).toBeInTheDocument();
      expect(getByText('Tags').nextSibling).toHaveTextContent('tag-1');
    });

    it('highlights missing required fields', async () => {
      delete entity.metadata.tags;
      delete entity.spec!.type;

      const { getByText, queryByText } = await renderInTestApp(
        <AboutContent entity={entity} />,
        {
          mountedRoutes: {
            '/catalog/:namespace/:kind/:name': entityRouteRef,
          },
        },
      );

      expect(getByText('Description')).toBeInTheDocument();
      expect(getByText('Description').nextSibling).toHaveTextContent(
        'This is the description',
      );
      expect(getByText('Owner')).toBeInTheDocument();
      expect(getByText('Owner').nextSibling).toHaveTextContent('No Owner');
      expect(queryByText('Domain')).not.toBeInTheDocument();
      expect(queryByText('System')).not.toBeInTheDocument();
      expect(queryByText('Parent Component')).not.toBeInTheDocument();
      expect(getByText('Type')).toBeInTheDocument();
      expect(getByText('Type').nextSibling).toHaveTextContent('unknown');
      expect(queryByText('Lifecycle')).not.toBeInTheDocument();
      expect(getByText('Tags')).toBeInTheDocument();
      expect(getByText('Tags').nextSibling).toHaveTextContent('No Tags');
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
            target: {
              kind: 'user',
              name: 'guest',
              namespace: 'default',
            },
          },
          {
            type: RELATION_PART_OF,
            target: {
              kind: 'system',
              name: 'system',
              namespace: 'default',
            },
          },
        ],
      };
    });

    it('renders info', async () => {
      const { getByText, queryByText } = await renderInTestApp(
        <AboutContent entity={entity} />,
        {
          mountedRoutes: {
            '/catalog/:namespace/:kind/:name': entityRouteRef,
          },
        },
      );

      expect(getByText('Description')).toBeInTheDocument();
      expect(getByText('Description').nextSibling).toHaveTextContent(
        'This is the description',
      );
      expect(getByText('Owner')).toBeInTheDocument();
      expect(getByText('Owner').nextSibling).toHaveTextContent('user:guest');
      expect(queryByText('Domain')).not.toBeInTheDocument();
      expect(getByText('System')).toBeInTheDocument();
      expect(getByText('System').nextSibling).toHaveTextContent('system');
      expect(queryByText('Parent Component')).not.toBeInTheDocument();
      expect(getByText('Type')).toBeInTheDocument();
      expect(getByText('Type').nextSibling).toHaveTextContent('s3');
      expect(queryByText('Lifecycle')).not.toBeInTheDocument();
      expect(getByText('Tags')).toBeInTheDocument();
      expect(getByText('Tags').nextSibling).toHaveTextContent('tag-1');
    });

    it('highlights missing required fields', async () => {
      delete entity.metadata.tags;
      delete entity.spec!.type;
      delete entity.spec!.system;
      entity.relations = [];

      const { getByText, queryByText } = await renderInTestApp(
        <AboutContent entity={entity} />,
        {
          mountedRoutes: {
            '/catalog/:namespace/:kind/:name': entityRouteRef,
          },
        },
      );

      expect(getByText('Description')).toBeInTheDocument();
      expect(getByText('Description').nextSibling).toHaveTextContent(
        'This is the description',
      );
      expect(getByText('Owner')).toBeInTheDocument();
      expect(getByText('Owner').nextSibling).toHaveTextContent('No Owner');
      expect(queryByText('Domain')).not.toBeInTheDocument();
      expect(getByText('System')).toBeInTheDocument();
      expect(getByText('System').nextSibling).toHaveTextContent('No System');
      expect(queryByText('Parent Component')).not.toBeInTheDocument();
      expect(getByText('Type')).toBeInTheDocument();
      expect(getByText('Type').nextSibling).toHaveTextContent('unknown');
      expect(queryByText('Lifecycle')).not.toBeInTheDocument();
      expect(getByText('Tags')).toBeInTheDocument();
      expect(getByText('Tags').nextSibling).toHaveTextContent('No Tags');
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
            target: {
              kind: 'user',
              name: 'guest',
              namespace: 'default',
            },
          },
          {
            type: RELATION_PART_OF,
            target: {
              kind: 'domain',
              name: 'domain',
              namespace: 'default',
            },
          },
        ],
      };
    });

    it('renders info', async () => {
      const { getByText, queryByText } = await renderInTestApp(
        <AboutContent entity={entity} />,
        {
          mountedRoutes: {
            '/catalog/:namespace/:kind/:name': entityRouteRef,
          },
        },
      );

      expect(getByText('Description')).toBeInTheDocument();
      expect(getByText('Description').nextSibling).toHaveTextContent(
        'This is the description',
      );
      expect(getByText('Owner')).toBeInTheDocument();
      expect(getByText('Owner').nextSibling).toHaveTextContent('user:guest');
      expect(getByText('Domain')).toBeInTheDocument();
      expect(getByText('Domain').nextSibling).toHaveTextContent('domain');
      expect(queryByText('System')).not.toBeInTheDocument();
      expect(queryByText('Parent Component')).not.toBeInTheDocument();
      expect(queryByText('Type')).not.toBeInTheDocument();
      expect(queryByText('Lifecycle')).not.toBeInTheDocument();
      expect(getByText('Tags')).toBeInTheDocument();
      expect(getByText('Tags').nextSibling).toHaveTextContent('tag-1');
    });

    it('highlights missing required fields', async () => {
      delete entity.metadata.tags;
      delete entity.spec!.domain;
      entity.relations = [];

      const { getByText, queryByText } = await renderInTestApp(
        <AboutContent entity={entity} />,
        {
          mountedRoutes: {
            '/catalog/:namespace/:kind/:name': entityRouteRef,
          },
        },
      );

      expect(getByText('Description')).toBeInTheDocument();
      expect(getByText('Description').nextSibling).toHaveTextContent(
        'This is the description',
      );
      expect(getByText('Owner')).toBeInTheDocument();
      expect(getByText('Owner').nextSibling).toHaveTextContent('No Owner');
      expect(getByText('Domain')).toBeInTheDocument();
      expect(getByText('Domain').nextSibling).toHaveTextContent('No Domain');
      expect(queryByText('System')).not.toBeInTheDocument();
      expect(queryByText('Parent Component')).not.toBeInTheDocument();
      expect(queryByText('Type')).not.toBeInTheDocument();
      expect(queryByText('Lifecycle')).not.toBeInTheDocument();
      expect(getByText('Tags')).toBeInTheDocument();
      expect(getByText('Tags').nextSibling).toHaveTextContent('No Tags');
    });
  });
});
