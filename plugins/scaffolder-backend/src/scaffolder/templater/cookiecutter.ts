import { TemplaterBase, TemplaterRunOptions } from '.';

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

export class CookieCutter implements TemplaterBase {
  public async run(options: TemplaterRunOptions): Promise<string> {
    // first we need to make cookiecutter.json in the directory provided with the input values.
    const cookieInfo = {
      _copy_without_render: ['.github/workflows/*'],
      ...options.values,
    };

    await fs.writeJSON(options.directory, cookieInfo);
    return '';
    // run cookie cutter with new json
  }
}
