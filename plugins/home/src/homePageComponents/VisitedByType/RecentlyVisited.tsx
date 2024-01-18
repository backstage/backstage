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

export { Actions } from './Actions';
export { ContextProvider } from './Context';
export type { VisitedByTypeProps, VisitedByTypeKind } from './Content';
import React from 'react';
import { Content, VisitedByTypeProps } from './Content';

const RecentlyVisitedContent = (props: Partial<VisitedByTypeProps>) => (
  <Content {...props} kind="recent" />
);

export { RecentlyVisitedContent as Content };
