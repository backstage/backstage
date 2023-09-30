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

type SendMessage = Exclude<typeof process.send, undefined>;

interface Request {
  id: number;
  method: string;
  body: unknown;
  type: string;
}

type Response =
  | {
      type: string;
      id: number;
      body: unknown;
    }
  | {
      type: string;
      id: number;
      error: Error;
    };

const requestType = '@backstage/cli/channel/request';
const responseType = '@backstage/cli/channel/response';

const IPC_TIMEOUT_MS = 5000;

/**
 * The client side of an IPC communication channel.
 *
 * @internal
 */
export class BackstageIpcClient {
  #messageId = 0;
  #sendMessage: SendMessage;

  /**
   * Creates a new client if we're in a child process with IPC and BACKSTAGE_CLI_CHANNEL is set.
   */
  static create(): BackstageIpcClient | undefined {
    const sendMessage = process.send?.bind(process);
    return sendMessage && process.env.BACKSTAGE_CLI_CHANNEL
      ? new BackstageIpcClient(sendMessage)
      : undefined;
  }

  constructor(sendMessage: SendMessage) {
    this.#sendMessage = sendMessage;
  }

  /**
   * Send a request to the parent process and wait for a response.
   */
  async request<TRequestBody, TResponseBody>(
    method: string,
    body: TRequestBody,
  ): Promise<TResponseBody> {
    return new Promise((resolve, reject) => {
      const id = this.#messageId++;

      const request: Request = {
        type: requestType,
        id,
        method,
        body,
      };

      let timeout: NodeJS.Timeout | undefined = undefined;

      const messageHandler = (response: Response) => {
        if (response?.type !== responseType) {
          return;
        }
        if (response.id !== id) {
          return;
        }

        clearTimeout(timeout);
        timeout = undefined;
        process.removeListener('message', messageHandler);

        if ('error' in response) {
          const error = new Error(response.error.message);
          if (response.error.name) {
            error.name = response.error.name;
          }
          reject(error);
        } else {
          resolve(response.body as TResponseBody);
        }
      };

      timeout = setTimeout(() => {
        reject(new Error(`IPC request '${method}' with ID ${id} timed out`));
        process.removeListener('message', messageHandler);
      }, IPC_TIMEOUT_MS);
      timeout.unref();

      process.addListener('message', messageHandler as () => void);

      this.#sendMessage(request, (e: Error) => {
        if (e) {
          reject(e);
        }
      });
    });
  }
}

export const ipcClient = BackstageIpcClient.create();
