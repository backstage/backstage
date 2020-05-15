/*
 * Copyright 2020 Spotify AB
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

import { ComponentType } from 'react';
import { IconComponent, SystemIconKey, SystemIcons } from '../../icons';
import { BackstagePlugin } from '../plugin';
import { ApiHolder } from '../apis';

export type AppComponents = {
  NotFoundErrorPage: ComponentType<{}>;
};

export type AppOptions = {
  /**
   * A holder of all APIs available in the app.
   *
   * Use for example ApiRegistry or ApiTestRegistry.
   */
  apis?: ApiHolder;

  /**
   * Supply icons to override the default ones.
   */
  icons?: Partial<SystemIcons>;

  /**
   * A list of all plugins to include in the app.
   */
  plugins?: BackstagePlugin[];

  /**
   * Supply components to the app to override the default ones.
   */
  components?: Partial<AppComponents>;
};

export type BackstageApp = {
  /**
   * Get the holder for all APIs available in the app.
   */
  getApis(): ApiHolder;

  /**
   * Returns all plugins registered for the app.
   */
  getPlugins(): BackstagePlugin[];

  /**
   * Get a common icon for this app.
   */
  getSystemIcon(key: SystemIconKey): IconComponent;

  /**
   * Creates a root component for this app, including the App chrome
   * and routes to all plugins.
   */
  getRootComponent(): ComponentType<{}>;

  /**
   * Provider component that should wrap the App's RootComponent and
   * any other components that need to be within the app context.
   */
  getProvider(): ComponentType<{}>;
};
