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
import { JsonObject } from '@backstage/types';
import http, { IncomingMessage } from 'http';
import { Duplex } from 'stream';
import https from 'https';

/** @public */
export type SignalServiceUpgradeOptions = {
  server: https.Server | http.Server;
  request: IncomingMessage;
  socket: Duplex;
  head: Buffer;
};

/** @public */
export type SignalService = {
  /**
   * Publishes a message to user refs to specific topic
   */
  publish(
    to: string | string[],
    topic: string,
    message: JsonObject,
  ): Promise<void>;

  /**
   * Handles request upgrade
   */
  handleUpgrade(options: SignalServiceUpgradeOptions): Promise<void>;
};
