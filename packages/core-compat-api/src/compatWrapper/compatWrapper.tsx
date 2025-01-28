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

import { useVersionedContext } from '@backstage/version-bridge';
import { ReactNode } from 'react';
import { BackwardsCompatProvider } from './BackwardsCompatProvider';
import { ForwardsCompatProvider } from './ForwardsCompatProvider';

function BidirectionalCompatProvider(props: { children: ReactNode }) {
  const isInNewApp = !useVersionedContext<{ 1: unknown }>('app-context');

  if (isInNewApp) {
    return <BackwardsCompatProvider {...props} />;
  }

  return <ForwardsCompatProvider {...props} />;
}

/**
 * Wraps a React element in a bidirectional compatibility provider, allow APIs
 * from `@backstage/core-plugin-api` to be used in an app from `@backstage/frontend-app-api`,
 * and APIs from `@backstage/frontend-plugin-api` to be used in an app from `@backstage/core-app-api`.
 *
 * @public
 */
export function compatWrapper(element: ReactNode) {
  return <BidirectionalCompatProvider>{element}</BidirectionalCompatProvider>;
}
