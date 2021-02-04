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
import { AzureIntegration } from './azure/AzureIntegration';
import { BitbucketIntegration } from './bitbucket/BitbucketIntegration';
import { GitHubIntegration } from './github/GitHubIntegration';
import { GitLabIntegration } from './gitlab/GitLabIntegration';

/**
 * Encapsulates a single SCM integration.
 */
export interface ScmIntegration {
  /**
   * The type of integration, e.g. "github".
   */
  type: string;

  /**
   * A human readable title for the integration, that can be shown to users to
   * differentiate between different integrations.
   */
  title: string;

  /**
   * Works like the two-argument form of the URL constructor, resolving an
   * absolute or relative URL in relation to a base URL.
   *
   * If this method is not implemented, the URL constructor is used instead for
   * URLs that match this integration.
   *
   * @param options.url The (absolute or relative) URL or path to resolve
   * @param options.base The base URL onto which this resolution happens
   */
  resolveUrl?(options: { url: string; base: string }): string;
}

/**
 * Encapsulates several integrations, that are all of the same type.
 */
export interface ScmIntegrationsGroup<T extends ScmIntegration> {
  /**
   * Lists all registered integrations of this type.
   */
  list(): T[];

  /**
   * Fetches an integration of this type by URL.
   *
   * @param url A URL that matches a registered integration of this type
   */
  byUrl(url: string | URL): T | undefined;

  /**
   * Fetches an integration of this type by host name.
   *
   * @param url A host name that matches a registered integration of this type
   */
  byHost(host: string): T | undefined;
}

/**
 * Holds all registered SCM integrations, of all types.
 */
export interface ScmIntegrationRegistry
  extends ScmIntegrationsGroup<ScmIntegration> {
  azure: ScmIntegrationsGroup<AzureIntegration>;
  bitbucket: ScmIntegrationsGroup<BitbucketIntegration>;
  github: ScmIntegrationsGroup<GitHubIntegration>;
  gitlab: ScmIntegrationsGroup<GitLabIntegration>;

  /**
   * Works like the two-argument form of the URL constructor, resolving an
   * absolute or relative URL in relation to a base URL.
   *
   * @param options.url The (absolute or relative) URL or path to resolve
   * @param options.base The base URL onto which this resolution happens
   */
  resolveUrl(options: { url: string; base: string }): string;
}

export type ScmIntegrationsFactory<T extends ScmIntegration> = (options: {
  config: Config;
}) => ScmIntegrationsGroup<T>;
