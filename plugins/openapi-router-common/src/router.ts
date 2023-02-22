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
import { Router } from 'express';
import { RequiredDoc } from './types';
import { DocRequestMatcher } from './types/express';

export type DeepWriteable<T> = {
  -readonly [P in keyof T]: DeepWriteable<T[P]>;
};
export interface ApiRouter<Doc extends RequiredDoc> extends Router {
  get: DocRequestMatcher<Doc, this, 'get'>;

  post: DocRequestMatcher<Doc, this, 'post'>;

  all: DocRequestMatcher<Doc, this, 'all'>;

  put: DocRequestMatcher<Doc, this, 'put'>;

  delete: DocRequestMatcher<Doc, this, 'delete'>;

  patch: DocRequestMatcher<Doc, this, 'patch'>;

  options: DocRequestMatcher<Doc, this, 'options'>;

  head: DocRequestMatcher<Doc, this, 'head'>;
}
