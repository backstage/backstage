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

/**
 * A standard shape of JSON data returned as the body of backend errors.
 */
export type ServerResponseErrorBody = {
  /** Details of the error that was caught */
  error: {
    /** The numeric HTTP status code that was returned */
    statusCode: number;
    /** The name of the exception that was thrown */
    name: string;
    /** The message of the exception that was thrown */
    message: string;
    /** A stringified stack trace, may not be present */
    stack?: string;
  };

  /** The incoming request */
  request?: {
    /** The HTTP method of the request */
    method: string;
    /** The URL of the request (excluding protocol and host/port) */
    url: string;
  };
};

/**
 * Attempts to extract the ServerResponseErrorBody out of a server response.
 * This consumes the body of the response.
 *
 * The code is forgiving, and constructs a useful synthetic body as best it can
 * if the response wasn't on the expected form.
 *
 * @param response The response of a failed request
 */
export async function parseServerResponseErrorBody(
  response: Response,
): Promise<ServerResponseErrorBody> {
  try {
    const text = await response.text();
    if (text) {
      if (
        response.headers.get('content-type')?.startsWith('application/json')
      ) {
        try {
          const body = JSON.parse(text);
          if (body.error && body.request) {
            return body;
          }
        } catch {
          // ignore
        }
      }

      return {
        error: {
          statusCode: response.status,
          name: 'Unknown',
          message: `Request failed with status ${response.status} ${response.statusText}, ${text}`,
        },
      };
    }
  } catch {
    // ignore
  }

  return {
    error: {
      statusCode: response.status,
      name: 'Unknown',
      message: `Request failed with status ${response.status} ${response.statusText}`,
    },
  };
}
