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

import { KafkaDashboardApi } from './types';
import { Entity } from '@backstage/catalog-model';
import { ConfigApi } from '@backstage/core-plugin-api';
import { KAFKA_DASHBOARD_URL } from '../constants';

export class KafkaDashboardClient implements KafkaDashboardApi {
  private readonly configApi: ConfigApi;
  private readonly regexPattern =
    /^([a-z0-9._-]+)\/([a-z0-9._-]+)?\/?(https?.*)$/i;

  constructor(options: { configApi: ConfigApi }) {
    this.configApi = options.configApi;
  }

  getDashboardUrl(
    clusterId: string,
    consumerGroup: string,
    entity: Entity,
  ): { url?: string } {
    const annotation = entity.metadata.annotations?.[KAFKA_DASHBOARD_URL] ?? '';

    const dashboardList = annotation
      .split(',')
      .filter(value => value !== undefined && value !== '')
      .map(value => value.match(this.regexPattern) as string[])
      .filter(
        value =>
          value[1] === clusterId &&
          (value[2] === undefined || value[2] === consumerGroup),
      )
      .sort((a, b) => {
        if (a[2] === b[2]) return 0;
        if (a[2] !== undefined) return -1;
        return 1;
      });

    if (dashboardList.length > 0) {
      return { url: dashboardList[0][3] };
    }

    return {
      url:
        this.configApi
          .getConfigArray('kafka.clusters')
          .filter(value => value.getString('name') === clusterId)
          .map(value => value.getOptionalString('dashboardUrl'))[0] ||
        undefined,
    };
  }
}
