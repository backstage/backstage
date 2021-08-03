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

import { Logger } from 'winston';
import { ConflictError, NotFoundError } from '@backstage/errors';
import { CatalogApi } from '@backstage/catalog-client';
import {
  EntityName,
  parseEntityRef,
  RELATION_MEMBER_OF,
  stringifyEntityRef,
  UserEntity,
} from '@backstage/catalog-model';
import { TokenIssuer } from '../../identity';

type UserQuery = {
  annotations: Record<string, string>;
};

type MemberClaimQuery = {
  sub: string;
  ent: string[];
  logger?: Logger;
};

/**
 * A catalog client tailored for reading out identity data from the catalog.
 */
export class CatalogIdentityClient {
  private readonly catalogApi: CatalogApi;
  private readonly tokenIssuer: TokenIssuer;

  constructor(options: { catalogApi: CatalogApi; tokenIssuer: TokenIssuer }) {
    this.catalogApi = options.catalogApi;
    this.tokenIssuer = options.tokenIssuer;
  }

  /**
   * Looks up a single user using a query.
   *
   * Throws a NotFoundError or ConflictError if 0 or multiple users are found.
   */
  async findUser(query: UserQuery): Promise<UserEntity> {
    const filter: Record<string, string> = {
      kind: 'user',
    };
    for (const [key, value] of Object.entries(query.annotations)) {
      filter[`metadata.annotations.${key}`] = value;
    }

    // TODO(Rugvip): cache the token
    const token = await this.tokenIssuer.issueToken({
      claims: { sub: 'backstage.io/auth-backend' },
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
   * Resolve additional entity claims from the catalog, using the passed-in subject and entity
   * claims. Designed to be used within a `signInResolver` where additional entity claims might be
   * provided, but group membership and transient group membership lean on imported catalog
   * relations.
   *
   * Returns a superset of the `ent` argument that can be passed directly to `issueToken` as `ent`.
   */
  async resolveCatalogMembership({
    sub,
    ent,
    logger,
  }: MemberClaimQuery): Promise<string[]> {
    const subRef: EntityName = parseEntityRef(sub, {
      defaultKind: 'user',
      defaultNamespace: 'default',
    });

    let entityRefs: Array<EntityName> = [];
    if (ent) {
      entityRefs = ent
        .map((ref: string) => {
          try {
            const parsedRef = parseEntityRef(ref.toLocaleLowerCase('en-US'));
            return parsedRef;
          } catch {
            logger?.debug(
              `Failed to parse entityRef from '${sub}' ent claim: ${ref}, ignoring`,
            );
            return null;
          }
        })
        .filter((ref): ref is EntityName => ref !== null);
    }

    const filter = [subRef].concat(entityRefs).map(ref => ({
      kind: ref.kind,
      'metadata.namespace': ref.namespace,
      'metadata.name': ref.name,
    }));
    const entities = await this.catalogApi
      .getEntities({ filter })
      .then(r => r.items);

    if (entityRefs.length !== entities.length) {
      const foundEntityNames = entities.map(stringifyEntityRef);
      const missingEntityNames = entityRefs
        .map(stringifyEntityRef)
        .filter(s => !foundEntityNames.includes(s));
      logger?.debug(
        `Entities not found for '${sub}' claims: ${missingEntityNames.join()}`,
      );
    }

    const memberOf = entities.flatMap(
      e =>
        e!.relations
          ?.filter(r => r.type === RELATION_MEMBER_OF)
          .map(r => r.target) ?? [],
    );

    const newEnt = [...new Set(entityRefs.concat(memberOf))].map(
      stringifyEntityRef,
    );

    logger?.debug(`Found claims for ${sub} in the catalog: ${newEnt.join()}`);
    return newEnt;
  }
}
