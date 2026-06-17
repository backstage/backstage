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

import { screen } from '@testing-library/react';
import { renderTestApp } from '@backstage/frontend-test-utils';
import { Entity } from '@backstage/catalog-model';
import { createTestEntityPage } from '@backstage/plugin-catalog-react/testUtils';
import { catalogLinksEntityCard, catalogLabelsEntityCard } from './entityCards';

describe('catalog entity cards', () => {
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
