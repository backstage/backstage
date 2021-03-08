/*
 * Copyright 2021 Spotify AB
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

import {
  parseServerResponseErrorBody,
  ServerResponseErrorBody,
} from '../payload';

/**
 * An error thrown as the result of a failed server request.
 *
 * The server is expected to respond on the ServerResponseErrorBody format.
 */
export class ServerResponseError extends Error {
  static async forResponse(response: Response): Promise<ServerResponseError> {
    const body = await parseServerResponseErrorBody(response);
    const status = body.error.statusCode || response.status;
    const statusText = body.error.name || response.statusText;
    const message = `Request failed with ${status} ${statusText}`;
    return new ServerResponseError(message, body);
  }

  readonly body: ServerResponseErrorBody;

  constructor(message: string, body: ServerResponseErrorBody) {
    super(message);
    this.name = 'ServerResponseError';
    this.body = body;
  }
}
