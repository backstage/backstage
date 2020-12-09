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

import { Router } from 'express';
import { Logger } from 'winston';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createRouter = async (_: Logger): Promise<Router> => Router();

throw new Error(
  'The sentry-backend has been deprecated and replaced by the proxy-backend. See the ' +
    'changelog on how to migrate to the proxy backend: https://github.com/backstage/backstage/blob/master/plugins/sentry/CHANGELOG.md.',
);
