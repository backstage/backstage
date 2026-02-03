/*
 * Copyright 2022 The Backstage Authors
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
  DEFAULT_NAMESPACE,
  Entity,
  parseEntityRef,
  RELATION_MEMBER_OF,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { ConflictError, InputError, NotFoundError } from '@backstage/errors';
import { AuthService, LoggerService } from '@backstage/backend-plugin-api';
import { CatalogService } from '@backstage/plugin-catalog-node';
import { TokenIssuer } from '../../identity/types';
import {
  AuthOwnershipResolver,
  AuthResolverCatalogUserQuery,
  AuthResolverContext,
  TokenParams,
} from '@backstage/plugin-auth-node';
import { CatalogIdentityClient } from '../catalog/CatalogIdentityClient';
import { UserInfoDatabase } from '../../database/UserInfoDatabase';

function getDefaultOwnershipEntityRefs(entity: Entity) {
  const membershipRefs =
    entity.relations
      ?.filter(
        r => r.type === RELATION_MEMBER_OF && r.targetRef.startsWith('group:'),
      )
      .map(r => r.targetRef) ?? [];

  return Array.from(new Set([stringifyEntityRef(entity), ...membershipRefs]));
}

export class CatalogAuthResolverContext implements AuthResolverContext {
  static create(options: {
    logger: LoggerService;
    catalog: CatalogService;
    tokenIssuer: TokenIssuer;
    auth: AuthService;
    ownershipResolver?: AuthOwnershipResolver;
    userInfo: UserInfoDatabase;
  }): CatalogAuthResolverContext {
    const catalogIdentityClient = new CatalogIdentityClient({
      catalog: options.catalog,
      auth: options.auth,
    });

    return new CatalogAuthResolverContext(
      options.logger,
      options.tokenIssuer,
      catalogIdentityClient,
      options.catalog,
      options.auth,
      options.userInfo,
      options.ownershipResolver,
    );
  }

  public readonly logger: LoggerService;
  public readonly tokenIssuer: TokenIssuer;
  public readonly catalogIdentityClient: CatalogIdentityClient;
  private readonly catalog: CatalogService;
  private readonly auth: AuthService;
  private readonly userInfo: UserInfoDatabase;
  private readonly ownershipResolver?: AuthOwnershipResolver;

  private constructor(
    logger: LoggerService,
    tokenIssuer: TokenIssuer,
    catalogIdentityClient: CatalogIdentityClient,
    catalog: CatalogService,
    auth: AuthService,
    userInfo: UserInfoDatabase,
    ownershipResolver?: AuthOwnershipResolver,
  ) {
    this.logger = logger;
    this.tokenIssuer = tokenIssuer;
    this.catalogIdentityClient = catalogIdentityClient;
    this.catalog = catalog;
    this.auth = auth;
    this.userInfo = userInfo;
    this.ownershipResolver = ownershipResolver;
  }

  async issueToken(params: TokenParams) {
    const { sub, ent = [sub], ...additionalClaims } = params.claims;
    const claims = {
      sub,
      ent,
      ...additionalClaims,
    };

    const issuedToken = await this.tokenIssuer.issueToken({
      claims,
    });

    // Store the user info in the database upon successful token
    // issuance so that it can be retrieved later by limited user tokens
    await this.userInfo.addUserInfo({
      claims,
    });

    return issuedToken;
  }

  async findCatalogUser(query: AuthResolverCatalogUserQuery) {
    let result: Entity[] | Entity | undefined = undefined;

    if ('entityRef' in query) {
      const entityRef = parseEntityRef(query.entityRef, {
        defaultKind: 'User',
        defaultNamespace: DEFAULT_NAMESPACE,
      });
      result = await this.catalog.getEntityByRef(entityRef, {
        credentials: await this.auth.getOwnServiceCredentials(),
      });
    } else if ('annotations' in query) {
      const filter: Record<string, string> = {
        kind: 'user',
      };
      for (const [key, value] of Object.entries(query.annotations)) {
        filter[`metadata.annotations.${key}`] = value;
      }
      const res = await this.catalog.getEntities(
        { filter },
        { credentials: await this.auth.getOwnServiceCredentials() },
      );
      result = res.items;
    } else if ('filter' in query) {
      const filter = [query.filter].flat().map(value => {
        if (
          !Object.keys(value).some(
            key => key.toLocaleLowerCase('en-US') === 'kind',
          )
        ) {
          return {
            ...value,
            kind: 'user',
          };
        }
        return value;
      });
      const res = await this.catalog.getEntities(
        { filter: filter },
        { credentials: await this.auth.getOwnServiceCredentials() },
      );
      result = res.items;
    } else {
      throw new InputError('Invalid user lookup query');
    }

    if (Array.isArray(result)) {
      if (result.length > 1) {
        throw new ConflictError('User lookup resulted in multiple matches');
      }
      result = result[0];
    }
    if (!result) {
      throw new NotFoundError('User not found');
    }

    return { entity: result };
  }

  async signInWithCatalogUser(
    query: AuthResolverCatalogUserQuery,
    options?: {
      dangerousEntityRefFallback?: {
        entityRef:
          | string
          | {
              kind?: string;
              namespace?: string;
              name: string;
            };
      };
    },
  ) {
    try {
      const { entity } = await this.findCatalogUser(query);

      const { ownershipEntityRefs } = await this.resolveOwnershipEntityRefs(
        entity,
      );

      return await this.issueToken({
        claims: {
          sub: stringifyEntityRef(entity),
          ent: ownershipEntityRefs,
        },
      });
    } catch (error) {
      if (
        error?.name !== 'NotFoundError' ||
        !options?.dangerousEntityRefFallback
      ) {
        throw error;
      }
      const userEntityRef = stringifyEntityRef(
        parseEntityRef(options.dangerousEntityRefFallback.entityRef, {
          defaultKind: 'User',
          defaultNamespace: DEFAULT_NAMESPACE,
        }),
      );

      return await this.issueToken({
        claims: {
          sub: userEntityRef,
          ent: [userEntityRef],
        },
      });
    }
  }

  async resolveOwnershipEntityRefs(
    entity: Entity,
  ): Promise<{ ownershipEntityRefs: string[] }> {
    if (this.ownershipResolver) {
      return this.ownershipResolver.resolveOwnershipEntityRefs(entity);
    }
    return { ownershipEntityRefs: getDefaultOwnershipEntityRefs(entity) };
  }
}
