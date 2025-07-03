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
import {
  DocRequestMatcher,
  EndpointMap,
  EndpointMapRequestMatcher,
  RequiredDoc,
} from './types';

/**
 * Typed Express router based on an OpenAPI 3.1 spec.
 * @public
 */
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

/**
 * @public
 */
export interface TypedRouter<GeneratedEndpointMap extends EndpointMap>
  extends Router {
  get: EndpointMapRequestMatcher<GeneratedEndpointMap, this, 'get'>;
  post: EndpointMapRequestMatcher<GeneratedEndpointMap, this, 'post'>;
  put: EndpointMapRequestMatcher<GeneratedEndpointMap, this, 'put'>;
  delete: EndpointMapRequestMatcher<GeneratedEndpointMap, this, '_delete'>;
}
