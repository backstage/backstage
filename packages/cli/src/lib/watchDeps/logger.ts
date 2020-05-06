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

import { createLogPipe } from '../logging';

export type ColorFunc = (msg: string) => string;

// A factory for creating log pipes that rotate between different coloring functions
export function createLogPipeFactory(colorFuncs: ColorFunc[]) {
  let colorIndex = 0;

  return (name: string) => {
    const colorFunc = colorFuncs[colorIndex];

    colorIndex = (colorIndex + 1) % colorFuncs.length;

    const prefix = `${colorFunc(name)}: `;
    return createLogPipe({ prefix });
  };
}
