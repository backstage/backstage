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
  ApiBlueprint,
  createApiFactory,
  createExtensionInput,
} from '@backstage/frontend-plugin-api';
import { ScaffolderFormDecoratorsApi } from './types';
import { ScaffolderFormDecorator } from '@backstage/plugin-scaffolder-react/alpha';
import { formDecoratorsApiRef } from './ref';

/** @alpha */
export class DefaultScaffolderFormDecoratorsApi
  implements ScaffolderFormDecoratorsApi
{
  private constructor(
    private readonly options: {
      decorators: Array<ScaffolderFormDecorator>;
    },
  ) {}

  static create(options?: { decorators: ScaffolderFormDecorator[] }) {
    return new DefaultScaffolderFormDecoratorsApi(
      options ?? { decorators: [] },
    );
  }

  async getFormDecorators(): Promise<ScaffolderFormDecorator[]> {
    return this.options.decorators;
  }
}

/** @alpha */
export const formDecoratorsApi = ApiBlueprint.makeWithOverrides({
  name: 'form-decorators',
  inputs: {
    // TODO: this should come from the inputs that the form decorators use
    formDecorators: createExtensionInput([]),
  },
  factory(originalFactory, { inputs }) {
    // TODO: this should come from the inputs that the form decorators use
    const formDecorators =
      inputs.formDecorators as unknown as ScaffolderFormDecorator[];

    return originalFactory({
      factory: createApiFactory({
        api: formDecoratorsApiRef,
        deps: {},
        factory: () =>
          DefaultScaffolderFormDecoratorsApi.create({
            decorators: formDecorators,
          }),
      }),
    });
  },
});
