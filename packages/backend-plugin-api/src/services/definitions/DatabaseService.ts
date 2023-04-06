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

import { Knex } from 'knex';

/**
 * The DatabaseService manages access to databases that Plugins get.
 *
 * @public
 */
export interface DatabaseService {
  /**
   * getClient provides backend plugins database connections for itself.
   *
   * The purpose of this method is to allow plugins to get isolated data
   * stores so that plugins are discouraged from database integration.
   */
  getClient(): Promise<Knex>;

  /**
   * This property is used to control the behavior of database migrations.
   */
  migrations?: {
    /**
     * skip database migrations. Useful if connecting to a read-only database.
     *
     * @defaultValue false
     */
    skip?: boolean;
  };
}
