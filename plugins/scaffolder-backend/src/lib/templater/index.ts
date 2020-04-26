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

import { CookieCutterTemplater } from './cookiecutter';

export interface RequiredTemplateValues {
  componentId: string;
}
export interface TemplaterRunOptions {
  directory: string;
  values: RequiredTemplateValues & object;
}

export abstract class TemplaterBase {
  // runs the templating with the values and returns the directory to push the VCS
  abstract async run(opts: TemplaterRunOptions): Promise<string>;
}

class TemplaterImplementation implements TemplaterBase {
  templater?: TemplaterBase;

  constructor() {
    this.templater = new CookieCutterTemplaterutterTemplater();
  }

  public setTemplater(templater: TemplaterBase) {
    this.templater = templater;
  }

  public async run(opts: TemplaterRunOptions) {
    return this.templater!.run(opts);
  }
}

export const Templater = new TemplaterImplementation();
