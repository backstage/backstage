/*
 * Copyright 2021 Spotify AB
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

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
function getGlobal() {
  if (typeof window !== 'undefined' && window.Math === Math) {
    return window;
  }
  if (typeof self !== 'undefined' && self.Math === Math) {
    return self;
  }
  // eslint-disable-next-line no-new-func
  return Function('return this')();
}

export const globalObject = getGlobal();
