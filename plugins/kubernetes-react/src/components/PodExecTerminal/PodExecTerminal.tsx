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

import { Progress } from '@backstage/core-components';
import { lazy, Suspense } from 'react';
import type { PodExecTerminalProps } from './PodExecTerminalContent';

export type { PodExecTerminalProps } from './PodExecTerminalContent';

// @xterm/xterm and related CSS are large; only load them when a terminal mounts.
const LazyPodExecTerminalContent = lazy(() =>
  import('./PodExecTerminalContent').then(m => ({
    default: m.PodExecTerminalContent,
  })),
);

/**
 * Executes a `/bin/sh` process in the given pod's container and opens a terminal connected to it
 *
 * @public
 */
export const PodExecTerminal = (props: PodExecTerminalProps) => (
  <Suspense fallback={<Progress />}>
    <LazyPodExecTerminalContent {...props} />
  </Suspense>
);
