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

import { calverRegexp } from '../../helpers/tagParts/getCalverTagParts';
import { GetAllTagsResult } from '../../api/PluginApiClient';
import { getMappedReleases } from './getMappedReleases';
import { Project } from '../../contexts/ProjectContext';
import { semverRegexp } from '../../helpers/tagParts/getSemverTagParts';

export function getTags({
  allTags,
  project,
  mappedReleases,
}: {
  allTags: GetAllTagsResult;
  project: Project;
  mappedReleases: ReturnType<typeof getMappedReleases>;
}) {
  return allTags.reduce(
    (acc: { unmatched: string[]; unmappable: string[] }, tag) => {
      const match =
        project.versioningStrategy === 'semver'
          ? tag.tagName.match(semverRegexp)
          : tag.tagName.match(calverRegexp);

      if (!match) {
        acc.unmatched.push(tag.tagName);
        return acc;
      }

      const prefix = match[1];
      const baseVersion =
        project.versioningStrategy === 'semver'
          ? `${match[2]}.${match[3]}`
          : match[2];

      if (!mappedReleases.releases[baseVersion]) {
        acc.unmappable.push(tag.tagName);
        return acc;
      }

      if (
        prefix === 'rc' &&
        !mappedReleases.releases[baseVersion].candidates.includes(tag.tagName)
      ) {
        mappedReleases.releases[baseVersion].candidates.push(tag.tagName);
        return acc;
      }

      if (
        prefix === 'version' &&
        !mappedReleases.releases[baseVersion].versions.includes(tag.tagName)
      ) {
        mappedReleases.releases[baseVersion].versions.push(tag.tagName);
        return acc;
      }

      return acc;
    },
    { unmatched: [], unmappable: [] },
  );
}
