/*
 * Copyright 2025 The Backstage Authors
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

import { getAllInstances } from '../lib/storage';

export async function list(_argv: string[]) {
  const { instances, selected } = await getAllInstances();
  if (!instances.length) {
    process.stderr.write('No instances found\n');
    return;
  }
  for (const inst of instances) {
    const mark = inst.name === selected?.name ? '* ' : '  ';
    process.stdout.write(`${mark}${inst.name} - ${inst.baseUrl}\n`);
  }
}
