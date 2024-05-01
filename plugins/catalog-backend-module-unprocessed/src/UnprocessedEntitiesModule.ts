/*
 * Copyright 2023 The Backstage Authors
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
  HydratedRefreshState,
  RefreshState,
  UnprocessedEntitiesRequest,
  UnprocessedEntitiesResponse,
} from './types';
import { Knex } from 'knex';
import {
  DiscoveryService,
  HttpAuthService,
  HttpRouterService,
  PermissionsService,
} from '@backstage/backend-plugin-api';
import Router from 'express-promise-router';
import type { Request } from 'express';

import {
  AuthorizeResult,
  BasicPermission,
} from '@backstage/plugin-permission-common';
import { unprocessedEntitiesDeletePermission } from '@backstage/plugin-catalog-unprocessed-entities-common';
import { NotAllowedError } from '@backstage/errors';
import { createLegacyAuthAdapters } from '@backstage/backend-common';

/**
 * Module providing Unprocessed Entities API endpoints
 *
 * @public
 */
export class UnprocessedEntitiesModule {
  private readonly moduleRouter;

  private readonly httpAuth: HttpAuthService;

  private constructor(
    private readonly database: Knex,
    private readonly router: Pick<HttpRouterService, 'use'>,
    private readonly permissions: PermissionsService,
    discovery: DiscoveryService,
    httpAuth?: HttpAuthService,
  ) {
    this.moduleRouter = Router();
    this.router.use(this.moduleRouter);

    this.httpAuth = createLegacyAuthAdapters({
      discovery,
      httpAuth,
    }).httpAuth;
  }

  static create(options: {
    router: Pick<HttpRouterService, 'use'>;
    database: Knex;
    discovery: DiscoveryService;
    permissions: PermissionsService;
    httpAuth?: HttpAuthService;
  }) {
    return new UnprocessedEntitiesModule(
      options.database,
      options.router,
      options.permissions,
      options.discovery,
      options.httpAuth,
    );
  }

  private async unprocessed(
    request: UnprocessedEntitiesRequest,
  ): Promise<UnprocessedEntitiesResponse> {
    if (request.reason === 'pending') {
      return {
        type: 'pending',
        entities: await this.pending(request.owner),
      };
    }
    return {
      type: 'failed',
      entities: await this.failed(request.owner),
    };
  }

  private hydrateRefreshState(r: RefreshState): HydratedRefreshState {
    return {
      ...r,
      unprocessed_entity: JSON.parse(r.unprocessed_entity),
      ...(r.processed_entity && {
        processed_entity: JSON.parse(r.processed_entity),
      }),
      ...(r.errors && { errors: JSON.parse(r.errors) }),
      ...(r.cache && { cache: JSON.parse(r.cache) }),
    };
  }

  private async pending(owner?: string): Promise<HydratedRefreshState[]> {
    const res = (
      await this.database('refresh_state.*')
        .from('refresh_state')
        .leftJoin(
          'final_entities',
          'final_entities.entity_id',
          'refresh_state.entity_id',
        )
        .whereNull('final_entities.entity_id')
    ).map(this.hydrateRefreshState);
    if (owner) {
      return res.filter(r => r.unprocessed_entity.spec?.owner === owner);
    }

    return res;
  }

  private async failed(owner?: string): Promise<HydratedRefreshState[]> {
    const res = (
      await this.database('refresh_state.*')
        .from('refresh_state')
        .rightJoin(
          'final_entities',
          'final_entities.entity_id',
          'refresh_state.entity_id',
        )
        .whereNull('final_entities.final_entity')
    ).map(this.hydrateRefreshState);
    if (owner) {
      return res.filter(r => r.unprocessed_entity.spec?.owner === owner);
    }

    return res;
  }

  registerRoutes() {
    const isRequestAuthorized = async (
      req: Request,
      permission: BasicPermission,
    ): Promise<boolean> => {
      const decision = (
        await this.permissions.authorize([{ permission }], {
          credentials: await this.httpAuth.credentials(req),
        })
      )[0];

      return decision.result !== AuthorizeResult.DENY;
    };

    this.moduleRouter
      .get('/entities/unprocessed/failed', async (req, res) => {
        return res.json(
          await this.unprocessed({
            reason: 'failed',
            owner:
              typeof req.query.owner === 'string' ? req.query.owner : undefined,
          }),
        );
      })
      .get('/entities/unprocessed/pending', async (req, res) => {
        return res.json(
          await this.unprocessed({
            reason: 'pending',
            owner:
              typeof req.query.owner === 'string' ? req.query.owner : undefined,
          }),
        );
      })
      .delete(
        '/entities/unprocessed/delete/:entity_id',
        async (request, response) => {
          const authorized = await isRequestAuthorized(
            request,
            unprocessedEntitiesDeletePermission,
          );

          if (!authorized) {
            throw new NotAllowedError('Unauthorized');
          }

          await this.database('refresh_state')
            .where({ entity_id: request.params.entity_id })
            .delete();

          response.status(204).send();
        },
      );
  }
}
