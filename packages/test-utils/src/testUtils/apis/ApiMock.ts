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

import { ApiFactory } from '@backstage/core-plugin-api';

/**
 * Represents a mocked version of an API, where you automatically have access to
 * the mocked versions of all of its methods along with a factory that returns
 * that same mock.
 *
 * @public
 */
export type ApiMock<TApi> = {
  factory: ApiFactory<TApi, TApi, {}>;
} & {
  [Key in keyof TApi]: TApi[Key] extends (...args: infer Args) => infer Return
    ? TApi[Key] & jest.MockInstance<Return, Args>
    : TApi[Key];
};
