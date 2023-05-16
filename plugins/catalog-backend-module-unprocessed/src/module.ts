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
  HttpRouterService,
  LoggerService,
} from '@backstage/backend-plugin-api';
import Router from 'express-promise-router';
import { getBearerTokenFromAuthorizationHeader } from '@backstage/plugin-auth-node';

export class UnprocessedEntitesModule {
  private readonly moduleRouter;

  constructor(
    private readonly database: Knex,
    private readonly router: HttpRouterService,
    private readonly logger: LoggerService,
  ) {
    this.moduleRouter = Router();
    this.router.use(this.moduleRouter);
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
    this.moduleRouter
      .get('/entities/unprocessed/failed', async (req, res) => {
        return res.json(
          await this.unprocessed({
            reason: 'failed',
            owner: req.query.owner as string,
            authorizationToken: getBearerTokenFromAuthorizationHeader(
              req.header('authorization'),
            ),
          }),
        );
      })
      .get('/entities/unprocessed/pending', async (req, res) => {
        return res.json(
          await this.unprocessed({
            reason: 'pending',
            owner: req.query.owner as string,
            authorizationToken: getBearerTokenFromAuthorizationHeader(
              req.header('authorization'),
            ),
          }),
        );
      });
  }
}
