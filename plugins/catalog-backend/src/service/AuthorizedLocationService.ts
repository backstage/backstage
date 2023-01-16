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

import { Location } from '@backstage/catalog-client';
import { Entity } from '@backstage/catalog-model';
import { NotAllowedError, NotFoundError } from '@backstage/errors';
import {
  catalogLocationCreatePermission,
  catalogLocationDeletePermission,
  catalogLocationReadPermission,
} from '@backstage/plugin-catalog-common/alpha';
import {
  AuthorizeResult,
  PermissionEvaluator,
} from '@backstage/plugin-permission-common';
import { LocationInput, LocationService } from './types';

export class AuthorizedLocationService implements LocationService {
  constructor(
    private readonly locationService: LocationService,
    private readonly permissionApi: PermissionEvaluator,
  ) {}

  async createLocation(
    spec: LocationInput,
    dryRun: boolean,
    options?: {
      authorizationToken?: string;
    },
  ): Promise<{
    location: Location;
    entities: Entity[];
    exists?: boolean | undefined;
  }> {
    const authorizationResponse = (
      await this.permissionApi.authorize(
        [{ permission: catalogLocationCreatePermission }],
        { token: options?.authorizationToken },
      )
    )[0];

    if (authorizationResponse.result === AuthorizeResult.DENY) {
      throw new NotAllowedError();
    }

    return this.locationService.createLocation(spec, dryRun);
  }

  async listLocations(options?: {
    authorizationToken?: string;
  }): Promise<Location[]> {
    const authorizationResponse = (
      await this.permissionApi.authorize(
        [{ permission: catalogLocationReadPermission }],
        { token: options?.authorizationToken },
      )
    )[0];

    if (authorizationResponse.result === AuthorizeResult.DENY) {
      return [];
    }

    return this.locationService.listLocations();
  }

  async getLocation(
    id: string,
    options?: { authorizationToken?: string },
  ): Promise<Location> {
    const authorizationResponse = (
      await this.permissionApi.authorize(
        [{ permission: catalogLocationReadPermission }],
        { token: options?.authorizationToken },
      )
    )[0];

    if (authorizationResponse.result === AuthorizeResult.DENY) {
      throw new NotFoundError(`Found no location with ID ${id}`);
    }

    return this.locationService.getLocation(id);
  }

  async deleteLocation(
    id: string,
    options?: { authorizationToken?: string },
  ): Promise<void> {
    const authorizationResponse = (
      await this.permissionApi.authorize(
        [{ permission: catalogLocationDeletePermission }],
        { token: options?.authorizationToken },
      )
    )[0];

    if (authorizationResponse.result === AuthorizeResult.DENY) {
      throw new NotAllowedError();
    }

    return this.locationService.deleteLocation(id);
  }
}
