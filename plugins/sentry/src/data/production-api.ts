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

export class ProductionSentryApi implements SentryApi {
  private organization: string;
  private backendBaseUrl: string;

  constructor(organization: string, backendBaseUrl: string) {
    this.organization = organization;
    this.backendBaseUrl = backendBaseUrl;
  }

  async fetchIssues(project: string, statsFor: string): Promise<SentryIssue[]> {
    try {
      const apiBaseUrl = `${this.backendBaseUrl}/sentry/api/0/projects/`;

      const response = await fetch(
        `${apiBaseUrl}/${this.organization}/${project}/issues/?statsFor=${statsFor}`,
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
