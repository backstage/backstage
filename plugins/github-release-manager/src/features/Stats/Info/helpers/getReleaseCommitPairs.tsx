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

import { ReleaseCommitPairs } from '../hooks/useGetReleaseTimes';
import { ReleaseStats } from '../../contexts/ReleaseStatsContext';

export function getReleaseCommitPairs({
  releaseStats,
}: {
  releaseStats: ReleaseStats;
}) {
  const releaseCommitPairs = Object.values(releaseStats.releases).reduce(
    (acc: ReleaseCommitPairs, release) => {
      const startTag = [...release.candidates].reverse()[0];
      const endTag = release.versions[0];

      // Missing Release Candidate for unknown reason
      if (!startTag?.sha) {
        return acc;
      }

      // Missing Release Version (likely prerelease)
      if (!endTag?.sha) {
        return acc;
      }

      // First RC tag is pointing towards the same commit as the most
      // recent Version tag, meaning there haven't been any patches
      // and we thus cannot determine and difference in time
      if (startTag?.sha === endTag?.sha) {
        return acc;
      }

      return acc.concat({
        baseVersion: release.baseVersion,
        startCommit: {
          tagName: startTag.tagName,
          sha: startTag.sha,
        },
        endCommit: {
          tagName: endTag.tagName,
          sha: endTag.sha,
        },
      });
    },
    [],
  );

  return {
    releaseCommitPairs,
  };
}
