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

import crypto from 'node:crypto';
import {
  ANNOTATION_LOCATION,
  ANNOTATION_ORIGIN_LOCATION,
  Entity,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import {
  IncrementalEntityProvider,
  EntityIteratorResult,
} from '@backstage/plugin-catalog-backend-module-incremental-ingestion';
import { DeferredEntity } from '@backstage/plugin-catalog-node';
import limiterFactory from 'p-limit';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import {
  GroupTransformer,
  MICROSOFT_GRAPH_GROUP_ID_ANNOTATION,
  MICROSOFT_GRAPH_TENANT_ID_ANNOTATION,
  MICROSOFT_GRAPH_USER_ID_ANNOTATION,
  MicrosoftGraphClient,
  MicrosoftGraphProviderConfig,
  OrganizationTransformer,
  ProviderConfigTransformer,
  UserTransformer,
  defaultGroupTransformer,
  defaultOrganizationTransformer,
  defaultUserTransformer,
  readProviderConfigs,
} from '@backstage/plugin-catalog-backend-module-msgraph';
import { LoggerService } from '@backstage/backend-plugin-api';
import { getUserPhotoGated, requestOnePage } from './clientHelpers';

const USER_PAGE_SIZE = 999;
// Groups phase fetches members for every group on the page, so a smaller page
// size keeps each burst within its time budget.
const GROUP_PAGE_SIZE = 100;

/**
 * Backstage entity names must be ≤63 chars ([a-zA-Z0-9] separated by [-_.]).
 * When MS Graph UPNs exceed that (e.g. calendar/booking accounts), we truncate
 * to 54 chars and append an 8-char SHA-1 hash to preserve uniqueness.
 */
function capEntityName(name: string): string {
  if (name.length <= 63) return name;
  const hash = crypto.createHash('sha1').update(name).digest('hex').slice(0, 8);
  return `${name.slice(0, 54)}_${hash}`;
}

/** Stamps `annotations.backstage.io/location` on an entity using the MS Graph UID. */
function withLocations(providerId: string, entity: Entity): Entity {
  const uid =
    entity.metadata.annotations?.[MICROSOFT_GRAPH_USER_ID_ANNOTATION] ||
    entity.metadata.annotations?.[MICROSOFT_GRAPH_GROUP_ID_ANNOTATION] ||
    entity.metadata.annotations?.[MICROSOFT_GRAPH_TENANT_ID_ANNOTATION] ||
    entity.metadata.name;
  const location = `msgraph:${providerId}/${encodeURIComponent(uid)}`;
  return {
    ...entity,
    metadata: {
      ...entity.metadata,
      annotations: {
        ...entity.metadata.annotations,
        [ANNOTATION_LOCATION]: location,
        [ANNOTATION_ORIGIN_LOCATION]: location,
      },
    },
  };
}

/**
 * Pagination cursor used by {@link MicrosoftGraphIncrementalEntityProvider}.
 *
 * The `nextLink` field holds the `@odata.nextLink` URL returned by the
 * Microsoft Graph API, which encodes all state needed to resume a paged
 * request. An absent value means the current phase is starting fresh.
 *
 * @public
 */
export type MSGraphCursor = {
  phase: 'users' | 'groups';
  nextLink?: string;
};

/**
 * Context passed to each burst of {@link MicrosoftGraphIncrementalEntityProvider}.
 *
 * @public
 */
export type MSGraphContext = {
  client: MicrosoftGraphClient;
  provider: MicrosoftGraphProviderConfig;
};

/**
 * Options for {@link MicrosoftGraphIncrementalEntityProvider}.
 *
 * @public
 */
export interface MicrosoftGraphIncrementalEntityProviderOptions {
  /**
   * The logger to use.
   */
  logger: LoggerService;

  /**
   * The function that transforms a user entry in msgraph to an entity.
   * Optionally, you can pass separate transformers per provider ID.
   */
  userTransformer?: UserTransformer | Record<string, UserTransformer>;

  /**
   * The function that transforms a group entry in msgraph to an entity.
   * Optionally, you can pass separate transformers per provider ID.
   */
  groupTransformer?: GroupTransformer | Record<string, GroupTransformer>;

  /**
   * The function that transforms an organization entry in msgraph to an entity.
   * Optionally, you can pass separate transformers per provider ID.
   */
  organizationTransformer?:
    | OrganizationTransformer
    | Record<string, OrganizationTransformer>;

  /**
   * The function that transforms provider config dynamically before each sync.
   * Optionally, you can pass separate transformers per provider ID.
   */
  providerConfigTransformer?:
    | ProviderConfigTransformer
    | Record<string, ProviderConfigTransformer>;
}

/**
 * Incrementally reads user and group entries out of Microsoft Graph, one page
 * at a time, and provides them as User and Group entities for the catalog.
 *
 * Unlike `MicrosoftGraphOrgEntityProvider`, this provider never holds the full
 * dataset in memory at once. Each burst processes a single page (up to 999
 * users or 100 groups). This makes it suitable for very large tenants and
 * avoids the memory pressure and long-running task issues of the full-scan
 * provider.
 *
 * The Microsoft Graph `@odata.nextLink` URL is stored as the cursor, so a pod
 * restart during ingestion resumes from the last completed page.
 *
 * Group membership (`spec.members`) is resolved inline during the groups phase
 * by fetching the direct members of each group. The catalog's built-in relation
 * stitching derives `spec.memberOf` on users from these group membership lists.
 *
 * @remarks
 * `userGroupMemberFilter`, `userGroupMemberSearch`, `userGroupMemberPath`, and
 * `groupIncludeSubGroups` are not supported. Use `userFilter` / `userPath` to
 * restrict which users are ingested, and `groupFilter` / `groupSearch` to
 * restrict which groups. Switch to `MicrosoftGraphOrgEntityProvider` if you
 * require any of these options.
 *
 * @public
 */
export class MicrosoftGraphIncrementalEntityProvider
  implements IncrementalEntityProvider<MSGraphCursor, MSGraphContext>
{
  /**
   * Create one provider instance per provider entry in
   * `catalog.providers.microsoftGraphOrg`.
   */
  static fromConfig(
    configRoot: Config,
    options: MicrosoftGraphIncrementalEntityProviderOptions,
  ): MicrosoftGraphIncrementalEntityProvider[] {
    function getTransformer<T extends Function>(
      id: string,
      transformers?: T | Record<string, T>,
    ): T | undefined {
      if (['undefined', 'function'].includes(typeof transformers)) {
        return transformers as T;
      }
      return (transformers as Record<string, T>)[id];
    }

    return readProviderConfigs(configRoot).map(
      providerConfig =>
        new MicrosoftGraphIncrementalEntityProvider({
          id: providerConfig.id,
          provider: providerConfig,
          logger: options.logger,
          userTransformer: getTransformer(
            providerConfig.id,
            options.userTransformer,
          ),
          groupTransformer: getTransformer(
            providerConfig.id,
            options.groupTransformer,
          ),
          organizationTransformer: getTransformer(
            providerConfig.id,
            options.organizationTransformer,
          ),
          providerConfigTransformer: getTransformer(
            providerConfig.id,
            options.providerConfigTransformer,
          ),
        }),
    );
  }

  private readonly options: {
    id: string;
    provider: MicrosoftGraphProviderConfig;
    logger: LoggerService;
    userTransformer?: UserTransformer;
    groupTransformer?: GroupTransformer;
    organizationTransformer?: OrganizationTransformer;
    providerConfigTransformer?: ProviderConfigTransformer;
  };

  constructor(options: {
    id: string;
    provider: MicrosoftGraphProviderConfig;
    logger: LoggerService;
    userTransformer?: UserTransformer;
    groupTransformer?: GroupTransformer;
    organizationTransformer?: OrganizationTransformer;
    providerConfigTransformer?: ProviderConfigTransformer;
  }) {
    this.options = options;
  }

  /** {@inheritdoc @backstage/plugin-catalog-backend-module-incremental-ingestion#IncrementalEntityProvider.getProviderName} */
  getProviderName(): string {
    return `MicrosoftGraphIncrementalEntityProvider:${this.options.id}`;
  }

  /**
   * Sets up the Microsoft Graph client for the duration of a full ingestion
   * cycle. The optional `providerConfigTransformer` is applied here so that
   * dynamic config changes (e.g., rotating credentials) take effect at the
   * start of each cycle rather than mid-way through.
   */
  async around(
    burst: (context: MSGraphContext) => Promise<void>,
  ): Promise<void> {
    const provider = this.options.providerConfigTransformer
      ? await this.options.providerConfigTransformer(this.options.provider)
      : this.options.provider;

    if (
      provider.userGroupMemberFilter ||
      provider.userGroupMemberSearch ||
      provider.userGroupMemberPath
    ) {
      this.options.logger.warn(
        `${this.getProviderName()}: userGroupMemberFilter/Search/Path are not supported by ` +
          `MicrosoftGraphIncrementalEntityProvider. Users will be fetched via the standard ` +
          `userFilter/userPath options instead. Switch to MicrosoftGraphOrgEntityProvider if ` +
          `you require userGroupMember-based ingestion.`,
      );
    }

    if (provider.groupIncludeSubGroups) {
      this.options.logger.warn(
        `${this.getProviderName()}: groupIncludeSubGroups is not supported by ` +
          `MicrosoftGraphIncrementalEntityProvider and will be ignored. ` +
          `Switch to MicrosoftGraphOrgEntityProvider if you require this option.`,
      );
    }

    const client = MicrosoftGraphClient.create(provider);
    await burst({ client, provider });
  }

  /** {@inheritdoc @backstage/plugin-catalog-backend-module-incremental-ingestion#IncrementalEntityProvider.next} */
  async next(
    { client, provider }: MSGraphContext,
    cursor?: MSGraphCursor,
  ): Promise<EntityIteratorResult<MSGraphCursor>> {
    const phase = cursor?.phase ?? 'users';
    const nextLink = cursor?.nextLink;

    if (phase === 'users') {
      return this.readUsersPage(client, provider, nextLink);
    }
    return this.readGroupsPage(client, provider, nextLink);
  }

  private async readUsersPage(
    client: MicrosoftGraphClient,
    provider: MicrosoftGraphProviderConfig,
    nextLink: string | undefined,
  ): Promise<EntityIteratorResult<MSGraphCursor>> {
    const { items: rawUsers, nextLink: newNextLink } =
      await requestOnePage<MicrosoftGraph.User>(
        client,
        provider.userPath ?? 'users',
        {
          query: {
            filter: provider.userFilter,
            expand: provider.userExpand,
            select: provider.userSelect,
            top: USER_PAGE_SIZE,
          },
          queryMode: provider.queryMode,
          nextLink,
        },
      );

    const transformer = this.options.userTransformer ?? defaultUserTransformer;
    const limiter = limiterFactory(10);
    const entities: DeferredEntity[] = [];

    await Promise.all(
      rawUsers.map(user =>
        limiter(async () => {
          let userPhoto: string | undefined;
          if (user.id && provider.loadUserPhotos !== false) {
            try {
              userPhoto = await getUserPhotoGated(client, user.id, 120);
            } catch (e) {
              this.options.logger.debug(
                `${this.getProviderName()}: failed to load photo for user ${
                  user.id
                }`,
                { error: e },
              );
            }
          }

          const entity = await transformer(user, userPhoto);
          if (entity) {
            entity.metadata.name = capEntityName(entity.metadata.name);
            entities.push({
              locationKey: `msgraph-org-provider:${this.options.id}`,
              entity: withLocations(this.options.id, entity),
            });
          }
        }),
      ),
    );

    this.options.logger.debug(
      `${this.getProviderName()}: read ${entities.length} users`,
      { phase: 'users', hasNextPage: !!newNextLink },
    );

    if (newNextLink) {
      return {
        done: false,
        entities,
        cursor: { phase: 'users', nextLink: newNextLink },
      };
    }

    return {
      done: false,
      entities,
      cursor: { phase: 'groups' },
    };
  }

  private async readGroupsPage(
    client: MicrosoftGraphClient,
    provider: MicrosoftGraphProviderConfig,
    nextLink: string | undefined,
  ): Promise<EntityIteratorResult<MSGraphCursor>> {
    const { items: rawGroups, nextLink: newNextLink } =
      await requestOnePage<MicrosoftGraph.Group>(
        client,
        provider.groupPath ?? 'groups',
        {
          query: {
            filter: provider.groupFilter,
            search: provider.groupSearch,
            expand: provider.groupExpand,
            select: provider.groupSelect,
            top: GROUP_PAGE_SIZE,
          },
          queryMode: provider.queryMode,
          nextLink,
        },
      );

    const groupTransformer =
      this.options.groupTransformer ?? defaultGroupTransformer;
    const userTransformer =
      this.options.userTransformer ?? defaultUserTransformer;
    const limiter = limiterFactory(10);
    const entities: DeferredEntity[] = [];

    // Emit the tenant root group on the very first groups page
    if (!nextLink) {
      try {
        const organization = await client.getOrganization(provider.tenantId);
        const orgTransformer =
          this.options.organizationTransformer ??
          defaultOrganizationTransformer;
        const rootGroup = await orgTransformer(organization);
        if (rootGroup) {
          entities.push({
            locationKey: `msgraph-org-provider:${this.options.id}`,
            entity: withLocations(this.options.id, rootGroup),
          });
        }
      } catch (e) {
        this.options.logger.warn(
          `${this.getProviderName()}: failed to read organization root group`,
          { error: e },
        );
      }
    }

    await Promise.all(
      rawGroups.map(group =>
        limiter(async () => {
          const entity = await groupTransformer(group);
          if (!entity) {
            return;
          }
          entity.metadata.name = capEntityName(entity.metadata.name);

          const userRefs: string[] = [];
          const childRefs: string[] = [];

          for await (const member of client.getGroupMembers(group.id!, {
            top: GROUP_PAGE_SIZE,
            // Request the minimum fields needed by defaultUserTransformer and
            // defaultGroupTransformer so member objects are never sparse.
            select: [
              'id',
              'displayName',
              'mail',
              'mailNickname',
              'userPrincipalName',
              'description',
              'securityEnabled',
            ],
          })) {
            if (member['@odata.type'] === '#microsoft.graph.user') {
              try {
                const userEntity = await userTransformer(
                  member as MicrosoftGraph.User,
                );
                if (userEntity) {
                  userEntity.metadata.name = capEntityName(
                    userEntity.metadata.name,
                  );
                  userRefs.push(stringifyEntityRef(userEntity));
                } else {
                  this.options.logger.debug(
                    `${this.getProviderName()}: group member user ${
                      member.id
                    } could not be transformed (sparse object?), skipping`,
                  );
                }
              } catch (e) {
                this.options.logger.warn(
                  `${this.getProviderName()}: group member user ${
                    member.id
                  } failed to transform, skipping`,
                  { error: e },
                );
              }
            } else if (member['@odata.type'] === '#microsoft.graph.group') {
              // Only emit child refs when no group filter/search is active.
              // With a filter, child groups may not be ingested themselves,
              // which would produce dangling spec.children references.
              if (!provider.groupFilter && !provider.groupSearch) {
                try {
                  const childEntity = await groupTransformer(
                    member as MicrosoftGraph.Group,
                  );
                  if (childEntity) {
                    childEntity.metadata.name = capEntityName(
                      childEntity.metadata.name,
                    );
                    childRefs.push(stringifyEntityRef(childEntity));
                  } else {
                    this.options.logger.debug(
                      `${this.getProviderName()}: group member child group ${
                        member.id
                      } could not be transformed (sparse object?), skipping`,
                    );
                  }
                } catch (e) {
                  this.options.logger.warn(
                    `${this.getProviderName()}: group member child group ${
                      member.id
                    } failed to transform, skipping`,
                    { error: e },
                  );
                }
              }
            }
          }

          // Merge fetched membership with any members/children the transformer
          // may have pre-populated, so custom transformers can augment the list.
          const existingMembers = Array.isArray(entity.spec?.members)
            ? (entity.spec.members as string[])
            : [];
          const existingChildren = Array.isArray(entity.spec?.children)
            ? (entity.spec.children as string[])
            : [];

          entities.push({
            locationKey: `msgraph-org-provider:${this.options.id}`,
            entity: withLocations(this.options.id, {
              ...entity,
              spec: {
                ...entity.spec,
                members: [...new Set([...existingMembers, ...userRefs])],
                children: [...new Set([...existingChildren, ...childRefs])],
              },
            }),
          });
        }),
      ),
    );

    this.options.logger.debug(
      `${this.getProviderName()}: read ${rawGroups.length} groups`,
      { phase: 'groups', hasNextPage: !!newNextLink },
    );

    if (newNextLink) {
      return {
        done: false,
        entities,
        cursor: { phase: 'groups', nextLink: newNextLink },
      };
    }

    return { done: true, entities };
  }
}
