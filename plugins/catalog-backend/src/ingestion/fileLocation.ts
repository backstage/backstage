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

import fs from 'fs-extra';
import { ComponentDescriptor, parseDescriptor } from '../descriptors';

export async function readFileLocation(
  target: string,
): Promise<ComponentDescriptor[]> {
  let rawYaml;
  try {
    rawYaml = await fs.readFile(target, 'utf8');
  } catch (e) {
    throw new Error(`Unable to read "${target}", ${e}`);
  }

  try {
    return parseDescriptor(rawYaml);
  } catch (e) {
    throw new Error(`Malformed descriptor at "${target}", ${e}`);
  }
}
