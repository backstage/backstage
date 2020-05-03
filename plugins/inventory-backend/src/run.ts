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

import { getRootLogger } from '@backstage/backend-common';
import { startServer } from './service/server';

startServer({
  port: process.env.PLUGIN_PORT ? Number(process.env.PLUGIN_PORT) : 3003,
  enableCors: process.env.PLUGIN_CORS
    ? Boolean(process.env.PLUGIN_CORS)
    : false,
  logger: getRootLogger(),
}).catch(err => {
  getRootLogger().error(err);
  process.exit(1);
});

process.on('SIGINT', () => {
  getRootLogger().info('CTRL+C pressed; exiting.');
  process.exit(0);
});
