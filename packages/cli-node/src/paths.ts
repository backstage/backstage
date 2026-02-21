/*
 * Copyright 2020 The Backstage Authors
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

import { targetPaths, findOwnPaths } from '@backstage/cli-common';

const ownPaths = findOwnPaths(__dirname);

/* eslint-disable-next-line no-restricted-syntax */
export const paths = {
  get ownDir() {
    return ownPaths.resolve();
  },
  get ownRoot() {
    return ownPaths.resolveRoot();
  },
  get targetDir() {
    return targetPaths.resolve();
  },
  get targetRoot() {
    return targetPaths.resolveRoot();
  },
  resolveOwn: ownPaths.resolve,
  resolveOwnRoot: ownPaths.resolveRoot,
  resolveTarget: targetPaths.resolve,
  resolveTargetRoot: targetPaths.resolveRoot,
};
