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
  ApiHolder,
  AppNode,
  ExtensionDefinitionAttachTo,
  ExtensionDataValue,
  ExtensionDataRef,
  OverridableExtensionDefinition,
  ExtensionDefinitionParameters,
  ExtensionInput,
  PortableSchema,
  ResolvedExtensionInputs,
} from '@backstage/frontend-plugin-api';
import { OpaqueType } from '@internal/opaque';

export const OpaqueExtensionDefinition = OpaqueType.create<{
  public: OverridableExtensionDefinition<ExtensionDefinitionParameters>;
  versions:
    | {
        readonly version: 'v1';
        readonly kind?: string;
        readonly namespace?: string;
        readonly name?: string;
        readonly attachTo: ExtensionDefinitionAttachTo;
        readonly disabled: boolean;
        readonly enabled?: (
          originalDecision: () => Promise<boolean>,
          context: { apiHolder: ApiHolder },
        ) => Promise<boolean>;
        readonly configSchema?: PortableSchema<any, any>;
        readonly inputs: {
          [inputName in string]: {
            $$type: '@backstage/ExtensionInput';
            extensionData: {
              [name in string]: ExtensionDataRef;
            };
            config: { optional: boolean; singleton: boolean };
          };
        };
        readonly output: {
          [name in string]: ExtensionDataRef;
        };
        factory(context: {
          node: AppNode;
          apis: ApiHolder;
          config: object;
          inputs: {
            [inputName in string]: unknown;
          };
        }): {
          [inputName in string]: unknown;
        };
      }
    | {
        readonly version: 'v2';
        readonly kind?: string;
        readonly namespace?: string;
        readonly name?: string;
        readonly attachTo: ExtensionDefinitionAttachTo;
        readonly disabled: boolean;
        readonly enabled?: (
          originalDecision: () => Promise<boolean>,
          context: { apiHolder: ApiHolder },
        ) => Promise<boolean>;
        readonly configSchema?: PortableSchema<any, any>;
        readonly inputs: { [inputName in string]: ExtensionInput };
        readonly output: Array<ExtensionDataRef>;
        factory(context: {
          node: AppNode;
          apis: ApiHolder;
          config: object;
          inputs: ResolvedExtensionInputs<{
            [inputName in string]: ExtensionInput;
          }>;
        }): Iterable<ExtensionDataValue<any, any>>;
      };
}>({
  type: '@backstage/ExtensionDefinition',
  versions: ['v1', 'v2'],
});
