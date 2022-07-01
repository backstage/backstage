/*
 * Copyright 2022 The Backstage Authors
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

import { ComponentClass, FunctionComponent, ReactElement } from 'react';

type FunctionComponentWithoutAutoChildren<P> = {
  [K in keyof FunctionComponent<P>]: FunctionComponent<P>[K];
} & {
  (props: P, context?: any): ReactElement<any, any> | null;
};

/**
 * A safer alternative to React (16/17) ComponentType which doesn't
 * automatically include children. This is the same as in React 18.
 */
export type ComponentType<P> =
  | ComponentClass<P>
  | FunctionComponentWithoutAutoChildren<P>;
