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

import type { Octokit } from 'octokit';

import { Entity } from '@backstage/catalog-model';

import { OwnerRepo } from '../utils/types';

export type OctokitWithOwnerRepo = { octokit: Octokit } & OwnerRepo;

export type GithubOctokitApi = {
  /**
   * Get an Octokit instance given the hostname to GitHub (or an enterprise
   * GitHub installation)
   *
   * Specify which scopes you need access to (e.g. ['repo'])..
   */
  getOctokit(hostname: string | URL, scopes: string[]): Promise<Octokit>;

  /**
   * Get an Octokit instance given an entity's source url.
   *
   * Specify which scopes you need access to (e.g. ['repo'])..
   *
   * Also returns the {owner/repo} parts of the entity source url.
   */
  getOctokitForEntity(
    entity: Entity,
    scopes: string[],
  ): Promise<OctokitWithOwnerRepo>;
};
