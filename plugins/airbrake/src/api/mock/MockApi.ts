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

import { Groups } from '../airbrakeGroups';
import { AirbrakeApi } from '../AirbrakeApi';
import mockGroupsData from './airbrakeGroupsApiMock.json';

export class MockAirbrakeApi implements AirbrakeApi {
  waitTimeInMillis: number;

  constructor(waitTimeInMillis = 10) {
    this.waitTimeInMillis = waitTimeInMillis;
  }

  fetchGroups(): Promise<Groups> {
    return new Promise(resolve => {
      setTimeout(() => resolve(mockGroupsData), this.waitTimeInMillis);
    });
  }
}
