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

import mapValues from 'lodash/mapValues';
import { ComponentType } from 'react';

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
> {
  inputs?: TPoint;
  output: TData;
  factory(options: {
    bind: ExtensionDataBind<TData>;
    config?: unknown;
    inputs: {
      [pointName in keyof TPoint]: ExtensionDataValue<
        TPoint[pointName]['extensionData']
      >[];
    };
  }): void;
}

/** @public */
export interface Extension {
  $$type: 'extension';
  inputs: Record<string, { extensionData: AnyExtensionDataMap }>;
  output: AnyExtensionDataMap;
  factory(options: {
    bind: ExtensionDataBind<AnyExtensionDataMap>;
    config?: unknown;
    inputs: Record<string, Array<Record<string, unknown>>>;
  }): void;
}

/** @public */
export function createExtension<
  TData extends AnyExtensionDataMap,
  TPoint extends Record<string, { extensionData: AnyExtensionDataMap }>,
>(options: CreateExtensionOptions<TData, TPoint>): Extension {
  return { ...options, $$type: 'extension', inputs: options.inputs ?? {} };
}

/** @public */
export type ExtensionDataId = string;

/** @public */
export interface ExtensionInstance {
  id: string;
  data: Map<ExtensionDataId, unknown>;
  $$type: 'extension-instance';
}

/** @public */
export function createExtensionInstance(options: {
  id: string;
  extension: Extension;
  config: unknown;
  attachments: Record<string, ExtensionInstance[]>;
}): ExtensionInstance {
  const { extension, config, attachments } = options;
  const extensionData = new Map<ExtensionDataId, unknown>();
  extension.factory({
    config,
    bind: mapValues(extension.output, ref => {
      return (value: unknown) => extensionData.set(ref.id, value);
    }),
    inputs: mapValues(
      extension.inputs,
      ({ extensionData: pointData }, inputName) => {
        // TODO: validation
        return (attachments[inputName] ?? []).map(attachment =>
          mapValues(pointData, ref => attachment.data.get(ref.id)),
        );
      },
    ),
  });
  return { id: options.id, data: extensionData, $$type: 'extension-instance' };
}

/** @public */
export interface ExtensionInstanceConfig {
  id: string;
  at: string;
  extension: Extension;
  config: unknown;
}

/** @public */
export interface BackstagePluginOptions {
  id: string;
  defaultExtensionInstances?: ExtensionInstanceConfig[];
}

/** @public */
export interface BackstagePlugin {
  $$type: 'backstage-plugin';
  id: string;
  defaultExtensionInstances: ExtensionInstanceConfig[];
}

/** @public */
export function createPlugin(options: BackstagePluginOptions): BackstagePlugin {
  return {
    ...options,
    $$type: 'backstage-plugin',
    defaultExtensionInstances: options.defaultExtensionInstances ?? [],
  };
}
