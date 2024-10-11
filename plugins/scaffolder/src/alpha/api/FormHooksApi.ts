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

import { ScaffolderFormHooksApi } from './types';
import { ScaffolderFormHook } from '@backstage/plugin-scaffolder-react/alpha';

export class DefaultScaffolderFormHooksApi implements ScaffolderFormHooksApi {
  constructor(
    private readonly options: {
      hooks: Array<ScaffolderFormHook>;
    },
  ) {}

  static create(options: { hooks: ScaffolderFormHook[] }) {
    return new DefaultScaffolderFormHooksApi(options);
  }

  async getFormHooks(): Promise<ScaffolderFormHook[]> {
    return this.options.hooks;
  }
}
