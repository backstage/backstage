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

import { EntitiesResponseItems } from '../../catalog/types';
import { Response } from 'express';
import { writeResponseData } from './write';

export interface EntityArrayJsonStream {
  send(entities: EntitiesResponseItems): Promise<boolean>;
  complete(): void;
  close(): void;
}

// Helps stream EntitiesResponseItems[] as a JSON response stream to avoid performance issues
export function createEntityArrayJsonStream(
  res: Response,
): EntityArrayJsonStream {
  // Imitate the httpRouter behavior of pretty-printing in development
  const prettyPrint = process.env.NODE_ENV === 'development';
  let firstSend = true;
  let completed = false;

  return {
    async send(response) {
      if (firstSend) {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.status(200);
        res.flushHeaders();
      }

      if (response.type === 'raw') {
        for (const item of response.entities) {
          const prefix = firstSend ? '[' : ',';
          firstSend = false;

          if (await writeResponseData(res, prefix + item)) {
            return true;
          }
        }
        return false;
      }

      let data: string;
      if (prettyPrint) {
        data = JSON.stringify(response.entities, null, 2);
        data = firstSend ? data.slice(0, -2) : `,\n${data.slice(2, -2)}`;
      } else {
        data = JSON.stringify(response.entities);
        data = firstSend ? data.slice(0, -1) : `,${data.slice(1, -1)}`;
      }

      firstSend = false;
      return writeResponseData(res, data);
    },
    complete() {
      if (firstSend) {
        res.json([]);
      } else {
        res.end(prettyPrint ? '\n]' : ']', 'utf8');
      }
      completed = true;
    },
    close() {
      if (!completed) {
        res.end();
      }
    },
  };
}
