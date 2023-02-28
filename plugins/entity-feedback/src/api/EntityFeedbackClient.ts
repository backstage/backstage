/*
 * Copyright 2023 The Backstage Authors
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
import { ResponseError } from '@backstage/errors';
import {
  EntityRatingsData,
  FeedbackResponse,
  Rating,
} from '@backstage/plugin-entity-feedback-common';

import { EntityFeedbackApi } from './EntityFeedbackApi';

/**
 * @public
 */
export class EntityFeedbackClient implements EntityFeedbackApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly fetchApi: FetchApi;

  constructor(options: { discoveryApi: DiscoveryApi; fetchApi: FetchApi }) {
    this.discoveryApi = options.discoveryApi;
    this.fetchApi = options.fetchApi;
  }

  async getAllRatings(): Promise<EntityRatingsData[]> {
    const baseUrl = await this.discoveryApi.getBaseUrl('entity-feedback');
    const resp = await this.fetchApi.fetch(`${baseUrl}/ratings`, {
      method: 'GET',
    });

    if (!resp.ok) {
      throw await ResponseError.fromResponse(resp);
    }

    return resp.json();
  }

  async getOwnedRatings(ownerRef: string): Promise<EntityRatingsData[]> {
    const baseUrl = await this.discoveryApi.getBaseUrl('entity-feedback');
    const resp = await this.fetchApi.fetch(
      `${baseUrl}/ratings?ownerRef=${encodeURIComponent(ownerRef)}`,
      {
        method: 'GET',
      },
    );

    if (!resp.ok) {
      throw await ResponseError.fromResponse(resp);
    }

    return resp.json();
  }

  async recordRating(entityRef: string, rating: string) {
    const baseUrl = await this.discoveryApi.getBaseUrl('entity-feedback');
    const resp = await this.fetchApi.fetch(
      `${baseUrl}/ratings/${encodeURIComponent(entityRef)}`,
      {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({ rating }),
      },
    );

    if (!resp.ok) {
      throw await ResponseError.fromResponse(resp);
    }
  }

  async getRatings(entityRef: string): Promise<Omit<Rating, 'entityRef'>[]> {
    const baseUrl = await this.discoveryApi.getBaseUrl('entity-feedback');
    const resp = await this.fetchApi.fetch(
      `${baseUrl}/ratings/${encodeURIComponent(entityRef)}`,
      {
        method: 'GET',
      },
    );

    if (!resp.ok) {
      throw await ResponseError.fromResponse(resp);
    }

    return resp.json();
  }

  async recordResponse(
    entityRef: string,
    response: Omit<FeedbackResponse, 'entityRef' | 'userRef'>,
  ) {
    const baseUrl = await this.discoveryApi.getBaseUrl('entity-feedback');
    const resp = await this.fetchApi.fetch(
      `${baseUrl}/responses/${encodeURIComponent(entityRef)}`,
      {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(response),
      },
    );

    if (!resp.ok) {
      throw await ResponseError.fromResponse(resp);
    }
  }

  async getResponses(
    entityRef: string,
  ): Promise<Omit<FeedbackResponse, 'entityRef'>[]> {
    const baseUrl = await this.discoveryApi.getBaseUrl('entity-feedback');
    const resp = await this.fetchApi.fetch(
      `${baseUrl}/responses/${encodeURIComponent(entityRef)}`,
      {
        method: 'GET',
      },
    );

    if (!resp.ok) {
      throw await ResponseError.fromResponse(resp);
    }

    return resp.json();
  }
}
