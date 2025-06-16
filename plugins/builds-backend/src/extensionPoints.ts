/*
 * Copyright 2025 The Backstage Authors
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

import { createExtensionPoint } from '@backstage/backend-plugin-api';
import { Entity } from '@backstage/catalog-model';

/**
 * Interface for a build step.
 * This represents a single step in a build stage, such as running tests or building artifacts.
 * @public
 */
export interface Step {
  name: string;
  status: 'queued' | 'running' | 'success' | 'failed' | 'cancelled' | 'skipped';
  startTime?: Date;
  endTime?: Date;
}

/**
 * Interface for a build stage.
 * A stage is a collection of steps that are executed together, such as "build" or "test".
 * @public
 */
export interface Stage {
  name: string;
  status: 'queued' | 'running' | 'success' | 'failed' | 'cancelled' | 'skipped';
  steps: Step[];
  startTime?: Date;
  endTime?: Date;
}

/**
 * Interface for a build entry.
 * This represents a single build of an entity, including its status, start and end times,
 * associated commit information, and the stages it contains.
 * @public
 */
export interface Build {
  providerId: string; // ID of the provider that created this build
  id: string;
  name: string;
  status: 'queued' | 'running' | 'success' | 'failed' | 'cancelled' | 'skipped';
  startTime?: Date;
  endTime?: Date;
  fileUrl?: string;
  commitBranch?: string;
  commitHash?: string;
  commitUrl?: string;
  commitPullRequest?: string;
  commitAuthor?: string;
  stages: Stage[];
}

/**
 * Interface for a builds provider that can fetch builds and logs for an entity.
 * It should be implemented by plugin modules that provide build information for entities.
 * @public
 */
export interface BuildsProvider {
  id: string;
  isProviderForEntity(entity: Entity): boolean;
  getEntityBuilds: (entity: Entity) => Promise<Build[]>;
  getEntityBuildDetails: (entity: Entity, buildId: string) => Promise<Build>;
  getEntityBuildLogs: (entity: Entity, buildId: string) => Promise<string>;
  retriggerEntityBuild: (entity: Entity, buildId: string) => Promise<Build>;
}

/** @public */
export interface BuildsProviderExtensionPoint {
  addBuildsProvider(provider: BuildsProvider): void;
}

/** @public */
export const buildsProviderExtensionPoint =
  createExtensionPoint<BuildsProviderExtensionPoint>({
    id: 'builds.provider',
  });
