/*
 * Copyright 2026 Estehsan Tariq
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

import { DiscoveryApi, FetchApi } from '@backstage/core-plugin-api';
import { OnboardingApi } from './OnboardingApi';
import {
  OnboardingProgress,
  OnboardingTemplate,
  TaskStatus,
  TeamOnboardingStats,
} from '../types';

/** @public */
export class OnboardingClient implements OnboardingApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly fetchApi: FetchApi;

  constructor(options: { discoveryApi: DiscoveryApi; fetchApi: FetchApi }) {
    this.discoveryApi = options.discoveryApi;
    this.fetchApi = options.fetchApi;
  }

  async getProgress(userId: string): Promise<OnboardingProgress> {
    return this.request<OnboardingProgress>(
      `/progress/${encodeURIComponent(userId)}`,
    );
  }

  async updateTaskStatus(
    userId: string,
    taskId: string,
    status: TaskStatus,
    blockedReason?: string,
  ): Promise<OnboardingProgress> {
    return this.request<OnboardingProgress>(
      `/progress/${encodeURIComponent(userId)}/tasks/${encodeURIComponent(taskId)}`,
      {
        method: 'POST',
        body: JSON.stringify({ status, blockedReason }),
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }

  async getTeamStats(teamName: string): Promise<TeamOnboardingStats> {
    return this.request<TeamOnboardingStats>(
      `/team/${encodeURIComponent(teamName)}/stats`,
    );
  }

  async getTemplates(): Promise<OnboardingTemplate[]> {
    return this.request<OnboardingTemplate[]>('/templates');
  }

  async assignTemplate(
    templateName: string,
    userId: string,
  ): Promise<OnboardingProgress> {
    return this.request<OnboardingProgress>(
      `/templates/${encodeURIComponent(templateName)}/assign/${encodeURIComponent(userId)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const baseUrl = await this.discoveryApi.getBaseUrl('onboarding');
    const res = await this.fetchApi.fetch(`${baseUrl}${path}`, init);

    if (!res.ok) {
      const text = await res.text();
      throw new Error(
        `Request failed with status ${res.status}: ${text.slice(0, 500)}`,
      );
    }

    return res.json() as Promise<T>;
  }
}
