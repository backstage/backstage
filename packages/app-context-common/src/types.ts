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

import { interfaces } from 'inversify';

export type BoundPluginOptions<T> = {
  id: string;
  initialize: (ctx: ApplicationContext) => T;
  dependencies: AnyDependencyConfig[];
};

export interface BoundPlugin<T> {
  name: string;
  instance: T;
  getDependencies(): Dependency<unknown>[];
}

export interface ApplicationContext {
  getContainer(): interfaces.Container;
  get<T>(dep: Dependency<T>): T;
}

export type TypesToIocDependencies<T> = {
  [key in keyof T]: Dependency<T[key]>;
};

export type Dependency<T> = {
  id: symbol;
  T: T;
};

export type DependencyConfig<
  Dep,
  Deps extends { [name in string]: unknown },
> = {
  id: Dependency<Dep>;
  dependencies?: TypesToIocDependencies<Deps>;
  factory(deps: Deps): Dep;
};

export type AnyDependencyConfig = DependencyConfig<
  unknown,
  { [key in string]: unknown }
>;
