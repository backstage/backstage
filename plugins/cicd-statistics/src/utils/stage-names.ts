/*
 * Copyright 2022 The Backstage Authors
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

import { map } from 'already';

import { Build, Stage } from '../apis/types';

export function defaultFormatStageName(
  parentNames: Array<string>,
  stageName: string,
): string {
  let name = stageName;

  // Cut off parent names (if they are prefixed to the stage name)
  parentNames.forEach(parentName => {
    if (name.startsWith(parentName)) {
      const newName = name
        .slice(parentName.length)
        // Remove things like ' - '
        .replace(/^[^\w\d]+/g, '');
      if (newName) {
        name = newName;
      }
    }
  });

  // Cut off anything after colon in what looks like pulling docker images
  return name.replace(/((pulling|(running)) [^:/]*\/.*?):.*/g, '$1');
}

export interface CleanupBuildTreeOptions {
  formatStageName: typeof defaultFormatStageName;
  lowerCase: boolean;
}

export async function cleanupBuildTree(
  builds: Build[],
  opts: CleanupBuildTreeOptions,
): Promise<Build[]> {
  const { formatStageName, lowerCase } = opts;

  const recurseStage = (stage: Stage, parentNames: Array<string>): Stage => {
    const name = formatStageName(
      parentNames,
      lowerCase ? stage.name.toLocaleLowerCase('en-US') : stage.name,
    );
    const ancestry = [...parentNames, name];

    return {
      ...stage,
      name,
      stages: stage.stages?.map(subStage => recurseStage(subStage, ancestry)),
    };
  };

  return map(builds, { chunk: 'idle' }, build => ({
    ...build,
    stages: build.stages.map(stage => recurseStage(stage, [])),
  }));
}
