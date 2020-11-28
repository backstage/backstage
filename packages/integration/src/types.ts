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

import { Config } from '@backstage/config';

/**
 * Encapsulates a single SCM integration.
 */
export type ScmIntegration = {
  type: string;
  name: string;
};

/**
 * Holds all registered SCM integrations.
 */
export type ScmIntegrations = {
  /**
   * Lists all registered integrations.
   */
  list(): ScmIntegration[];

  /**
   * Fetches a named integration
   *
   * @param name The name of a registered integration
   */
  byName(name: string): ScmIntegration | undefined;

  /**
   * Fetches an integration by URL
   *
   * @param name A URL that matches a registered integration
   */
  byUrl(url: string): ScmIntegration | undefined;
};

export type ScmIntegrationPredicateTuple = {
  predicate: (url: URL) => boolean;
  integration: ScmIntegration;
};

export type ScmIntegrationFactory = (options: {
  config: Config;
}) => ScmIntegrationPredicateTuple[];
