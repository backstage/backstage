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

import { JsonObject } from '@backstage/types';

export const defineCheckpoint = async <U extends JsonObject>(props: {
  checkpoint?: (key: string, fn: () => Promise<U>) => Promise<U>;
  key: string;
  fn: () => Promise<U>;
}): Promise<U> => {
  const { checkpoint, fn, key } = props;
  return checkpoint
    ? checkpoint?.(key, async () => {
        return await fn();
      })
    : fn();
};
