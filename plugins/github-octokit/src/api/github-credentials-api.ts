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

import type { GitHubIntegrationConfig } from '@backstage/integration';
import { Entity } from '@backstage/catalog-model';

import { OwnerRepo } from '../utils/types';

export type IntegrationInfo = { baseUrl: string; host: string };
export type CredentialsInfo = IntegrationInfo & { token: string };

export type GithubCredentialsApi = {
  /**
   * Get all GitHub integrations
   */
  getIntegrations(): GitHubIntegrationConfig[];

  /**
   * Get the GitHub integration that matches a certain hostname, provided as a
   * string or a URL object.
   */
  getIntegration(hostname: string | URL): IntegrationInfo;

  /**
   * Get the GitHub integration that matches the source location of an Entity.
   */
  getIntegrationForEntity(entity: Entity): IntegrationInfo & OwnerRepo;

  /**
   * Get the credentials for the GitHub integration that matches a certain
   * hostname, provided as a string or a URL object.
   */
  getCredentials(
    hostname: string | URL,
    scopes: string[],
  ): Promise<CredentialsInfo>;

  /**
   * Get the credentials for the GitHub integration that matches the source
   * location of an Entity.
   */
  getCredentialsForEntity(
    entity: Entity,
    scopes: string[],
  ): Promise<CredentialsInfo & OwnerRepo>;
};
