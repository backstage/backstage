/*
 * Copyright 2020 Spotify AB
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

import ApiRef from './ApiRef';

export type AnyApiRef = ApiRef<any>;

export type ApiRefType<T> = T extends ApiRef<infer U> ? U : never;

export type TypesToApiRefs<T> = { [key in keyof T]: ApiRef<T[key]> };

export type ApiRefsToTypes<T extends { [key in any]: ApiRef<any> }> = {
  [key in keyof T]: ApiRefType<T[key]>;
};

export type ApiHolder = {
  get<T>(api: ApiRef<T>): T | undefined;
};

export type ApiFactory<Api, Impl, Deps> = {
  implements: ApiRef<Api>;
  deps: TypesToApiRefs<Deps>;
  factory(deps: Deps): Impl extends Api ? Impl : never;
};
