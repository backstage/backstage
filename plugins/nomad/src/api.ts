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

import { Config } from '@backstage/config';
import { createApiRef } from '@backstage/core-plugin-api';

/** @public */
export const nomadApiRef = createApiRef<NomadApi>({
  id: 'plugin.nomad.service',
});

/** @public */
export type NomadApi = {
  /**
   * listAllocations is for listing all allocations matching some part of 'prefix'.
   *
   * See: https://developer.hashicorp.com/nomad/api-docs/allocations#list-allocations
   */
  listAllocations: (
    options: ListAllocationsRequest,
  ) => Promise<ListAllocationsResponse>;
};

/** @public */
export interface ListAllocationsRequest {
  namespace?: string;
  filter?: string;
}

/** @public */
export interface ListAllocationsResponse {
  allocations: Allocation[];
}

/** @public */
export interface Allocation {
  id: string;
  clientStatus: string;
  createTime: number;
  namespace: string;
  name: string;
  modifyTime: number;
  nodeID: string;
  taskGroup: string;
}

/** @public */
export interface DeploymentStatus {
  healthy: boolean;
  timestamp: string;
}

/** @public */
export class NomadHttpApi implements NomadApi {
  static fromConfig(config: Config) {
    return new NomadHttpApi(
      config.getOptionalString('nomad.nomadAddr'),
      config.getOptionalString('nomad.nomadRegion'),
      config.getOptionalString('nomad.nomadNamespace'),
      config.getOptionalString('nomad.nomadToken'),
    );
  }

  constructor(
    private nomadAddr?: string,
    private nomadRegion?: string,
    private nomadNamespace?: string,
    private nomadToken?: string,
  ) {}

  async listAllocations(
    options: ListAllocationsRequest,
  ): Promise<ListAllocationsResponse> {
    return Promise.resolve({
      allocations: [],
    });
  }
}
