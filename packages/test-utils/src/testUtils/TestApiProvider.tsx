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

import React, { ReactNode } from 'react';
import { ApiProvider, ApiRegistry } from '@backstage/app-api';
import { ApiRef } from '@backstage/plugin-api';

type ApiImplPair<T> = T extends infer I ? [ApiRef<T>, I] : never;
type PairedApiImpls<T> = { [P in keyof T]: ApiImplPair<T[P]> };

type TestApiProviderProps<T extends any[]> = {
  apis: [...PairedApiImpls<T>];
  children: ReactNode;
};

export const TestApiProvider = <T extends any[]>({
  apis,
  children,
}: TestApiProviderProps<T>) => {
  return <ApiProvider apis={ApiRegistry.from(apis)} children={children} />;
};
