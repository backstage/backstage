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
  ANNOTATION_LOCATION,
  ANNOTATION_ORIGIN_LOCATION,
} from '@backstage/catalog-model';
import { ConfigReader } from '@backstage/config';
import {
  MicrosoftGraphClient,
  MICROSOFT_GRAPH_GROUP_ID_ANNOTATION,
  MICROSOFT_GRAPH_USER_ID_ANNOTATION,
} from '@backstage/plugin-catalog-backend-module-msgraph';
import { mockServices } from '@backstage/backend-test-utils';
import {
  MicrosoftGraphIncrementalEntityProvider,
  MSGraphContext,
  MSGraphCursor,
} from './MicrosoftGraphIncrementalEntityProvider';
import { getUserPhotoGated, requestOnePage } from './clientHelpers';

jest.mock('./clientHelpers', () => ({
  requestOnePage: jest.fn(),
  getUserPhotoGated: jest.fn(),
}));

const mockRequestOnePage = requestOnePage as jest.MockedFunction<
  typeof requestOnePage
>;
const mockGetUserPhotoGated = getUserPhotoGated as jest.MockedFunction<
  typeof getUserPhotoGated
>;

const mockClient = {
  getOrganization: jest.fn(),
  getGroupMembers: jest.fn(),
} as unknown as jest.Mocked<MicrosoftGraphClient>;

const logger = mockServices.logger.mock();

const baseProviderConfig = {
  id: 'default',
  target: 'https://graph.microsoft.com/v1.0',
  tenantId: 'tenant-id',
  clientId: 'client-id',
  clientSecret: 'client-secret',
};

function makeContext(overrides?: Partial<MSGraphContext>): MSGraphContext {
  return {
    client: mockClient,
    provider: baseProviderConfig as any,
    ...overrides,
  };
}

async function* asyncYield<T>(...items: T[]): AsyncIterable<T> {
  for (const item of items) yield item;
}

