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
import { CompletedRequest, CompletedResponse } from 'mockttp';
import { ErrorObject } from 'ajv';

export function mockttpToFetchRequest(request: CompletedRequest) {
  const headers = new Headers(request.rawHeaders);
  return {
    url: request.url,
    method: request.method,
    headers,
    json: () => request.body.getJson(),
    text: () => request.body.getText(),
  } as Request;
}
export function mockttpToFetchResponse(response: CompletedResponse) {
  const headers = new Headers(response.rawHeaders);
  return {
    status: response.statusCode,
    headers,
    json: () => response.body?.getJson(),
    text: () => response.body?.getText(),
  } as Response;
}

export function humanifyAjvError(error: ErrorObject) {
  switch (error.keyword) {
    case 'required':
      return `The "${error.params.missingProperty}" property is required`;
    case 'type':
      return `${
        error.instancePath ? `"${error.instancePath}"` : 'Value'
      } should be of type ${error.params.type}`;
    case 'additionalProperties':
      return `The "${error.params.additionalProperty}" property is not allowed`;
    default:
      return error.message;
  }
}
