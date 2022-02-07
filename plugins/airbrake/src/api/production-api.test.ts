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

import { ProductionAirbrakeApi } from './production-api';
import nock from 'nock';
import mockGroupsData from './mock/airbrake-groups-api-mock.json';

describe('The production Airbrake API', () => {
  let productionApi: ProductionAirbrakeApi;

  beforeEach(() => {
    productionApi = new ProductionAirbrakeApi('fakeApiKey');
  });

  it('fetches groups using the provided project ID', async () => {
    const scope = nock('https://api.airbrake.io')
      .get('/api/v4/projects/123456/groups?key=fakeApiKey')
      .reply(200, mockGroupsData);
    expect(scope.isDone()).toBe(false);

    const groups = await productionApi.fetchGroups('123456');

    expect(scope.isDone()).toBe(true);
    expect(groups).toStrictEqual(mockGroupsData);
  });

  it('throws if fetching groups was unsuccessful', async () => {
    const scope = nock('https://api.airbrake.io')
      .get('/api/v4/projects/123456/groups?key=fakeApiKey')
      .reply(500, mockGroupsData);
    expect(scope.isDone()).toBe(false);

    await expect(productionApi.fetchGroups('123456')).rejects.toThrow();

    expect(scope.isDone()).toBe(true);
  });
});
