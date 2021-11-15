/*
 * Copyright 2021 The Backstage Authors
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

import { WriteStream } from 'tty';
import { resolve as resolvePath } from 'path';
import { paths } from '../../../paths';

export function mockPaths(options: {
  ownDir?: string;
  ownRoot?: string;
  targetDir?: string;
  targetRoot?: string;
}): void {
  const { ownDir, ownRoot, targetDir, targetRoot } = options;
  if (ownDir) {
    paths.ownDir = ownDir;
    jest
      .spyOn(paths, 'resolveOwn')
      .mockImplementation((...ps) => resolvePath(ownDir, ...ps));
  }
  if (ownRoot) {
    jest.spyOn(paths, 'ownRoot', 'get').mockReturnValue(ownRoot);
    jest
      .spyOn(paths, 'resolveOwnRoot')
      .mockImplementation((...ps) => resolvePath(ownRoot, ...ps));
  }
  if (targetDir) {
    paths.targetDir = targetDir;
    jest
      .spyOn(paths, 'resolveTarget')
      .mockImplementation((...ps) => resolvePath(targetDir, ...ps));
  }
  if (targetRoot) {
    jest.spyOn(paths, 'targetRoot', 'get').mockReturnValue(targetRoot);
    jest
      .spyOn(paths, 'resolveTargetRoot')
      .mockImplementation((...ps) => resolvePath(targetRoot, ...ps));
  }
}

export function createMockOutputStream() {
  const output = new Array<string>();
  return [
    output,
    {
      cursorTo: () => {},
      clearLine: () => {},
      moveCursor: () => {},
      write: (msg: string) =>
        // Clean up colors and whitespace
        // eslint-disable-next-line no-control-regex
        output.push(msg.replace(/\x1B\[\d\dm/g, '').trim()),
    } as unknown as WriteStream & { fd: any },
  ] as const;
}
