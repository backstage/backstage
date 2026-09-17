/*
 * Copyright 2025 The Backstage Authors
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

import { render, screen } from '@testing-library/react';
import { renderTestApp } from '@backstage/frontend-test-utils';
import { Entity } from '@backstage/catalog-model';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import { useEffect } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { createTestEntityPage } from '@backstage/plugin-catalog-react/testUtils';
import {
  catalogLinksEntityCard,
  catalogLabelsEntityCard,
  EntityIconLinkRow,
} from './entityCards';

describe('catalog entity cards', () => {
  describe('EntityIconLinkRow', () => {
    it('mounts link hooks only while their entity filter matches', () => {
      const mountEffect = jest.fn();
      const unmountEffect = jest.fn();
      const useProps = () => {
        useEffect(() => {
          mountEffect();
          return unmountEffect;
        }, []);
        return { label: 'Filtered link', href: '/filtered' };
      };
      const links = [
        {
          id: 'entity-icon-link:test',
          filter: (entity: Entity) => entity.metadata.name === 'visible',
          useProps,
        },
      ];
      const hiddenEntity: Entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: { name: 'hidden' },
      };
      const visibleEntity: Entity = {
        ...hiddenEntity,
        metadata: { name: 'visible' },
      };

      const rendered = render(
        <MemoryRouter>
          <EntityProvider entity={hiddenEntity}>
            <EntityIconLinkRow links={links} />
          </EntityProvider>
        </MemoryRouter>,
      );

      expect(screen.queryByText('Filtered link')).not.toBeInTheDocument();
      expect(mountEffect).not.toHaveBeenCalled();

      rendered.rerender(
        <MemoryRouter>
          <EntityProvider entity={visibleEntity}>
            <EntityIconLinkRow links={links} />
          </EntityProvider>
        </MemoryRouter>,
      );

      expect(screen.getByText('Filtered link')).toBeInTheDocument();
      expect(mountEffect).toHaveBeenCalledTimes(1);
      expect(unmountEffect).not.toHaveBeenCalled();

      rendered.rerender(
        <MemoryRouter>
          <EntityProvider entity={hiddenEntity}>
            <EntityIconLinkRow links={links} />
          </EntityProvider>
        </MemoryRouter>,
      );

      expect(screen.queryByText('Filtered link')).not.toBeInTheDocument();
      expect(mountEffect).toHaveBeenCalledTimes(1);
      expect(unmountEffect).toHaveBeenCalledTimes(1);
    });
  });

  describe('catalogLinksEntityCard', () => {
    it('should render for entities with links', async () => {
      const entity: Entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          name: 'test',
          links: [{ url: 'https://example.com', title: 'Example' }],
        },
        spec: { type: 'service' },
      };

      renderTestApp({
        extensions: [createTestEntityPage({ entity }), catalogLinksEntityCard],
      });

      expect(await screen.findByText('Links')).toBeInTheDocument();
      expect(await screen.findByText('Example')).toBeInTheDocument();
    });

    it('should not render for entities without links', async () => {
      const entity: Entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          name: 'test',
          labels: { team: 'platform' },
        },
        spec: { type: 'service' },
      };

      renderTestApp({
        extensions: [
          createTestEntityPage({ entity }),
          catalogLinksEntityCard,
          catalogLabelsEntityCard,
        ],
      });

      // Labels card renders as sentinel
      expect(await screen.findByText('Labels')).toBeInTheDocument();
      expect(screen.queryByText('Links')).not.toBeInTheDocument();
    });
  });

  describe('catalogLabelsEntityCard', () => {
    it('should render for entities with labels', async () => {
      const entity: Entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          name: 'test',
          labels: { team: 'platform' },
        },
        spec: { type: 'service' },
      };

      renderTestApp({
        extensions: [createTestEntityPage({ entity }), catalogLabelsEntityCard],
      });

      expect(await screen.findByText('Labels')).toBeInTheDocument();
      expect(await screen.findByText('team')).toBeInTheDocument();
    });

    it('should not render for entities without labels', async () => {
      const entity: Entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          name: 'test',
          links: [{ url: 'https://example.com', title: 'Example' }],
        },
        spec: { type: 'service' },
      };

      renderTestApp({
        extensions: [
          createTestEntityPage({ entity }),
          catalogLinksEntityCard,
          catalogLabelsEntityCard,
        ],
      });

      // Links card renders as sentinel
      expect(await screen.findByText('Links')).toBeInTheDocument();
      expect(screen.queryByText('Labels')).not.toBeInTheDocument();
    });
  });
});
