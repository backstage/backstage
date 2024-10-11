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
import { OperationObject } from 'openapi3-ts';
import Ajv from 'ajv';

export interface RequestParser<T> {
  parse(request: Request): Promise<T>;
}
export interface ResponseParser<T> {
  parse(response: Response): Promise<T>;
}

export interface ParserOptions {
  ajv: Ajv;
}

export interface Operation {
  schema: OperationObject;
  path: string;
  method: string;
}

export interface RequestResponsePair {
  request: CompletedRequest;
  response: CompletedResponse;
}

export interface ValidatorParams {
  pair: RequestResponsePair;
  operation: Operation;
}

export interface Validator {
  validate(pair: ValidatorParams): Promise<void>;
}
