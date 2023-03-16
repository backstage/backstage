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
import { core } from './types';

/**
 * Typed Express router based on an OpenAPI 3.1 spec.
 * @public
 */
export interface ApiRouter<Doc extends core.Spec> extends Router {
  get: core.RequestMatcher<Doc, this, 'get'>;

  post: core.RequestMatcher<Doc, this, 'post'>;

  all: core.RequestMatcher<Doc, this, 'all'>;

  put: core.RequestMatcher<Doc, this, 'put'>;

  delete: core.RequestMatcher<Doc, this, 'delete'>;

  patch: core.RequestMatcher<Doc, this, 'patch'>;

  options: core.RequestMatcher<Doc, this, 'options'>;

  head: core.RequestMatcher<Doc, this, 'head'>;
}
