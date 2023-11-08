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
import { Express } from 'express';
import { Server } from 'http';

/**
 * !!! THIS CURRENTLY ONLY SUPPORTS SUPERTEST !!!
 * Running against supertest, we need some way to hit the optic proxy. This ensures that
 *  that happens at runtime when in the context of a `yarn optic capture` command.
 * @param app - Express router that would be passed to supertest's `request`.
 * @returns A wrapper around the express router (or the router untouched) that still works with supertest.
 * @public
 */
export const wrapInOpenApiTestServer = (app: Express): Server | Express => {
  if (process.env.OPTIC_PROXY) {
    const server = app.listen(+process.env.PORT!);
    return {
      ...server,
      address: () => new URL(process.env.OPTIC_PROXY!),
    } as any;
  }
  return app;
};
