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
import { GroupEntity, UserEntity } from '@backstage/catalog-model';
import {
  createTestEntityPage,
  catalogApiMock,
} from '@backstage/plugin-catalog-react/testUtils';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import orgPlugin from './alpha';

const EntityGroupProfileCard = orgPlugin.getExtension(
  'entity-card:org/group-profile',
);
const EntityUserProfileCard = orgPlugin.getExtension(
  'entity-card:org/user-profile',
);
const EntityMembersListCard = orgPlugin.getExtension(
  'entity-card:org/members-list',
);

describe('org plugin entity cards', () => {
  describe('EntityGroupProfileCard', () => {
    it('should render for Group entities', async () => {
      const entity: GroupEntity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Group',
        metadata: {
          name: 'platform-team',
          description: 'The platform team',
        },
        spec: {
          type: 'team',
          children: [],
        },
      };

      renderTestApp({
        extensions: [createTestEntityPage({ entity }), EntityGroupProfileCard],
      });

      expect(await screen.findByText('platform-team')).toBeInTheDocument();
      expect(await screen.findByText('The platform team')).toBeInTheDocument();
    });

    it('should not render for non-Group entities', async () => {
      const entity: UserEntity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'User',
        metadata: {
          name: 'test-user',
        },
        spec: {
          memberOf: [],
        },
      };

      renderTestApp({
        extensions: [
          createTestEntityPage({ entity }),
          EntityGroupProfileCard,
          EntityUserProfileCard,
        ],
      });

      // User profile card renders as sentinel
      expect(await screen.findByText('test-user')).toBeInTheDocument();
      // Group profile card should not render (no group-specific elements)
      expect(
        screen.queryByText('group:default/test-user'),
      ).not.toBeInTheDocument();
    });

    it('should display group profile with email', async () => {
      const entity: GroupEntity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Group',
        metadata: {
          name: 'platform-team',
        },
        spec: {
          type: 'team',
          children: [],
          profile: {
            displayName: 'Platform Team',
            email: 'platform@example.com',
          },
        },
      };

      renderTestApp({
        extensions: [createTestEntityPage({ entity }), EntityGroupProfileCard],
      });

      expect(await screen.findByText('Platform Team')).toBeInTheDocument();
      expect(
        await screen.findByText('platform@example.com'),
      ).toBeInTheDocument();
    });
  });

  describe('EntityUserProfileCard', () => {
    it('should render for User entities', async () => {
      const entity: UserEntity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'User',
        metadata: {
          name: 'jdoe',
          description: 'Software Engineer',
        },
        spec: {
          profile: {
            displayName: 'John Doe',
            email: 'jdoe@example.com',
          },
          memberOf: [],
        },
      };

      renderTestApp({
        extensions: [createTestEntityPage({ entity }), EntityUserProfileCard],
      });

      expect(await screen.findByText('John Doe')).toBeInTheDocument();
      expect(await screen.findByText('Software Engineer')).toBeInTheDocument();
      expect(await screen.findByText('jdoe@example.com')).toBeInTheDocument();
    });

    it('should not render for non-User entities', async () => {
      const entity: GroupEntity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Group',
        metadata: {
          name: 'platform-team',
        },
        spec: {
          type: 'team',
          children: [],
        },
      };

      renderTestApp({
        extensions: [
          createTestEntityPage({ entity }),
          EntityGroupProfileCard,
          EntityUserProfileCard,
        ],
      });

      // Group profile card renders as sentinel
      expect(await screen.findByText('platform-team')).toBeInTheDocument();
      // Check that user-specific text doesn't appear
      expect(screen.queryByText('jdoe')).not.toBeInTheDocument();
    });

    it('should fall back to metadata name when no display name', async () => {
      const entity: UserEntity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'User',
        metadata: {
          name: 'jdoe',
        },
        spec: {
          memberOf: [],
        },
      };

      renderTestApp({
        extensions: [createTestEntityPage({ entity }), EntityUserProfileCard],
      });

      expect(await screen.findByText('jdoe')).toBeInTheDocument();
    });
  });

  describe('EntityMembersListCard', () => {
    it('should show members when catalog API returns them', async () => {
      const groupEntity: GroupEntity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Group',
        metadata: {
          name: 'platform-team',
          namespace: 'default',
        },
        spec: {
          type: 'team',
          children: [],
        },
      };

      const memberUser: UserEntity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'User',
        metadata: {
          name: 'alice',
          namespace: 'default',
        },
        spec: {
          profile: {
            displayName: 'Alice Smith',
            email: 'alice@example.com',
          },
          memberOf: ['group:default/platform-team'],
        },
        relations: [
          {
            type: 'memberOf',
            targetRef: 'group:default/platform-team',
          },
        ],
      };

      renderTestApp({
        extensions: [
          createTestEntityPage({ entity: groupEntity }),
          EntityMembersListCard,
        ],
        apis: [
          [
            catalogApiRef,
            catalogApiMock({ entities: [groupEntity, memberUser] }),
          ],
        ],
      });

      expect(await screen.findByText('Alice Smith')).toBeInTheDocument();
      expect(await screen.findByText('alice@example.com')).toBeInTheDocument();
    });

    it('should show no members message when catalog API returns empty', async () => {
      const groupEntity: GroupEntity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Group',
        metadata: {
          name: 'empty-team',
          namespace: 'default',
        },
        spec: {
          type: 'team',
          children: [],
        },
      };

      renderTestApp({
        extensions: [
          createTestEntityPage({ entity: groupEntity }),
          EntityMembersListCard,
        ],
        apis: [[catalogApiRef, catalogApiMock({ entities: [groupEntity] })]],
      });

      expect(
        await screen.findByText('This group has no members.'),
      ).toBeInTheDocument();
    });
  });
});
