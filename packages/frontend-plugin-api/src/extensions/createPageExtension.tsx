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

import React from 'react';
import { createSchemaFromZod, PortableSchema } from '../createSchemaFromZod';
import {
  AnyExtensionDataMap,
  coreExtensionData,
  createExtension,
  Extension,
  ExtensionDataValue,
} from '../types';

/**
 * Helper for creating extensions for a routable React page component.
 *
 * @public
 */
export function createPageExtension<
  TConfig extends { path: string },
  TInputs extends Record<string, { extensionData: AnyExtensionDataMap }>,
>(
  options: (
    | {
        defaultPath: string;
      }
    | {
        configSchema: PortableSchema<TConfig>;
      }
  ) & {
    id: string;
    at?: string;
    disabled?: boolean;
    inputs?: TInputs;
    component: (props: {
      config: TConfig;
      inputs: {
        [pointName in keyof TInputs]: ExtensionDataValue<
          TInputs[pointName]['extensionData']
        >[];
      };
    }) => Promise<JSX.Element>;
  },
): Extension<TConfig> {
  const configSchema =
    'configSchema' in options
      ? options.configSchema
      : (createSchemaFromZod(z =>
          z.object({ path: z.string().default(options.defaultPath) }),
        ) as PortableSchema<TConfig>);

  return createExtension({
    id: options.id,
    at: options.at ?? 'core.router/routes',
    disabled: options.disabled,
    output: {
      component: coreExtensionData.reactComponent,
      path: coreExtensionData.routePath,
    },
    inputs: options.inputs,
    configSchema,
    factory({ bind, config, inputs }) {
      const LazyComponent = React.lazy(() =>
        options
          .component({ config, inputs })
          .then(element => ({ default: () => element })),
      );
      bind.path(config.path);
      bind.component(() => (
        <React.Suspense fallback="...">
          <LazyComponent />
        </React.Suspense>
      ));
    },
  });
}