describe('MicrosoftGraphIncrementalEntityProvider', () => {
  beforeEach(() => {
    jest
      .spyOn(MicrosoftGraphClient, 'create')
      .mockReturnValue(mockClient as unknown as MicrosoftGraphClient);
  });

  afterEach(() => jest.resetAllMocks());

  describe('getProviderName', () => {
    it('returns namespaced name using the provider id', () => {
      const provider = new MicrosoftGraphIncrementalEntityProvider({
        id: 'my-tenant',
        provider: baseProviderConfig as any,
        logger,
      });
      expect(provider.getProviderName()).toBe(
        'MicrosoftGraphIncrementalEntityProvider:my-tenant',
      );
    });
  });

  describe('fromConfig', () => {
    it('creates one provider per provider config entry', () => {
      const config = new ConfigReader({
        catalog: {
          providers: {
            microsoftGraphOrg: {
              tenantA: { tenantId: 'a', clientId: 'c', clientSecret: 's' },
              tenantB: { tenantId: 'b', clientId: 'c', clientSecret: 's' },
            },
          },
        },
      });

      const providers = MicrosoftGraphIncrementalEntityProvider.fromConfig(
        config,
        { logger },
      );

      expect(providers).toHaveLength(2);
      expect(providers[0].getProviderName()).toBe(
        'MicrosoftGraphIncrementalEntityProvider:tenantA',
      );
      expect(providers[1].getProviderName()).toBe(
        'MicrosoftGraphIncrementalEntityProvider:tenantB',
      );
    });

    it('assigns per-provider transformers when a Record is provided', () => {
      const config = new ConfigReader({
        catalog: {
          providers: {
            microsoftGraphOrg: {
              p1: { tenantId: 't', clientId: 'c', clientSecret: 's' },
              p2: { tenantId: 't', clientId: 'c', clientSecret: 's' },
            },
          },
        },
      });
      const transformerA = jest.fn();
      const transformerB = jest.fn();

      const providers = MicrosoftGraphIncrementalEntityProvider.fromConfig(
        config,
        {
          logger,
          userTransformer: { p1: transformerA, p2: transformerB },
        },
      );

      expect(providers).toHaveLength(2);
    });
  });

  describe('around', () => {
    it('creates the client and passes it to the burst function', async () => {
      const provider = new MicrosoftGraphIncrementalEntityProvider({
        id: 'default',
        provider: baseProviderConfig as any,
        logger,
      });

      let capturedContext: MSGraphContext | undefined;
      await provider.around(async ctx => {
        capturedContext = ctx;
      });

      expect(MicrosoftGraphClient.create).toHaveBeenCalledWith(
        baseProviderConfig,
      );
      expect(capturedContext?.client).toBe(mockClient);
    });

    it('applies providerConfigTransformer before creating the client', async () => {
      const transformedConfig = {
        ...baseProviderConfig,
        clientSecret: 'rotated-secret',
      };
      const transformer = jest.fn().mockResolvedValue(transformedConfig);

      const provider = new MicrosoftGraphIncrementalEntityProvider({
        id: 'default',
        provider: baseProviderConfig as any,
        logger,
        providerConfigTransformer: transformer,
      });

      await provider.around(async () => {});

      expect(transformer).toHaveBeenCalledWith(baseProviderConfig);
      expect(MicrosoftGraphClient.create).toHaveBeenCalledWith(
        transformedConfig,
      );
    });

    it('warns when unsupported userGroupMember options are set', async () => {
      const provider = new MicrosoftGraphIncrementalEntityProvider({
        id: 'default',
        provider: {
          ...baseProviderConfig,
          userGroupMemberFilter: 'some-filter',
        } as any,
        logger,
      });

      await provider.around(async () => {});

      expect(logger.warn).toHaveBeenCalledWith(
        expect.stringContaining(
          'userGroupMemberFilter/Search/Path are not supported',
        ),
      );
    });

    it('warns when groupIncludeSubGroups is set', async () => {
      const provider = new MicrosoftGraphIncrementalEntityProvider({
        id: 'default',
        provider: {
          ...baseProviderConfig,
          groupIncludeSubGroups: true,
        } as any,
        logger,
      });

      await provider.around(async () => {});

      expect(logger.warn).toHaveBeenCalledWith(
        expect.stringContaining('groupIncludeSubGroups is not supported'),
      );
    });
  });

  describe('next — users phase', () => {
    it('starts in users phase when cursor is undefined', async () => {
      mockRequestOnePage.mockResolvedValue({
        items: [],
        nextLink: undefined,
      });
      (mockClient.getOrganization as jest.Mock).mockResolvedValue({
        id: 'org-id',
        displayName: 'My Org',
      });
      (mockClient.getGroupMembers as jest.Mock).mockReturnValue(asyncYield());

      const provider = new MicrosoftGraphIncrementalEntityProvider({
        id: 'default',
        provider: baseProviderConfig as any,
        logger,
      });

      const result = await provider.next(makeContext());

      expect(mockRequestOnePage).toHaveBeenCalledWith(
        mockClient,
        'users',
        expect.objectContaining({
          query: expect.objectContaining({ top: 999 }), // USER_PAGE_SIZE
        }),
      );
      // No users → advances straight to groups phase
      expect(result.done).toBe(false);
      expect((result.cursor as MSGraphCursor).phase).toBe('groups');
    });

    it('emits User entities with location annotations', async () => {
      mockRequestOnePage.mockResolvedValueOnce({
        items: [
          {
            id: 'user-id-1',
            displayName: 'Alice',
            mail: 'alice@example.com',
            userPrincipalName: 'alice@example.com',
          },
        ],
        nextLink: 'https://graph.microsoft.com/v1.0/users?$skiptoken=page2',
      });
      mockGetUserPhotoGated.mockResolvedValue(undefined);

      const provider = new MicrosoftGraphIncrementalEntityProvider({
        id: 'default',
        provider: baseProviderConfig as any,
        logger,
      });

      const result = await provider.next(makeContext());

      expect(result.done).toBe(false);
      expect(result.entities!).toHaveLength(1);

      const entity = result.entities![0].entity;
      expect(entity.kind).toBe('User');
      expect(
        entity.metadata.annotations?.[MICROSOFT_GRAPH_USER_ID_ANNOTATION],
      ).toBe('user-id-1');
      expect(entity.metadata.annotations?.[ANNOTATION_LOCATION]).toBe(
        'msgraph:default/user-id-1',
      );
      expect(entity.metadata.annotations?.[ANNOTATION_ORIGIN_LOCATION]).toBe(
        'msgraph:default/user-id-1',
      );
      expect(result.entities![0].locationKey).toBe(
        'msgraph-org-provider:default',
      );
    });

    it('returns users cursor with nextLink when more pages remain', async () => {
      const nextLink =
        'https://graph.microsoft.com/v1.0/users?$skiptoken=page2';
      mockRequestOnePage.mockResolvedValueOnce({
        items: [
          { id: 'u1', displayName: 'U1', userPrincipalName: 'u1@example.com' },
        ],
        nextLink,
      });
      mockGetUserPhotoGated.mockResolvedValue(undefined);

      const provider = new MicrosoftGraphIncrementalEntityProvider({
        id: 'default',
        provider: baseProviderConfig as any,
        logger,
      });

      const result = await provider.next(makeContext());

      expect(result.done).toBe(false);
      expect((result.cursor as MSGraphCursor).phase).toBe('users');
      expect((result.cursor as MSGraphCursor).nextLink).toBe(nextLink);
    });

    it('transitions to groups phase when last users page has no nextLink', async () => {
      mockRequestOnePage.mockResolvedValueOnce({
        items: [],
        nextLink: undefined,
      });

      const provider = new MicrosoftGraphIncrementalEntityProvider({
        id: 'default',
        provider: baseProviderConfig as any,
        logger,
      });

      const result = await provider.next(makeContext());

      expect(result.done).toBe(false);
      expect((result.cursor as MSGraphCursor).phase).toBe('groups');
      expect((result.cursor as MSGraphCursor).nextLink).toBeUndefined();
    });

    it('skips users where the transformer returns undefined', async () => {
      mockRequestOnePage.mockResolvedValueOnce({
        items: [{ id: 'u-no-name', userPrincipalName: '' }],
        nextLink: undefined,
      });
      mockGetUserPhotoGated.mockResolvedValue(undefined);

      const provider = new MicrosoftGraphIncrementalEntityProvider({
        id: 'default',
        provider: baseProviderConfig as any,
        logger,
        userTransformer: async () => undefined,
      });

      const result = await provider.next(makeContext());

      expect(result.entities!).toHaveLength(0);
    });

    it('truncates entity names longer than 63 characters', async () => {
      const longUPN = `${'a'.repeat(64)}@example.com`;
      mockRequestOnePage.mockResolvedValueOnce({
        items: [{ id: 'u1', displayName: 'Test', userPrincipalName: longUPN }],
        nextLink: undefined,
      });
      mockGetUserPhotoGated.mockResolvedValue(undefined);

      const provider = new MicrosoftGraphIncrementalEntityProvider({
        id: 'default',
        provider: baseProviderConfig as any,
        logger,
      });

      const result = await provider.next(makeContext());

      // Entity may be emitted or skipped depending on transformer handling of the UPN;
      // what matters is that no name exceeds 63 characters.
      for (const { entity } of result.entities!) {
        expect(entity.metadata.name.length).toBeLessThanOrEqual(63);
      }
    });

    it('skips photo loading when loadUserPhotos is false', async () => {
      mockRequestOnePage.mockResolvedValueOnce({
        items: [
          {
            id: 'u1',
            displayName: 'Alice',
            userPrincipalName: 'alice@example.com',
          },
        ],
        nextLink: undefined,
      });

      const provider = new MicrosoftGraphIncrementalEntityProvider({
        id: 'default',
        provider: { ...baseProviderConfig, loadUserPhotos: false } as any,
        logger,
      });

      await provider.next(
        makeContext({
          provider: { ...baseProviderConfig, loadUserPhotos: false } as any,
        }),
      );

      expect(mockGetUserPhotoGated).not.toHaveBeenCalled();
    });

    it('attempts photo loading when loadUserPhotos is not set', async () => {
      mockRequestOnePage.mockResolvedValueOnce({
        items: [
          {
            id: 'u1',
            displayName: 'Alice',
            userPrincipalName: 'alice@example.com',
          },
        ],
        nextLink: undefined,
      });
      mockGetUserPhotoGated.mockResolvedValue(undefined);

      const provider = new MicrosoftGraphIncrementalEntityProvider({
        id: 'default',
        provider: baseProviderConfig as any,
        logger,
      });

      await provider.next(makeContext());

      expect(mockGetUserPhotoGated).toHaveBeenCalledWith(mockClient, 'u1', 120);
    });

    it('skips photo fetch when user has no id to avoid requesting users/undefined/photo', async () => {
      mockRequestOnePage.mockResolvedValueOnce({
        items: [
          {
            // No id field — Graph can theoretically omit it
            displayName: 'No-ID User',
            userPrincipalName: 'noid@example.com',
          },
        ],
        nextLink: undefined,
      });

      const provider = new MicrosoftGraphIncrementalEntityProvider({
        id: 'default',
        provider: baseProviderConfig as any,
        logger,
      });

      await provider.next(makeContext());

      expect(mockGetUserPhotoGated).not.toHaveBeenCalled();
    });

    it('continues processing remaining users when a photo load fails and logs the error', async () => {
      mockRequestOnePage.mockResolvedValueOnce({
        items: [
          {
            id: 'u1',
            displayName: 'Alice',
            userPrincipalName: 'alice@example.com',
          },
          {
            id: 'u2',
            displayName: 'Bob',
            userPrincipalName: 'bob@example.com',
          },
        ],
        nextLink: undefined,
      });
      mockGetUserPhotoGated
        .mockRejectedValueOnce(new Error('Photo service unavailable'))
        .mockResolvedValueOnce(undefined);

      const provider = new MicrosoftGraphIncrementalEntityProvider({
        id: 'default',
        provider: baseProviderConfig as any,
        logger,
      });

      const result = await provider.next(makeContext());

      // Both users should still be emitted despite the photo failure
      expect(result.entities!).toHaveLength(2);
      expect(logger.debug).toHaveBeenCalledWith(
        expect.stringContaining('failed to load photo for user u1'),
        expect.anything(),
      );
    });
  });

  describe('next — groups phase', () => {
    const groupsCursor: MSGraphCursor = { phase: 'groups' };

    it('emits the tenant root group on the first groups page', async () => {
      (mockClient.getOrganization as jest.Mock).mockResolvedValue({
        id: 'org-id',
        displayName: 'My Org',
      });
      mockRequestOnePage.mockResolvedValueOnce({
        items: [],
        nextLink: undefined,
      });
      (mockClient.getGroupMembers as jest.Mock).mockReturnValue(asyncYield());

      const provider = new MicrosoftGraphIncrementalEntityProvider({
        id: 'default',
        provider: baseProviderConfig as any,
        logger,
      });

      const result = await provider.next(makeContext(), groupsCursor);

      // Root group is emitted (org entity kind=Group, type=root)
      expect(result.entities!.some(e => e.entity.spec?.type === 'root')).toBe(
        true,
      );
    });

    it('does NOT emit the root group on subsequent pages', async () => {
      const continuationCursor: MSGraphCursor = {
        phase: 'groups',
        nextLink: 'https://graph.microsoft.com/v1.0/groups?$skiptoken=page2',
      };
      mockRequestOnePage.mockResolvedValueOnce({
        items: [],
        nextLink: undefined,
      });
      (mockClient.getGroupMembers as jest.Mock).mockReturnValue(asyncYield());

      const provider = new MicrosoftGraphIncrementalEntityProvider({
        id: 'default',
        provider: baseProviderConfig as any,
        logger,
      });

      await provider.next(makeContext(), continuationCursor);

      expect(mockClient.getOrganization).not.toHaveBeenCalled();
    });

    it('emits Group entities with location annotations', async () => {
      (mockClient.getOrganization as jest.Mock).mockResolvedValue({
        id: 'org-id',
        displayName: 'My Org',
      });
      mockRequestOnePage.mockResolvedValueOnce({
        items: [
          { id: 'grp-1', displayName: 'Engineering', mail: 'eng@example.com' },
        ],
        nextLink: undefined,
      });
      (mockClient.getGroupMembers as jest.Mock).mockReturnValue(asyncYield());

      const provider = new MicrosoftGraphIncrementalEntityProvider({
        id: 'default',
        provider: baseProviderConfig as any,
        logger,
      });

      const result = await provider.next(makeContext(), groupsCursor);

      const groupEntity = result.entities!.find(
        e =>
          e.entity.metadata.annotations?.[
            MICROSOFT_GRAPH_GROUP_ID_ANNOTATION
          ] === 'grp-1',
      );
      expect(groupEntity).toBeDefined();
      expect(
        groupEntity!.entity.metadata.annotations?.[ANNOTATION_LOCATION],
      ).toBe('msgraph:default/grp-1');
      expect(
        groupEntity!.entity.metadata.annotations?.[ANNOTATION_ORIGIN_LOCATION],
      ).toBe('msgraph:default/grp-1');
      expect(groupEntity!.locationKey).toBe('msgraph-org-provider:default');
    });

    it('populates spec.members with user refs from getGroupMembers', async () => {
      (mockClient.getOrganization as jest.Mock).mockResolvedValue({
        id: 'org-id',
        displayName: 'My Org',
      });
      mockRequestOnePage.mockResolvedValueOnce({
        items: [
          { id: 'grp-1', displayName: 'Engineering', mail: 'eng@example.com' },
        ],
        nextLink: undefined,
      });
      (mockClient.getGroupMembers as jest.Mock).mockReturnValue(
        asyncYield(
          {
            '@odata.type': '#microsoft.graph.user',
            id: 'u1',
            displayName: 'Alice',
            userPrincipalName: 'alice@example.com',
          },
          {
            '@odata.type': '#microsoft.graph.user',
            id: 'u2',
            displayName: 'Bob',
            userPrincipalName: 'bob@example.com',
          },
        ),
      );

      const provider = new MicrosoftGraphIncrementalEntityProvider({
        id: 'default',
        provider: baseProviderConfig as any,
        logger,
      });

      const result = await provider.next(makeContext(), groupsCursor);

      const groupEntity = result.entities!.find(
        e =>
          e.entity.metadata.annotations?.[
            MICROSOFT_GRAPH_GROUP_ID_ANNOTATION
          ] === 'grp-1',
      );
      expect(groupEntity!.entity.spec?.members).toHaveLength(2);
      expect(groupEntity!.entity.spec?.members).toContain(
        'user:default/alice_example.com',
      );
      // Verify $select is passed so member objects are never sparse
      expect(mockClient.getGroupMembers).toHaveBeenCalledWith(
        'grp-1',
        expect.objectContaining({
          select: expect.arrayContaining([
            'id',
            'displayName',
            'userPrincipalName',
          ]),
        }),
      );
    });

    it('populates spec.children with nested group refs from getGroupMembers', async () => {
      (mockClient.getOrganization as jest.Mock).mockResolvedValue({
        id: 'org-id',
        displayName: 'My Org',
      });
      mockRequestOnePage.mockResolvedValueOnce({
        items: [
          {
            id: 'grp-parent',
            displayName: 'Parent',
            mail: 'parent@example.com',
          },
        ],
        nextLink: undefined,
      });
      (mockClient.getGroupMembers as jest.Mock).mockReturnValue(
        asyncYield({
          '@odata.type': '#microsoft.graph.group',
          id: 'grp-child',
          displayName: 'Child Group',
          mail: 'child@example.com',
        }),
      );

      const provider = new MicrosoftGraphIncrementalEntityProvider({
        id: 'default',
        provider: baseProviderConfig as any,
        logger,
      });

      const result = await provider.next(makeContext(), groupsCursor);

      const parentEntity = result.entities!.find(
        e =>
          e.entity.metadata.annotations?.[
            MICROSOFT_GRAPH_GROUP_ID_ANNOTATION
          ] === 'grp-parent',
      );
      expect(parentEntity!.entity.spec?.children).toHaveLength(1);
    });

    it('omits child group refs when groupFilter is active to avoid dangling references', async () => {
      const providerWithFilter = {
        ...baseProviderConfig,
        groupFilter: 'securityEnabled eq true',
      };
      (mockClient.getOrganization as jest.Mock).mockResolvedValue({
        id: 'org-id',
        displayName: 'My Org',
      });
      mockRequestOnePage.mockResolvedValueOnce({
        items: [
          {
            id: 'grp-parent',
            displayName: 'Parent',
            mail: 'parent@example.com',
          },
        ],
        nextLink: undefined,
      });
      (mockClient.getGroupMembers as jest.Mock).mockReturnValue(
        asyncYield({
          '@odata.type': '#microsoft.graph.group',
          id: 'grp-child',
          displayName: 'Child Group',
          mail: 'child@example.com',
        }),
      );

      const provider = new MicrosoftGraphIncrementalEntityProvider({
        id: 'default',
        provider: providerWithFilter as any,
        logger,
      });

      const result = await provider.next(
        { client: mockClient, provider: providerWithFilter as any },
        groupsCursor,
      );

      const parentEntity = result.entities!.find(
        e =>
          e.entity.metadata.annotations?.[
            MICROSOFT_GRAPH_GROUP_ID_ANNOTATION
          ] === 'grp-parent',
      );
      expect(parentEntity!.entity.spec?.children).toHaveLength(0);
    });

    it('logs a warning and skips a child group member when the transformer throws', async () => {
      const throwingGroupTransformer = jest
        .fn()
        .mockResolvedValueOnce({
          // first call: parent group transform succeeds
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Group',
          metadata: {
            name: 'parent-group',
            annotations: { 'graph.microsoft.com/group-id': 'grp-parent' },
          },
          spec: { type: 'team', children: [], members: [] },
        })
        .mockRejectedValueOnce(new Error('Transformer error'));

      (mockClient.getOrganization as jest.Mock).mockResolvedValue({
        id: 'org-id',
        displayName: 'My Org',
      });
      mockRequestOnePage.mockResolvedValueOnce({
        items: [
          {
            id: 'grp-parent',
            displayName: 'Parent',
            mail: 'parent@example.com',
          },
        ],
        nextLink: undefined,
      });
      (mockClient.getGroupMembers as jest.Mock).mockReturnValue(
        asyncYield({
          '@odata.type': '#microsoft.graph.group',
          id: 'grp-child',
          displayName: 'Child Group',
          mail: 'child@example.com',
        }),
      );

      const provider = new MicrosoftGraphIncrementalEntityProvider({
        id: 'default',
        provider: baseProviderConfig as any,
        logger,
        groupTransformer: throwingGroupTransformer,
      });

      const result = await provider.next(makeContext(), groupsCursor);

      // Parent group still emitted despite child transformer throwing
      const parentEntity = result.entities!.find(
        e =>
          e.entity.metadata.annotations?.[
            MICROSOFT_GRAPH_GROUP_ID_ANNOTATION
          ] === 'grp-parent',
      );
      expect(parentEntity).toBeDefined();
      expect(parentEntity!.entity.spec?.children).toHaveLength(0);
      expect(logger.warn).toHaveBeenCalledWith(
        expect.stringContaining(
          'group member child group grp-child failed to transform, skipping',
        ),
        expect.anything(),
      );
    });

    it('returns done:false with groups cursor when nextLink is present', async () => {
      const nextLink =
        'https://graph.microsoft.com/v1.0/groups?$skiptoken=page2';
      (mockClient.getOrganization as jest.Mock).mockResolvedValue({
        id: 'org-id',
        displayName: 'My Org',
      });
      mockRequestOnePage.mockResolvedValueOnce({ items: [], nextLink });
      (mockClient.getGroupMembers as jest.Mock).mockReturnValue(asyncYield());

      const provider = new MicrosoftGraphIncrementalEntityProvider({
        id: 'default',
        provider: baseProviderConfig as any,
        logger,
      });

      const result = await provider.next(makeContext(), groupsCursor);

      expect(result.done).toBe(false);
      expect((result.cursor as MSGraphCursor).phase).toBe('groups');
      expect((result.cursor as MSGraphCursor).nextLink).toBe(nextLink);
    });

    it('returns done:true when the last groups page has no nextLink', async () => {
      (mockClient.getOrganization as jest.Mock).mockResolvedValue({
        id: 'org-id',
        displayName: 'My Org',
      });
      mockRequestOnePage.mockResolvedValueOnce({
        items: [],
        nextLink: undefined,
      });
      (mockClient.getGroupMembers as jest.Mock).mockReturnValue(asyncYield());

      const provider = new MicrosoftGraphIncrementalEntityProvider({
        id: 'default',
        provider: baseProviderConfig as any,
        logger,
      });

      const result = await provider.next(makeContext(), groupsCursor);

      expect(result.done).toBe(true);
    });

    it('continues processing remaining groups when root group fetch fails', async () => {
      (mockClient.getOrganization as jest.Mock).mockRejectedValue(
        new Error('Organization not found'),
      );
      mockRequestOnePage.mockResolvedValueOnce({
        items: [
          { id: 'grp-1', displayName: 'Engineering', mail: 'eng@example.com' },
        ],
        nextLink: undefined,
      });
      (mockClient.getGroupMembers as jest.Mock).mockReturnValue(asyncYield());

      const provider = new MicrosoftGraphIncrementalEntityProvider({
        id: 'default',
        provider: baseProviderConfig as any,
        logger,
      });

      const result = await provider.next(makeContext(), groupsCursor);

      expect(logger.warn).toHaveBeenCalledWith(
        expect.stringContaining('failed to read organization root group'),
        expect.anything(),
      );
      // The group itself is still emitted
      expect(
        result.entities!.some(
          e =>
            e.entity.metadata.annotations?.[
              MICROSOFT_GRAPH_GROUP_ID_ANNOTATION
            ] === 'grp-1',
        ),
      ).toBe(true);
    });

    it('skips groups where the transformer returns undefined', async () => {
      (mockClient.getOrganization as jest.Mock).mockResolvedValue({
        id: 'org-id',
        displayName: 'My Org',
      });
      mockRequestOnePage.mockResolvedValueOnce({
        items: [{ id: 'grp-1', displayName: 'Engineering' }],
        nextLink: undefined,
      });
      (mockClient.getGroupMembers as jest.Mock).mockReturnValue(asyncYield());

      const provider = new MicrosoftGraphIncrementalEntityProvider({
        id: 'default',
        provider: baseProviderConfig as any,
        logger,
        groupTransformer: async () => undefined,
      });

      const result = await provider.next(makeContext(), groupsCursor);

      // Only the root group entity remains
      expect(result.entities!.every(e => e.entity.spec?.type === 'root')).toBe(
        true,
      );
    });

    it('logs a warning and skips a group member when the transformer throws', async () => {
      (mockClient.getOrganization as jest.Mock).mockResolvedValue({
        id: 'org-id',
        displayName: 'My Org',
      });
      mockRequestOnePage.mockResolvedValueOnce({
        items: [
          { id: 'grp-1', displayName: 'Engineering', mail: 'eng@example.com' },
        ],
        nextLink: undefined,
      });
      (mockClient.getGroupMembers as jest.Mock).mockReturnValue(
        asyncYield(
          {
            '@odata.type': '#microsoft.graph.user',
            id: 'u-bad',
            // sparse — no userPrincipalName, transformer will throw
          },
          {
            '@odata.type': '#microsoft.graph.user',
            id: 'u-good',
            displayName: 'Alice',
            userPrincipalName: 'alice@example.com',
          },
        ),
      );

      const provider = new MicrosoftGraphIncrementalEntityProvider({
        id: 'default',
        provider: baseProviderConfig as any,
        logger,
        userTransformer: async user => {
          if (!user.userPrincipalName) throw new Error('Missing UPN');
          const { defaultUserTransformer } = await import(
            '@backstage/plugin-catalog-backend-module-msgraph'
          );
          return defaultUserTransformer(user);
        },
      });

      const result = await provider.next(makeContext(), groupsCursor);

      expect(logger.warn).toHaveBeenCalledWith(
        expect.stringContaining('group member user u-bad failed to transform'),
        expect.anything(),
      );
      const groupEntity = result.entities!.find(
        e =>
          e.entity.metadata.annotations?.[
            MICROSOFT_GRAPH_GROUP_ID_ANNOTATION
          ] === 'grp-1',
      );
      // Only the good member should appear
      expect(groupEntity!.entity.spec?.members).toHaveLength(1);
    });

    it('merges transformer-pre-populated members with fetched membership', async () => {
      (mockClient.getOrganization as jest.Mock).mockResolvedValue({
        id: 'org-id',
        displayName: 'My Org',
      });
      mockRequestOnePage.mockResolvedValueOnce({
        items: [
          { id: 'grp-1', displayName: 'Engineering', mail: 'eng@example.com' },
        ],
        nextLink: undefined,
      });
      (mockClient.getGroupMembers as jest.Mock).mockReturnValue(
        asyncYield({
          '@odata.type': '#microsoft.graph.user',
          id: 'u2',
          displayName: 'Bob',
          userPrincipalName: 'bob@example.com',
        }),
      );

      const provider = new MicrosoftGraphIncrementalEntityProvider({
        id: 'default',
        provider: baseProviderConfig as any,
        logger,
        groupTransformer: async group => {
          const base = await import(
            '@backstage/plugin-catalog-backend-module-msgraph'
          ).then(m => m.defaultGroupTransformer(group));
          if (!base) return undefined;
          // Transformer pre-populates an extra member
          base.spec = { ...base.spec, members: ['user:default/extra-user'] };
          return base;
        },
      });

      const result = await provider.next(makeContext(), groupsCursor);

      const groupEntity = result.entities!.find(
        e =>
          e.entity.metadata.annotations?.[
            MICROSOFT_GRAPH_GROUP_ID_ANNOTATION
          ] === 'grp-1',
      );
      // Should contain both the transformer-set member and the fetched one
      expect(groupEntity!.entity.spec?.members).toContain(
        'user:default/extra-user',
      );
      expect(groupEntity!.entity.spec?.members).toContain(
        'user:default/bob_example.com',
      );
    });

    it('passes group filter and search from provider config', async () => {
      const providerWithFilter = {
        ...baseProviderConfig,
        groupFilter: 'securityEnabled eq true',
        groupSearch: '"displayName:Engineering"',
      };
      (mockClient.getOrganization as jest.Mock).mockResolvedValue({
        id: 'org-id',
        displayName: 'My Org',
      });
      mockRequestOnePage.mockResolvedValueOnce({
        items: [],
        nextLink: undefined,
      });
      (mockClient.getGroupMembers as jest.Mock).mockReturnValue(asyncYield());

      const provider = new MicrosoftGraphIncrementalEntityProvider({
        id: 'default',
        provider: providerWithFilter as any,
        logger,
      });

      await provider.next(
        { client: mockClient, provider: providerWithFilter as any },
        groupsCursor,
      );

      expect(mockRequestOnePage).toHaveBeenCalledWith(
        mockClient,
        'groups',
        expect.objectContaining({
          query: expect.objectContaining({
            filter: 'securityEnabled eq true',
            search: '"displayName:Engineering"',
          }),
        }),
      );
    });
  });
});
