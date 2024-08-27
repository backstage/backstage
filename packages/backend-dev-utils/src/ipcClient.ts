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

type ResponseHandler = (response: Response) => void;

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
  #handlers: Map<number, ResponseHandler> = new Map();

  /**
   * Creates a new client if we're in a child process with IPC and BACKSTAGE_CLI_CHANNEL is set.
   */
  static create(): BackstageIpcClient | undefined {
    const sendMessage = process.send?.bind(process);
    const client =
      sendMessage && process.env.BACKSTAGE_CLI_CHANNEL
        ? new BackstageIpcClient(sendMessage)
        : undefined;

    if (client) {
      process.on('message', (message, _sendHandle) =>
        client.handleMessage(message, _sendHandle),
      );
    }

    return client;
  }

  constructor(sendMessage: SendMessage) {
    this.#sendMessage = sendMessage;
  }

  private handleMessage(message: unknown, _sendHandle: unknown) {
    const isResponse = (msg: unknown): msg is Response =>
      (msg as Response)?.type === responseType;

    if (isResponse(message)) {
      this.#handlers.get(message.id)?.(message);
    }
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

      const responseHandler: ResponseHandler = (response: Response) => {
        clearTimeout(timeout);
        timeout = undefined;
        this.#handlers.delete(id);

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
        this.#handlers.delete(id);
      }, IPC_TIMEOUT_MS);
      timeout.unref();

      this.#handlers.set(id, responseHandler);
      this.#sendMessage(request, (e: Error) => {
        if (e) {
          reject(e);
        }
      });
    });
  }
}

export const ipcClient = BackstageIpcClient.create();
