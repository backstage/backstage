/*
 * Copyright 2024 The Backstage Authors
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
import { CommandRegistry } from './CommandRegistry';

export interface BackstageCommand {
  path: string[];
  description: string;
  execute: (options: { args: string[] }) => Promise<void>;
}

export interface CliFeature {
  $$type: '@backstage/CliFeature';
}

export interface CliPlugin {
  id: string;
  init: (registry: CommandRegistry) => Promise<void>;
  $$type: '@backstage/CliFeature';
}

/**
 * @public
 */
export interface InternalCliPlugin extends CliFeature {
  version: 'v1';
  featureType: 'plugin';
  description: string;
  id: string;
  init: (registry: CommandRegistry) => Promise<void>;
}

/** @internal */
export type InternalCliFeature = InternalCliPlugin;
