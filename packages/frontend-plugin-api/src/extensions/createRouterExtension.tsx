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

import React, { ComponentType, PropsWithChildren } from 'react';
import { PortableSchema } from '../schema/types';
import {
  AnyExtensionInputMap,
  ExtensionDefinition,
  ResolvedExtensionInputs,
  createExtension,
} from '../wiring/createExtension';
import { createExtensionDataRef } from '../wiring/createExtensionDataRef';
import { Expand } from '../types';

/**
 * Creates an extension that replaces the router implementation at the app root.
 * This is useful to be able to for example replace the BrowserRouter with a
 * MemoryRouter in tests, or to add additional props to a BrowserRouter.
 *
 * @public
 */
export function createRouterExtension<
  TConfig extends {},
  TInputs extends AnyExtensionInputMap,
>(options: {
  namespace?: string;
  name?: string;
  attachTo?: { id: string; input: string };
  configSchema?: PortableSchema<TConfig>;
  disabled?: boolean;
  inputs?: TInputs;
  Component: ComponentType<
    PropsWithChildren<{
      inputs: Expand<ResolvedExtensionInputs<TInputs>>;
      config: TConfig;
    }>
  >;
}): ExtensionDefinition<TConfig> {
  return createExtension({
    kind: 'app-router-component',
    namespace: options.namespace,
    name: options.name,
    attachTo: options.attachTo ?? { id: 'app/root', input: 'router' },
    configSchema: options.configSchema,
    disabled: options.disabled,
    inputs: options.inputs,
    output: {
      component: createRouterExtension.componentDataRef,
    },
    factory({ inputs, config }) {
      const Component = (props: PropsWithChildren<{}>) => {
        return (
          <options.Component inputs={inputs} config={config}>
            {props.children}
          </options.Component>
        );
      };
      return {
        component: Component,
      };
    },
  });
}

/** @public */
export namespace createRouterExtension {
  export const componentDataRef =
    createExtensionDataRef<ComponentType<PropsWithChildren<{}>>>(
      'app.router.wrapper',
    );
}
