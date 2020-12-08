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
  /**
   * The type of integration, e.g. "github".
   */
  type: string;

  /**
   * A human readable title for the integration, that can be shown to users to
   * differentiate between different integrations.
   */
  title: string;
};

/**
 * Holds all registered SCM integrations.
 */
export type ScmIntegrationRegistry = {
  /**
   * Lists all registered integrations.
   */
  list(): ScmIntegration[];

  /**
   * Fetches an integration by URL.
   *
   * @param url A URL that matches a registered integration
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
