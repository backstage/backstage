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

import { Groups } from './airbrakeGroups';
import { AirbrakeApi } from './AirbrakeApi';

export class ProductionAirbrakeApi implements AirbrakeApi {
  constructor(private readonly apiKey?: string) {}

  async fetchGroups(projectId: string): Promise<Groups> {
    const apiUrl = `https://api.airbrake.io/api/v4/projects/${projectId}/groups?key=${this.apiKey}`;

    const response = await fetch(apiUrl);

    if (response.status >= 400 && response.status < 600) {
      throw new Error('Failed fetching Airbrake groups');
    }

    return (await response.json()) as Groups;
  }
}
