/*
 * Copyright 2020 The Backstage Authors
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

import { ServiceBuilderImpl } from './lib/ServiceBuilderImpl';
import { ServiceBuilder } from './types';

/**
 * Creates a new service builder.
 * @public
 * @deprecated We are going to deprecated this old way of creating services in a near future, if you are using this service helper, please checkout the {@link https://backstage.io/docs/backend-system/building-backends/migrating | backend} and {@link https://backstage.io/docs/backend-system/building-plugins-and-modules/migrating | plugin} migration guides.
 */
export function createServiceBuilder(_module: NodeModule): ServiceBuilder {
  return new ServiceBuilderImpl(_module);
}
