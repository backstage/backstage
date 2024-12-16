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
import { OpaqueType } from '@internal/opaque';
import { z } from 'zod';

import {
  ScaffolderFormDecorator,
  ScaffolderFormDecoratorContext,
} from '@backstage/plugin-scaffolder-react/alpha';
import { AnyApiRef } from '@backstage/frontend-plugin-api';

/** @alpha */
export const OpaqueFormDecorator = OpaqueType.create<{
  public: ScaffolderFormDecorator;
  versions: {
    readonly version: 'v1';
    readonly id: string;
    readonly schema?: {
      input?: {
        [key in string]: (zImpl: typeof z) => z.ZodType;
      };
    };
    readonly deps?: { [key in string]: AnyApiRef };
    readonly decorator: (
      ctx: ScaffolderFormDecoratorContext,
      deps: { [depName in string]: AnyApiRef['T'] },
    ) => Promise<void>;
  };
}>({ type: '@backstage/scaffolder/FormDecorator', versions: ['v1'] });
