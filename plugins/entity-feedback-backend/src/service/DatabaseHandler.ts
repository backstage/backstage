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

import { resolvePackagePath } from '@backstage/backend-common';
import {
  AppRating,
  FeedbackResponse,
  Rating,
} from '@backstage/plugin-entity-feedback-common';
import { Knex } from 'knex';

const migrationsDir = resolvePackagePath(
  '@backstage/plugin-entity-feedback-backend',
  'migrations',
);

type RatingsAggregatesResult = {
  entityRef: string;
  rating: string;
  count: number;
}[];

type Options = {
  database: Knex;
};

/**
 * @public
 */
export class DatabaseHandler {
  static async create(options: Options): Promise<DatabaseHandler> {
    const { database } = options;

    await database.migrate.latest({
      directory: migrationsDir,
    });

    return new DatabaseHandler(options);
  }

  private readonly database: Knex;

  private constructor(options: Options) {
    this.database = options.database;
  }

  async getAllRatedEntities(): Promise<string[]> {
    return (await this.database('ratings').distinct('entity_ref')).map(
      ({ entity_ref }) => entity_ref,
    );
  }

  async getRatingsAggregates(
    entityRefs: string[],
  ): Promise<RatingsAggregatesResult> {
    return (
      await this.database('ratings')
        .whereIn('ratings.entity_ref', entityRefs)
        .innerJoin(
          this.database('ratings')
            .as('latest_ratings')
            .select('entity_ref', 'user_ref')
            .max('timestamp', { as: 'timestamp' })
            .whereIn('entity_ref', entityRefs)
            .groupBy('entity_ref', 'user_ref'),
          function joinClause() {
            this.on('ratings.entity_ref', '=', 'latest_ratings.entity_ref')
              .andOn('ratings.user_ref', '=', 'latest_ratings.user_ref')
              .andOn('ratings.timestamp', '=', 'latest_ratings.timestamp');
          },
        )
        .select('ratings.entity_ref', 'rating')
        .count('ratings.user_ref as count')
        .groupBy('ratings.entity_ref', 'rating')
    ).map(({ entity_ref, rating, count }) => ({
      entityRef: entity_ref as string,
      rating: rating as string,
      count: Number(count),
    }));
  }

  async recordRating(rating: Rating) {
    await this.database('ratings').insert({
      entity_ref: rating.entityRef,
      rating: rating.rating,
      user_ref: rating.userRef,
    });
  }

  async getRatings(entityRef: string): Promise<Omit<Rating, 'entityRef'>[]> {
    return (
      await this.database('ratings')
        .where('entity_ref', entityRef)
        .innerJoin(
          this.database('ratings')
            .as('latest_ratings')
            .select('user_ref')
            .max('timestamp', { as: 'timestamp' })
            .where('entity_ref', entityRef)
            .groupBy('user_ref'),
          function joinClause() {
            this.on('ratings.user_ref', '=', 'latest_ratings.user_ref').andOn(
              'ratings.timestamp',
              '=',
              'latest_ratings.timestamp',
            );
          },
        )
        .select('ratings.user_ref', 'rating')
    ).map(rating => ({ userRef: rating.user_ref, rating: rating.rating }));
  }

  async recordResponse(response: FeedbackResponse) {
    await this.database('responses').insert({
      entity_ref: response.entityRef,
      response: response.response,
      comments: response.comments,
      consent: response.consent,
      user_ref: response.userRef,
    });
  }

  async getResponses(
    entityRef: string,
  ): Promise<Omit<FeedbackResponse, 'entityRef'>[]> {
    return (
      await this.database('responses')
        .where('entity_ref', entityRef)
        .innerJoin(
          this.database('responses')
            .as('latest_responses')
            .select('user_ref')
            .max('timestamp', { as: 'timestamp' })
            .where('entity_ref', entityRef)
            .groupBy('user_ref'),
          function joinClause() {
            this.on(
              'responses.user_ref',
              '=',
              'latest_responses.user_ref',
            ).andOn('responses.timestamp', '=', 'latest_responses.timestamp');
          },
        )
        .select('responses.user_ref', 'response', 'comments', 'consent')
    ).map(response => ({
      userRef: response.user_ref,
      response: response.response,
      comments: response.comments,
      consent: Boolean(response.consent),
    }));
  }

  async getAppRatings(): Promise<AppRating[]> {
    return (
      await this.database('app_ratings').select('rating').select('user_ref')
    ).map(({ rating, user_ref }) => ({
      rating: Number(rating),
      userRef: user_ref,
    }));
  }

  async recordAppRating(rating: AppRating) {
    await this.database('app_ratings').insert({
      rating: rating.rating,
      user_ref: rating.userRef,
    });
  }
}
