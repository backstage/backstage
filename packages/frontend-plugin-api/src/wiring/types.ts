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

import { JsonObject } from '@backstage/types';
import { ExternalRouteRef, RouteRef, SubRouteRef } from '../routing';
import { ExtensionDefinition } from './createExtension';
import {
  AnyExtensionDataRef,
  ExtensionDataRef,
  ExtensionDataValue,
} from './createExtensionDataRef';
import { ApiHolder, AppNode } from '../apis';
import { FrontendModule } from './createFrontendModule';
import { FrontendPlugin } from './createFrontendPlugin';

/**
 * Feature flag configuration.
 *
 * @public
 */
export type FeatureFlagConfig = {
  /** Feature flag name */
  name: string;
};

/** @public */
export type AnyRoutes = { [name in string]: RouteRef | SubRouteRef };

/** @public */
export type AnyExternalRoutes = { [name in string]: ExternalRouteRef };

/** @public */
export type ExtensionMap<
  TExtensionMap extends { [id in string]: ExtensionDefinition },
> = {
  get<TId extends keyof TExtensionMap>(id: TId): TExtensionMap[TId];
};

/** @public */
export type ExtensionDataContainer<UExtensionData extends AnyExtensionDataRef> =
  Iterable<
    UExtensionData extends ExtensionDataRef<
      infer IData,
      infer IId,
      infer IConfig
    >
      ? IConfig['optional'] extends true
        ? never
        : ExtensionDataValue<IData, IId>
      : never
  > & {
    get<TId extends UExtensionData['id']>(
      ref: ExtensionDataRef<any, TId, any>,
    ): UExtensionData extends ExtensionDataRef<infer IData, TId, infer IConfig>
      ? IConfig['optional'] extends true
        ? IData | undefined
        : IData
      : never;
  };

/** @public */
export type ExtensionFactoryMiddleware = (
  originalFactory: (contextOverrides?: {
    config?: JsonObject;
  }) => ExtensionDataContainer<AnyExtensionDataRef>,
  context: {
    node: AppNode;
    apis: ApiHolder;
    config?: JsonObject;
  },
) => Iterable<ExtensionDataValue<any, any>>;

/** @public  */
export type FrontendFeature = FrontendPlugin | FrontendModule;
