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

import {
  ServiceRef,
  ServiceRefOptions,
  RootServiceFactoryOptions,
  PluginServiceFactoryOptions,
} from './services';

/**
 * @public
 * @deprecated Use {@link ServiceRefOptions} instead
 */
export type ServiceRefConfig<
  TService,
  TScope extends 'root' | 'plugin',
> = ServiceRefOptions<TService, TScope>;

/**
 * @public
 * @deprecated Use {@link RootServiceFactoryOptions} instead
 */
export type RootServiceFactoryConfig<
  TService,
  TImpl extends TService,
  TDeps extends { [name in string]: ServiceRef<unknown> },
> = RootServiceFactoryOptions<TService, TImpl, TDeps>;

/**
 * @public
 * @deprecated Use {@link PluginServiceFactoryOptions} instead
 */
export type PluginServiceFactoryConfig<
  TService,
  TContext,
  TImpl extends TService,
  TDeps extends { [name in string]: ServiceRef<unknown> },
> = PluginServiceFactoryOptions<TService, TContext, TImpl, TDeps>;
