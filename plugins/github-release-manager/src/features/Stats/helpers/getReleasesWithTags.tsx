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

import { calverRegexp } from '../../../helpers/tagParts/getCalverTagParts';
import { GetAllTagsResult } from '../../../api/PluginApiClient';
import { getMappedReleases } from './mapReleases';
import { Project } from '../../../contexts/ProjectContext';
import { semverRegexp } from '../../../helpers/tagParts/getSemverTagParts';

export function getReleasesWithTags({
  allTags,
  project,
  mappedReleases,
}: {
  allTags: GetAllTagsResult;
  project: Project;
  mappedReleases: ReturnType<typeof getMappedReleases>['mappedReleases'];
}) {
  return {
    releasesWithTags: allTags.reduce(
      (
        acc: ReturnType<typeof getMappedReleases>['mappedReleases'] & {
          unmatchedTags: string[];
          unmappableTags: string[];
        },
        tag,
      ) => {
        const match =
          project.versioningStrategy === 'semver'
            ? tag.tagName.match(semverRegexp)
            : tag.tagName.match(calverRegexp);

        if (!match) {
          acc.unmatchedTags.push(tag.tagName);
          return acc;
        }

        const prefix = match[1];
        const baseVersion =
          project.versioningStrategy === 'semver'
            ? `${match[2]}.${match[3]}`
            : match[2];

        if (!acc.releases[baseVersion]) {
          acc.unmappableTags.push(tag.tagName);
          return acc;
        }

        if (prefix === 'rc') {
          const existingEntry = acc.releases[baseVersion].candidates.find(
            ({ tagName }) => tagName === tag.tagName,
          );

          if (existingEntry) {
            existingEntry.sha = tag.sha;
          } else {
            acc.releases[baseVersion].candidates.push({
              tagName: tag.tagName,
              sha: tag.sha,
            });
          }
        }

        if (prefix === 'version') {
          const existingEntry = acc.releases[baseVersion].versions.find(
            ({ tagName }) => tagName === tag.tagName,
          );

          if (existingEntry) {
            existingEntry.sha = tag.sha;
          } else {
            acc.releases[baseVersion].versions.push({
              tagName: tag.tagName,
              sha: tag.sha,
            });
          }
        }

        return acc;
      },
      {
        ...mappedReleases,
        unmatchedTags: [],
        unmappableTags: [],
      },
    ),
  };
}
