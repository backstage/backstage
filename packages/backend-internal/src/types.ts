/*
 * Copyright 2025 The Backstage Authors
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
  BackendFeature,
  ExtensionPoint,
  ServiceRef,
  ServiceFactory,
} from '@backstage/backend-plugin-api';
import { OpaqueType } from '@internal/opaque';

/** @internal */
export interface ExtensionPointFactoryContext {
  reportModuleStartupFailure(options: { error: Error }): void;
}

/** @internal */
export interface InternalBackendPluginRegistration {
  pluginId: string;
  type: 'plugin';
  extensionPoints: Array<readonly [ExtensionPoint<unknown>, unknown]>;
  init: {
    deps: Record<string, ServiceRef<unknown>>;
    func(deps: Record<string, unknown>): Promise<void>;
  };
}

/** @internal */
export interface InternalBackendModuleRegistration {
  pluginId: string;
  moduleId: string;
  type: 'module';
  extensionPoints: Array<readonly [ExtensionPoint<unknown>, unknown]>;
  init: {
    deps: Record<string, ServiceRef<unknown> | ExtensionPoint<unknown>>;
    func(deps: Record<string, unknown>): Promise<void>;
  };
}

/** @internal */
export type ExtensionPointRegistration = {
  extensionPoint: ExtensionPoint<unknown>;
  factory: (context: ExtensionPointFactoryContext) => unknown;
};

/** @internal */
export interface InternalBackendPluginRegistrationV1_1 {
  pluginId: string;
  type: 'plugin-v1.1';
  extensionPoints: Array<ExtensionPointRegistration>;
  init: {
    deps: Record<string, ServiceRef<unknown>>;
    func(deps: Record<string, unknown>): Promise<void>;
  };
}

/** @internal */
export interface InternalBackendModuleRegistrationV1_1 {
  pluginId: string;
  moduleId: string;
  type: 'module-v1.1';
  extensionPoints: Array<ExtensionPointRegistration>;
  init: {
    deps: Record<string, ServiceRef<unknown> | ExtensionPoint<unknown>>;
    func(deps: Record<string, unknown>): Promise<void>;
  };
}

export const OpaqueBackendFeature = OpaqueType.create<{
  public: BackendFeature;
  versions:
    | {
        version: 'v1';
        featureType: 'registrations';
        getRegistrations(): Array<
          | InternalBackendPluginRegistration
          | InternalBackendModuleRegistration
          | InternalBackendPluginRegistrationV1_1
          | InternalBackendModuleRegistrationV1_1
        >;
      }
    | {
        version: 'v1';
        featureType: 'loader';
        description: string;
        deps: Record<string, ServiceRef<unknown>>;
        loader(deps: Record<string, unknown>): Promise<BackendFeature[]>;
      }
    | {
        version: 'v1';
        featureType: 'service';
        service: ServiceRef<unknown>;
        initialization?: 'always' | 'lazy';
        deps: { [key in string]: ServiceRef<unknown> };
        createRootContext?(deps: {
          [key in string]: unknown;
        }): Promise<unknown>;
        factory(
          deps: { [key in string]: unknown },
          context: unknown,
        ): Promise<unknown>;
      };
}>({
  type: '@backstage/BackendFeature',
  versions: ['v1'],
});

export type InternalBackendFeature = typeof OpaqueBackendFeature.TInternal;
export type InternalBackendRegistrations =
  typeof OpaqueBackendFeature.TInternal & { featureType: 'registrations' };
export type InternalBackendFeatureLoader =
  typeof OpaqueBackendFeature.TInternal & { featureType: 'loader' };
export type InternalServiceFactory<
  TService = unknown,
  TScope extends 'plugin' | 'root' = 'plugin' | 'root',
  TInstances extends 'singleton' | 'multiton' = 'singleton' | 'multiton',
> = typeof OpaqueBackendFeature.TInternal &
  ServiceFactory<TService, TScope, TInstances> & { featureType: 'service' };
