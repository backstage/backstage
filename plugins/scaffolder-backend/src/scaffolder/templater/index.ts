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

import type { Writable } from 'stream';

export interface RequiredTemplateValues {
  component_id: string;
}

export interface TemplaterRunOptions {
  directory: string;
  values: RequiredTemplateValues & object;
  logStream?: Writable;
}

export abstract class TemplaterBase {
  // runs the templating with the values and returns the directory to push the VCS
  abstract async run(opts: TemplaterRunOptions): Promise<string>;
}

export interface TemplaterConfig {
  templater?: TemplaterBase;
}

class Templater implements TemplaterBase {
  templater?: TemplaterBase;

  constructor({ templater }: TemplaterConfig) {
    this.templater = templater;
  }

  public async run(opts: TemplaterRunOptions) {
    return this.templater!.run(opts);
  }
}

export const createTemplater = (
  templaterConfig: TemplaterConfig,
): TemplaterBase => {
  return new Templater(templaterConfig);
};
