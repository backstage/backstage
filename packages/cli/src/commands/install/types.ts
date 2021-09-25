/*
 * Copyright 2021 The Backstage Authors
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

import { YarnInfoInspectData } from '../../lib/versioning';
import { JsonObject } from '@backstage/config';

/**
 * TODO: possible types
 *
 * frontend-deps: Install one or many frontend packages in a Backstage app
 * backend-deps: Install one or many backend packages in a Backstage app
 * app-config: Update app-config.yaml (and ask for inputs). E.g. Use local or docker for techdocs.builder
 * frontend-route: Add a frontend route to the plugin homepage
 * backend-route: Add a backend route to the plugin
 * entity-page-tab: Add a tab on Catalog’s entity page
 * sidebar-item: Add a sidebar item
 * frontend-api: Add a custom API
 */

/** A serialized install step as it appears in JSON */
export type SerializedStep = {
  type: string;
} & unknown;

export type InstallationRecipe = {
  type?: 'frontend' | 'backend';
  steps: SerializedStep[];
};

/** package.json data */
export type PackageWithInstallRecipe = YarnInfoInspectData & {
  version: string;
  installationRecipe?: InstallationRecipe;
};

export interface Step {
  run(): Promise<void>;
}

export interface StepDefinition<Options> {
  /** The string identifying this type of step */
  type: string;

  /** Deserializes and validate a JSON description of the step data */
  deserialize(obj: JsonObject, pkg: PackageWithInstallRecipe): Step;

  /** Creates a step using known parameters */
  create(options: Options): Step;
}

/** Creates a new step definition. Only used as a helper for type inference */
export function createStepDefinition<T>(
  config: StepDefinition<T>,
): StepDefinition<T> {
  return config;
}
