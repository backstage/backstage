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
import { ApiRef, createApiRef } from '../system';
import { Config } from '@backstage/config';

/**
 * The Config API is used to provide a mechanism to access the
 * runtime configuration of the system.
 *
 * @public
 */
export type ConfigApi = Config;

/**
 * The {@link ApiRef} of {@link ConfigApi}.
 *
 * @public
 */
export const configApiRef: ApiRef<ConfigApi> = createApiRef({
  id: 'core.config',
});
