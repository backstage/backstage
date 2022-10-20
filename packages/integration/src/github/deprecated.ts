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

import {
  GithubIntegrationConfig,
  readGithubIntegrationConfig,
  readGithubIntegrationConfigs,
} from './config';
import { getGithubFileFetchUrl } from './core';
import { GithubIntegration, replaceGithubUrlType } from './GithubIntegration';
import { ScmIntegrationsFactory } from '../types';

/**
 * @public
 * @deprecated Use {@link getGithubFileFetchUrl} instead.
 */
export const getGitHubFileFetchUrl = getGithubFileFetchUrl;

/**
 * @public
 * @deprecated Use {@link GithubIntegrationConfig} instead.
 */
export type GitHubIntegrationConfig = GithubIntegrationConfig;

/**
 * @public
 * @deprecated Use {@link GithubIntegration} instead.
 */
export class GitHubIntegration extends GithubIntegration {
  static factory: ScmIntegrationsFactory<GitHubIntegration> =
    GithubIntegration.factory;

  constructor(integrationConfig: GitHubIntegrationConfig) {
    super(integrationConfig as GithubIntegrationConfig);
  }

  get config(): GitHubIntegrationConfig {
    return super.config as GitHubIntegrationConfig;
  }
}

/**
 * @public
 * @deprecated Use {@link readGithubIntegrationConfig} instead.
 */
export const readGitHubIntegrationConfig = readGithubIntegrationConfig;

/**
 * @public
 * @deprecated Use {@link readGithubIntegrationConfigs} instead.
 */
export const readGitHubIntegrationConfigs = readGithubIntegrationConfigs;

/**
 * @public
 * @deprecated Use {@link replaceGithubUrlType} instead.
 */
export const replaceGitHubUrlType = replaceGithubUrlType;
