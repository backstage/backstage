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

import { ReadTreeResponseFile } from '@backstage/backend-common';
import {
  PluginTaskScheduler,
  TaskScheduleDefinition,
} from '@backstage/backend-tasks';
import { Entity } from '@backstage/catalog-model';
import { Logger } from 'winston';

/**
 * A valid package.json file for a Backstage plugin.
 *
 * @public
 */
export type BackstagePackageJson = {
  name: string;
  version: string;
  backstage: {
    role: string;
  };
  catalogInfo?: Partial<Entity>;
  description?: string;
  private?: boolean;
  keywords?: string[];
  homepage?: string;
  bugs?: {
    url?: string;
    email?: string;
  };
  license?: string;
  author?: string | { name: string; email?: string; url?: string };
  contributors?: string[] | { name: string; email?: string; url?: string }[];
  funding?:
    | string
    | string[]
    | { type: string; url: string }
    | { type: string; url: string }[];
  files?: string[];
  main?: string;
  types?: string;
  repository?: string | { type: string; url: string; directory?: string };
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  engines?: Record<string, string>;
  os?: string[];
  cpu?: string[];
};

/**
 * Data that the `BackstagePluginsEntityTransformer` function can use to
 * customize or omit the given Backstage plugin component.
 *
 * @public
 */
export type BackstagePluginsProviderTransformOptions = {
  /**
   * The Backstage plugin component that is being transformed.
   */
  entity: Entity;

  /**
   * Object representing metadata about the package.json file from which the
   * given entity was inferred (e.g. file path and modified date).
   */
  readTreeResponse: ReadTreeResponseFile;

  /**
   * Object representing the contents of the package.json file itself.
   */
  packageJson: BackstagePackageJson;
};

/**
 * A function that can customize entities introspected from package.json files
 * that represent Backstage plugins. Returning `undefined` will prevent the
 * given entity from being provided to the catalog.
 *
 * @public
 */
export type BackstagePluginsEntityTransformer = (
  options: BackstagePluginsProviderTransformOptions,
) => Entity | undefined;

/**
 * Options that can always be supplied when instantiating a
 * `BackstagePluginsProvider`.
 *
 * @public
 */
export type BackstagePluginsProviderOptions = {
  /**
   * A URL pointing to a Backstage monorepo on a source control management
   * system.
   *
   * @example https://github.com/backstage/backstage/tree/master
   */
  location: string;

  /**
   * Used as the default `spec.owner` when no owner could be resolved from a
   * `CODEOWNERS` file or from the `catalogInfo` key in the corresponding
   * package.json file.
   */
  defaultOwner: string;

  /**
   * Function applied to every derived entity, suitable for customization of
   * the underlying entity, or for omitting the entity entirely.
   */
  transformer?: BackstagePluginsEntityTransformer;

  /**
   * Task scheduler from the plugin environment.
   */
  scheduler: PluginTaskScheduler;

  /**
   * Defines when and how frequently the provider should be refreshed.
   */
  scheduleDefinition: TaskScheduleDefinition;

  logger: Logger;
};
