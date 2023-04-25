/*
* Copyright 2022 The Backstage Authors
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

import { ApiRef } from '@backstage/core-plugin-api';

/**
* TODO
*
* @alpha
*/
export type FrontendExtensionPoint<T> = {
 id: string;

 /**
  * Utility for getting the type of the extension point, using `typeof extensionPoint.T`.
  * Attempting to actually read this value will result in an exception.
  */
 T: T;

 toString(): string;

 $$type: '@backstage/FrontendExtensionPoint';
};

/**
* The callbacks passed to the `register` method of a frontend plugin.
*
* @alpha
*/
export interface FrontendPluginRegistrationPoints {
 registerExtensionPoint<TExtensionPoint>(
   ref: FrontendExtensionPoint<TExtensionPoint>,
   impl: TExtensionPoint,
 ): void;
 registerInit<Deps extends { [name in string]: unknown }>(options: {
   deps: {
     [name in keyof Deps]: ApiRef<Deps[name]>;
   };
   init(deps: Deps): Promise<void>;
 }): void;
}

/**
* The callbacks passed to the `register` method of a frontend module.
*
* @alpha
*/
export interface FrontendModuleRegistrationPoints {
 registerInit<Deps extends { [name in string]: unknown }>(options: {
   deps: {
     [name in keyof Deps]: ApiRef<Deps[name]> | FrontendExtensionPoint<Deps[name]>;
   };
   init(deps: Deps): Promise<void>;
 }): void;
}

/** @alpha */
export interface FrontendFeature {
 // NOTE: This type is opaque in order to simplify future API evolution.
 $$type: '@backstage/FrontendFeature';
}

/** @internal */
export interface InternalFrontendFeature extends FrontendFeature {
 version: 'v1';
 getRegistrations(): Array<
   InternalFrontendPluginRegistration | InternalFrontendModuleRegistration
 >;
}

/** @internal */
export interface InternalFrontendPluginRegistration {
 pluginId: string;
 type: 'plugin';
 extensionPoints: Array<readonly [FrontendExtensionPoint<unknown>, unknown]>;
 init: {
   deps: Record<string, ApiRef<unknown>>;
   func(deps: Record<string, unknown>): Promise<void>;
 };
}

/** @internal */
export interface InternalFrontendModuleRegistration {
 pluginId: string;
 moduleId: string;
 type: 'module';
 init: {
   deps: Record<string, ApiRef<unknown> | FrontendExtensionPoint<unknown>>;
   func(deps: Record<string, unknown>): Promise<void>;
 };
}
