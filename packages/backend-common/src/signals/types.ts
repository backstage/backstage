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
import { LoggerService, SignalsService } from '@backstage/backend-plugin-api';
import { TokenManager } from '../tokens';

/**
 * Options for starting up an events server.
 *
 * @public
 */
export type SignalsServerConfig = {
  enabled?: boolean;
  adapter?: string;
  databaseConnection?: string | object;
};

/**
 * Generates a ${@link PluginSignalsManager} for consumption by plugins.
 *
 * @param pluginId - The plugin that the signals manager should be created for.
 *        Plugin names should be unique.
 *
 * @public
 */
export interface PluginSignalsManager {
  getClient(): SignalsService;
}

/**
 * Options given when constructing a {@link SignalsClientManager}.
 *
 * @public
 */
export type SignalsClientManagerOptions = {
  /**
   * An optional logger for use by the PluginSignalsClient.
   */
  logger?: LoggerService;
  /**
   * Token manager to authenticate with the backend.
   */
  tokenManager?: TokenManager;
};

/**
 * Command to register plugin signals client to the server
 *
 * @public
 */
export type SignalsClientRegisterCommand = {
  pluginId: string;
};

/**
 * Command to publish new message from the plugin signals client to other
 * client subscribed to the plugin
 *
 * @public
 */
export type SignalsClientMessage = {
  pluginId: string;
  topic?: string;
  targetEntityRefs?: string[];
  data: any;
};

/**
 * Command to subscribe or unsubscribe to messages of specific plugin and optionally a topic.
 *
 * @public
 */
export type SignalsClientSubscribeCommand = {
  pluginId: string;
  topic?: string;
};

/**
 * Signals client commands
 *
 * @public
 */
export type SignalsClientCommand =
  | SignalsClientRegisterCommand
  | SignalsClientMessage
  | SignalsClientSubscribeCommand;
