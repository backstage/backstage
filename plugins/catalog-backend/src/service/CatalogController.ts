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

/**
 * router.post('/refresh', async (req, res) => {
      const refreshOptions: RefreshOptions = req.body;
      refreshOptions.authorizationToken = getBearerToken(
        req.header('authorization'),
      );

      await refreshService.refresh(refreshOptions);
      res.status(200).end();
    });
 */

// src/users/usersController.ts
import {
  Body,
  Controller,
  Get,
  Header,
  Path,
  Post,
  Query,
  Route,
  SuccessResponse,
} from 'tsoa';
import { DefaultRefreshService } from './DefaultRefreshService';
import type { RefreshOptions, RefreshService } from './types';
import {
  container,
  inject as Inject,
  injectable as Injectable,
} from 'tsyringe';
import type { EntitiesCatalog } from '../catalog/types';
import {
  basicEntityFilter,
  parseEntityFilterParams,
  parseEntityPaginationParams,
  parseEntityTransformParams,
} from './request';
import { NotFoundError } from '@backstage/errors';
import { stringifyEntityRef } from '@backstage/catalog-model';
import { parseEntityFacetParams } from './request/parseEntityFacetParams';
import { parseEntityFilterString } from './request/parseEntityFilterParams';

function getBearerToken(
  authorizationHeader: string | undefined,
): string | undefined {
  if (typeof authorizationHeader !== 'string') {
    return undefined;
  }
  const matches = authorizationHeader.match(/Bearer\s+(\S+)/i);
  return matches?.[1];
}
@Injectable()
@Route('')
export class CatalogController extends Controller {
  constructor(
    @Inject('RefreshService') private refreshService?: RefreshService,
    @Inject('EntitiesCatalog') private entitiesCatalog?: EntitiesCatalog,
  ) {
    super();
  }
  @Post('refresh')
  @SuccessResponse(200, 'Refreshed')
  public async refreshEntity(
    @Body() refreshOptions: RefreshOptions,
  ): Promise<void> {
    console.log(this.refreshService);
  }

  @Get('entities')
  @SuccessResponse(200)
  public async getEntities(
    @Header() authorization?: string,
    @Query() filter?: string,
    @Query() fields?: string,
    @Query() offset?: string,
    @Query() limit?: string,
    @Query() after?: string,
  ) {
    const { entities, pageInfo } = await this.entitiesCatalog?.entities({
      filter: parseEntityFilterParams(filter),
      fields: parseEntityTransformParams(fields),
      pagination: parseEntityPaginationParams(offset, limit, after),
      authorizationToken: getBearerToken(authorization),
    })!;

    if (pageInfo.hasNextPage) {
      const url = new URL(`http://ignored${req.url}`);
      url.searchParams.delete('offset');
      url.searchParams.set('after', pageInfo.endCursor);
      this.setHeader('link', `<${url.pathname}${url.search}>; rel="next"`);
    }
    return entities;
  }

  @Get('entities/by-uid/:uid')
  public async getEntityByUid(
    @Path() uid: string,
    @Header() authorization?: string,
  ) {
    const { entities } = await this.entitiesCatalog?.entities({
      filter: basicEntityFilter({ 'metadata.uid': uid }),
      authorizationToken: getBearerToken(authorization),
    })!;
    if (!entities.length) {
      throw new NotFoundError(`No entity with uid ${uid}`);
    }
    return entities[0];
  }

  @Get('entities/by-name/:kind/:namespace/:name')
  public async getEntityByName(
    @Path() kind: string,
    @Path() namespace: string,
    @Path() name: string,
    @Header() authorization?: string,
  ) {
    const { entities } = await this.entitiesCatalog?.entities({
      filter: basicEntityFilter({
        kind: kind,
        'metadata.namespace': namespace,
        'metadata.name': name,
      }),
      authorizationToken: getBearerToken(authorization),
    })!;
    if (!entities.length) {
      throw new NotFoundError(
        `No entity named '${name}' found, with kind '${kind}' in namespace '${namespace}'`,
      );
    }
    return entities[0];
  }

  @Get('entities/by-name/:kind/:namespace/:name/ancestry')
  public async getEntityAncestryByName(
    @Path() kind: string,
    @Path() namespace: string,
    @Path() name: string,
    @Header() authorization?: string,
  ) {
    const entityRef = stringifyEntityRef({ kind, namespace, name });
    return await this.entitiesCatalog?.entityAncestry(entityRef, {
      authorizationToken: getBearerToken(authorization),
    })!;
  }

  @Get('entity-facets')
  public async getEntityFacets(
    @Query() facet: string,
    @Header() authorization?: string,
    @Query() filter?: string,
  ) {
    console.log(facet);
    return await this.entitiesCatalog?.facets({
      filter: parseEntityFilterParams(filter),
      facets: parseEntityFacetParams(facet),
      authorizationToken: getBearerToken(authorization),
    })!;
  }
}
