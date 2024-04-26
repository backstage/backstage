/*
 * Copyright 2021 The Backstage Authors
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
  DashboardEntitySummary,
  DashboardSnapshotSummary,
  NewRelicDashboardApi,
} from './NewRelicDashboardApi';
import { DiscoveryApi, FetchApi } from '@backstage/core-plugin-api';
import { DashboardEntity } from '../types/DashboardEntity';
import { DashboardSnapshot } from '../types/DashboardSnapshot';
import { getDashboardParentGuidQuery } from '../queries/getDashboardParentGuidQuery';
import { getDashboardSnapshotQuery } from '../queries/getDashboardSnapshotQuery';
import { ResponseError } from '@backstage/errors';

export class NewRelicDashboardClient implements NewRelicDashboardApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly fetchApi: FetchApi;

  constructor({
    discoveryApi,
    fetchApi,
  }: {
    discoveryApi: DiscoveryApi;
    fetchApi: FetchApi;
    baseUrl?: string;
  }) {
    this.discoveryApi = discoveryApi;
    this.fetchApi = fetchApi;
  }

  private async callApi<T>(
    query: string,
    variables: { [key in string]: string | number },
  ): Promise<T | undefined> {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    const graphql = JSON.stringify({
      query: query,
      variables: variables,
    });
    const requestOptions: RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: graphql,
      redirect: 'follow',
    };

    const apiUrl = `${await this.discoveryApi.getBaseUrl(
      'proxy',
    )}/newrelic/api/graphql`;
    const response = await this.fetchApi.fetch(apiUrl, requestOptions);
    if (response.status === 200) {
      return (await response.json()) as T;
    }
    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    } else {
      return undefined;
    }
  }

  async getDashboardEntity(
    guid: string,
  ): Promise<DashboardEntitySummary | undefined> {
    const DashboardEntityList = await this.callApi<DashboardEntity>(
      getDashboardParentGuidQuery,
      {
        query: `id ='${guid}' OR parentId ='${guid}'`,
      },
    );
    if (
      DashboardEntityList &&
      DashboardEntityList?.data?.actor.entitySearch.results.entities?.length > 1
    ) {
      DashboardEntityList.data.actor.entitySearch.results.entities =
        DashboardEntityList?.data.actor.entitySearch.results.entities.filter(
          entity => entity?.dashboardParentGuid !== null,
        );
    }
    return {
      getDashboardEntity: DashboardEntityList!,
    };
  }

  async getDashboardSnapshot(
    guid: string,
    duration: number,
  ): Promise<DashboardSnapshotSummary | undefined> {
    const DashboardSnapshotValue = await this.callApi<DashboardSnapshot>(
      getDashboardSnapshotQuery,
      {
        guid: guid,
        duration: duration,
      },
    );
    return {
      getDashboardSnapshot: DashboardSnapshotValue!,
    };
  }
}
