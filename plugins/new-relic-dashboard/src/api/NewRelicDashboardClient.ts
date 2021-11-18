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
import { DiscoveryApi } from '@backstage/core-plugin-api';
import { DashboardEntity } from '../types/DashboardEntity';
import { DashboardSnapshot } from '../types/DashboardSnapshot';
import { getDashboardParentGuidQuery } from '../queries/getDashboardParentGuidQuery';
import { getDashboardSnapshotQuery } from '../queries/getDashboardSnapshotQuery';

export class NewRelicDashboardClient implements NewRelicDashboardApi {
  discoveryApi: DiscoveryApi;
  baseUrl: string;
  constructor({
    discoveryApi,
    baseUrl = 'https://api.newrelic.com/graphql/',
  }: {
    discoveryApi: DiscoveryApi;
    baseUrl?: string;
  }) {
    this.discoveryApi = discoveryApi;
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  }

  private async callApi<T>(
    query: string,
    variables: { [key in string]: any },
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
    const response = await fetch(apiUrl, requestOptions);
    if (response.status === 200) {
      return (await response.json()) as T;
    }
    return undefined;
  }

  async getDashboardEntity(
    guid: String,
  ): Promise<DashboardEntitySummary | undefined> {
    //  let query = "parentId ='"+guid+"'"
    //  query = `parentId ='${guid}'`
    const DashboardEntityList = await this.callApi<DashboardEntity>(
      getDashboardParentGuidQuery,
      {
        query: `parentId ='${guid}'`,
      },
    );
    return {
      getDashboardEntity: DashboardEntityList!,
    };
  }

  async getDashboardSnapshot(
    guid: String,
    duration: String,
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
