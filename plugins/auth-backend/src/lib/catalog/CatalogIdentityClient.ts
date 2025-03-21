/*
 * Copyright 2020 The Backstage Authors
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
  AuthService,
  DiscoveryService,
  HttpAuthService,
  LoggerService,
} from '@backstage/backend-plugin-api';
import { ConflictError, NotFoundError } from '@backstage/errors';
import { CatalogApi } from '@backstage/catalog-client';
import {
  CompoundEntityRef,
  parseEntityRef,
  RELATION_MEMBER_OF,
  stringifyEntityRef,
  UserEntity,
} from '@backstage/catalog-model';
import {
  TokenManager,
  createLegacyAuthAdapters,
} from '@backstage/backend-common';

/**
 * A catalog client tailored for reading out identity data from the catalog.
 *
 * @public
 * @deprecated Use the provided `AuthResolverContext` instead, see https://backstage.io/docs/auth/identity-resolver#building-custom-resolvers
 */
export class CatalogIdentityClient {
  private readonly catalogApi: CatalogApi;
  private readonly auth: AuthService;

  constructor(options: {
    catalogApi: CatalogApi;
    tokenManager?: TokenManager;
    discovery: DiscoveryService;
    auth?: AuthService;
    httpAuth?: HttpAuthService;
  }) {
    this.catalogApi = options.catalogApi;

    const { auth } = createLegacyAuthAdapters({
      auth: options.auth,
      httpAuth: options.httpAuth,
      discovery: options.discovery,
      tokenManager: options.tokenManager,
    });

    this.auth = auth;
  }

  /**
   * Looks up a single user using a query.
   *
   * Throws a NotFoundError or ConflictError if 0 or multiple users are found.
   */
  async findUser(query: {
    annotations: Record<string, string>;
  }): Promise<UserEntity> {
    const filter: Record<string, string> = {
      kind: 'user',
    };
    for (const [key, value] of Object.entries(query.annotations)) {
      filter[`metadata.annotations.${key}`] = value;
    }

    const { token } = await this.auth.getPluginRequestToken({
      onBehalfOf: await this.auth.getOwnServiceCredentials(),
      targetPluginId: 'catalog',
    });

    const { items } = await this.catalogApi.getEntities({ filter }, { token });

    if (items.length !== 1) {
      if (items.length > 1) {
        throw new ConflictError('User lookup resulted in multiple matches');
      } else {
        throw new NotFoundError('User not found');
      }
    }

    return items[0] as UserEntity;
  }

  /**
   * Resolve additional entity claims from the catalog, using the passed-in entity names. Designed
   * to be used within a `signInResolver` where additional entity claims might be provided, but
   * group membership and transient group membership lean on imported catalog relations.
   *
   * Returns a superset of the entity names that can be passed directly to `issueToken` as `ent`.
   */
  async resolveCatalogMembership(query: {
    entityRefs: string[];
    logger?: LoggerService;
  }): Promise<string[]> {
    const { entityRefs, logger } = query;
    const resolvedEntityRefs = entityRefs
      .map((ref: string) => {
        try {
          const parsedRef = parseEntityRef(ref.toLocaleLowerCase('en-US'), {
            defaultKind: 'user',
            defaultNamespace: 'default',
          });
          return parsedRef;
        } catch {
          logger?.warn(`Failed to parse entityRef from ${ref}, ignoring`);
          return null;
        }
      })
      .filter((ref): ref is CompoundEntityRef => ref !== null);

    const filter = resolvedEntityRefs.map(ref => ({
      kind: ref.kind,
      'metadata.namespace': ref.namespace,
      'metadata.name': ref.name,
    }));

    const { token } = await this.auth.getPluginRequestToken({
      onBehalfOf: await this.auth.getOwnServiceCredentials(),
      targetPluginId: 'catalog',
    });

    const entities = await this.catalogApi
      .getEntities({ filter }, { token })
      .then(r => r.items);

    if (entityRefs.length !== entities.length) {
      const foundEntityNames = entities.map(stringifyEntityRef);
      const missingEntityNames = resolvedEntityRefs
        .map(stringifyEntityRef)
        .filter(s => !foundEntityNames.includes(s));
      logger?.debug(`Entities not found for refs ${missingEntityNames.join()}`);
    }

    const memberOf = entities.flatMap(
      e =>
        e!.relations
          ?.filter(r => r.type === RELATION_MEMBER_OF)
          .map(r => r.targetRef) ?? [],
    );

    const newEntityRefs = [
      ...new Set(resolvedEntityRefs.map(stringifyEntityRef).concat(memberOf)),
    ];

    logger?.debug(`Found catalog membership: ${newEntityRefs.join()}`);
    return newEntityRefs;
  }
}
