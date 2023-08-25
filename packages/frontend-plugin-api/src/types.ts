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

import { AnyApiFactory } from '@backstage/core-plugin-api';
import { ComponentType } from 'react';
import { PortableSchema } from './createSchemaFromZod';

/** @public */
export type ExtensionDataRef<T> = {
  id: string;
  T: T;
  $$type: 'extension-data';
};

/** @public */
export function createExtensionDataRef<T>(id: string): ExtensionDataRef<T> {
  return { id, $$type: 'extension-data' } as ExtensionDataRef<T>;
}

/** @public */
export const coreExtensionData = {
  reactComponent: createExtensionDataRef<ComponentType>('core.reactComponent'),
  apiFactory: createExtensionDataRef<AnyApiFactory>('core.apiFactory'),
  routePath: createExtensionDataRef<string>('core.routing.path'),
};

/** @public */
export type AnyExtensionDataMap = Record<string, ExtensionDataRef<any>>;

/** @public */
export type ExtensionDataBind<TData extends AnyExtensionDataMap> = {
  [K in keyof TData]: (value: TData[K]['T']) => void;
};

/** @public */
export type ExtensionDataValue<TData extends AnyExtensionDataMap> = {
  [K in keyof TData]: TData[K]['T'];
};

/** @public */
export interface CreateExtensionOptions<
  TData extends AnyExtensionDataMap,
  TPoint extends Record<string, { extensionData: AnyExtensionDataMap }>,
  TConfig,
> {
  defaultInstanceParameters?: Omit<ExtensionInstanceParameters, 'extension'>;
  inputs?: TPoint;
  output: TData;
  configSchema?: PortableSchema<TConfig>;
  factory(options: {
    bind: ExtensionDataBind<TData>;
    config: TConfig;
    inputs: {
      [pointName in keyof TPoint]: ExtensionDataValue<
        TPoint[pointName]['extensionData']
      >[];
    };
  }): void;
}

/** @public */
export interface Extension<TConfig> {
  $$type: 'extension';
  // TODO: will extensions have a default "at" as part of their contract, making it optional in the instance config?
  defaultInstanceParameters?: Omit<ExtensionInstanceParameters, 'extension'>;
  inputs: Record<string, { extensionData: AnyExtensionDataMap }>;
  output: AnyExtensionDataMap;
  configSchema?: PortableSchema<TConfig>;
  factory(options: {
    bind: ExtensionDataBind<AnyExtensionDataMap>;
    config: TConfig;
    inputs: Record<string, Array<Record<string, unknown>>>;
  }): void;
}

/** @public */
export function createExtension<
  TData extends AnyExtensionDataMap,
  TPoint extends Record<string, { extensionData: AnyExtensionDataMap }>,
  TConfig = never,
>(options: CreateExtensionOptions<TData, TPoint, TConfig>): Extension<TConfig> {
  return { ...options, $$type: 'extension', inputs: options.inputs ?? {} };
}

/** @public */
export interface ExtensionInstanceParameters {
  id: string;
  at: string;
  extension: Extension<unknown>;
  config?: unknown;
  disabled?: boolean;
}

/** @public */
export interface BackstagePluginOptions {
  id: string;
  defaultExtensionInstances?: ExtensionInstanceParameters[];
}

/** @public */
export interface BackstagePlugin {
  $$type: 'backstage-plugin';
  id: string;
  defaultExtensionInstances: ExtensionInstanceParameters[];
}

/** @public */
export function createPlugin(options: BackstagePluginOptions): BackstagePlugin {
  return {
    ...options,
    $$type: 'backstage-plugin',
    defaultExtensionInstances: options.defaultExtensionInstances ?? [],
  };
}
