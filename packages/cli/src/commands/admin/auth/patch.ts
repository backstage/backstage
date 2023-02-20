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

import * as fs from 'fs-extra';
import * as differ from 'diff';

export const patch = async (file: string, patchFile: string) => {
  const patchContent = await fs.readFile(patchFile, 'utf8');
  const oldContent = await fs.readFile(file, 'utf8');
  const newContent = differ.applyPatch(oldContent, patchContent);

  return await fs.writeFile(file, newContent, 'utf8');
};
