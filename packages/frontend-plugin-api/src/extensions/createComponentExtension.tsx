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

import React, { lazy } from 'react';
import {
  AnyExtensionInputMap,
  ExtensionInputValues,
  coreExtensionData,
  createExtension,
} from '../wiring';
import {
  Expand,
  CoreProgressComponent,
  CoreBootErrorPageComponent,
  CoreNotFoundErrorPageComponent,
  CoreErrorBoundaryFallbackComponent,
} from '../types';
import { PortableSchema } from '../schema';
import { ExtensionError, ExtensionBoundary } from '../components';

/** @public */
export function createProgressExtension<
  TConfig extends {},
  TInputs extends AnyExtensionInputMap,
>(options: {
  disabled?: boolean;
  inputs?: TInputs;
  configSchema?: PortableSchema<TConfig>;
  component: (options: {
    config: TConfig;
    inputs: Expand<ExtensionInputValues<TInputs>>;
  }) => Promise<CoreProgressComponent>;
}) {
  const id = 'core.components.progress';
  return createExtension({
    id,
    attachTo: { id: 'core.components', input: 'progress' },
    inputs: options.inputs,
    disabled: options.disabled,
    configSchema: options.configSchema,
    output: {
      component: coreExtensionData.components.progress,
    },
    factory({ bind, config, inputs, source }) {
      const ExtensionComponent = lazy(() =>
        options
          .component({ config, inputs })
          .then(component => ({ default: component }))
          .catch(error => ({
            default: () => <ExtensionError error={error} />,
          })),
      );

      bind({
        component: props => (
          <ExtensionBoundary id={id} source={source}>
            <ExtensionComponent {...props} />
          </ExtensionBoundary>
        ),
      });
    },
  });
}

/** @public */
export function createBootErrorPageExtension<
  TConfig extends {},
  TInputs extends AnyExtensionInputMap,
>(options: {
  disabled?: boolean;
  inputs?: TInputs;
  configSchema?: PortableSchema<TConfig>;
  component: (options: {
    config: TConfig;
    inputs: Expand<ExtensionInputValues<TInputs>>;
  }) => Promise<CoreBootErrorPageComponent>;
}) {
  const id = 'core.components.bootErrorPage';
  return createExtension({
    id,
    attachTo: { id: 'core.components', input: 'bootErrorPage' },
    inputs: options.inputs,
    disabled: options.disabled,
    configSchema: options.configSchema,
    output: {
      component: coreExtensionData.components.bootErrorPage,
    },
    factory({ bind, config, inputs, source }) {
      const ExtensionComponent = lazy(() =>
        options
          .component({ config, inputs })
          .then(component => ({ default: component }))
          .catch(error => ({
            default: () => <ExtensionError error={error} />,
          })),
      );

      bind({
        component: props => (
          <ExtensionBoundary id={id} source={source}>
            <ExtensionComponent {...props} />
          </ExtensionBoundary>
        ),
      });
    },
  });
}

/** @public */
export function createNotFoundErrorPageExtension<
  TConfig extends {},
  TInputs extends AnyExtensionInputMap,
>(options: {
  disabled?: boolean;
  inputs?: TInputs;
  configSchema?: PortableSchema<TConfig>;
  component: (options: {
    config: TConfig;
    inputs: Expand<ExtensionInputValues<TInputs>>;
  }) => Promise<CoreNotFoundErrorPageComponent>;
}) {
  const id = 'core.components.notFoundErrorPage';
  return createExtension({
    id,
    attachTo: { id: 'core.components', input: 'notFoundErrorPage' },
    inputs: options.inputs,
    disabled: options.disabled,
    configSchema: options.configSchema,
    output: {
      component: coreExtensionData.components.notFoundErrorPage,
    },
    factory({ bind, config, inputs, source }) {
      const ExtensionComponent = lazy(() =>
        options
          .component({ config, inputs })
          .then(component => ({ default: component }))
          .catch(error => ({
            default: () => <ExtensionError error={error} />,
          })),
      );

      bind({
        component: props => (
          <ExtensionBoundary id={id} source={source}>
            <ExtensionComponent {...props} />
          </ExtensionBoundary>
        ),
      });
    },
  });
}

/** @public */
export function createErrorBoundaryFallbackExtension<
  TConfig extends {},
  TInputs extends AnyExtensionInputMap,
>(options: {
  disabled?: boolean;
  inputs?: TInputs;
  configSchema?: PortableSchema<TConfig>;
  component: (options: {
    config: TConfig;
    inputs: Expand<ExtensionInputValues<TInputs>>;
  }) => Promise<CoreErrorBoundaryFallbackComponent>;
}) {
  const id = 'core.components.errorBoundaryFallback';
  return createExtension({
    id,
    attachTo: { id: 'core.components', input: 'errorBoundaryFallback' },
    inputs: options.inputs,
    disabled: options.disabled,
    configSchema: options.configSchema,
    output: {
      component: coreExtensionData.components.errorBoundaryFallback,
    },
    factory({ bind, config, inputs, source }) {
      const ExtensionComponent = lazy(() =>
        options
          .component({ config, inputs })
          .then(component => ({ default: component }))
          .catch(error => ({
            default: () => <ExtensionError error={error} />,
          })),
      );

      bind({
        component: props => (
          <ExtensionBoundary id={id} source={source}>
            <ExtensionComponent {...props} />
          </ExtensionBoundary>
        ),
      });
    },
  });
}
