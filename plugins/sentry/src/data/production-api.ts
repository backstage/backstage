/*
 * Copyright 2020 Spotify AB
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
import { SentryIssue } from './sentry-issue';
import { SentryApi } from './sentry-api';

const API_BASE_URL = 'http://localhost:7000/sentry/api/0/projects/';

export class ProductionSentryApi implements SentryApi {
  private organization: string;

  constructor(organization: string) {
    this.organization = organization;
  }

  async fetchIssues(project: string, statsFor: string): Promise<SentryIssue[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/${this.organization}/${project}/issues/?statsFor=${statsFor}`,
      );

      if (response.status >= 400 && response.status < 600) {
        throw new Error('Failed fetching Sentry issues');
      }

      return (await response.json()) as SentryIssue[];
    } catch (exception) {
      if (exception.detail) {
        return exception;
      }
      throw new Error('Unknown error');
    }
  }
}
