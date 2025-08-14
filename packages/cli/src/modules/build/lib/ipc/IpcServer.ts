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

import { serializeError } from '@backstage/errors';
import { ChildProcess } from 'child_process';

interface RequestMeta {
  generation: number;
}

type MethodHandler<TRequest, TResponse> = (
  req: TRequest,
  meta: RequestMeta,
) => Promise<TResponse>;

interface Request {
  id: number;
  method: string;
  body: unknown;
  type: string;
}

const requestType = '@backstage/cli/channel/request';
const responseType = '@backstage/cli/channel/response';

export class IpcServer {
  #generation = 1;
  #methods = new Map<string, MethodHandler<any, any>>();

  addChild(child: ChildProcess) {
    const generation = this.#generation++;
    const sendMessage = child.send?.bind(child);
    if (!sendMessage) {
      return;
    }

    const messageListener = (request: Request) => {
      if (request.type !== requestType) {
        return;
      }

      const handler = this.#methods.get(request.method);
      if (!handler) {
        sendMessage({
          type: responseType,
          id: request.id,
          error: {
            name: 'NotFoundError',
            message: `No handler registered for method ${request.method}`,
          },
        });
        return;
      }

      Promise.resolve()
        .then(() => handler(request.body, { generation }))
        .then(response =>
          sendMessage({
            type: responseType,
            id: request.id,
            body: response,
          }),
        )
        .catch(error =>
          sendMessage({
            type: responseType,
            id: request.id,
            error: serializeError(error),
          }),
        );
    };

    child.addListener('message', messageListener as (req: unknown) => void);

    child.addListener('exit', () => {
      child.removeListener('message', messageListener);
    });
  }

  registerMethod<TRequest, TResponse>(
    method: string,
    handler: MethodHandler<TRequest, TResponse>,
  ) {
    if (this.#methods.has(method)) {
      throw new Error(`A handler is already registered for method ${method}`);
    }
    this.#methods.set(method, handler);
  }
}
