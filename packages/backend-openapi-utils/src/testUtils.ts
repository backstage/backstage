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

export const createSuperTestAgent = (app: Express): Server | Express => {
  if (process.env.OPTIC_PROXY) {
    const server = app.listen(3000);
    return {
      ...server,
      address: () => new URL(process.env.OPTIC_PROXY!),
    } as any;
  }
  return app;
};
