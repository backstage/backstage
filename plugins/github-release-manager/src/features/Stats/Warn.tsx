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

import React from 'react';
import { Alert } from '@material-ui/lab';

import { useProjectContext } from '../../contexts/ProjectContext';
import { useReleaseStatsContext } from './contexts/ReleaseStatsContext';

export const Warn = () => {
  const { releaseStats } = useReleaseStatsContext();
  const { project } = useProjectContext();

  return (
    <Alert severity="warning" style={{ marginBottom: 10 }}>
      {releaseStats.unmappableTags.length > 0 && (
        <div>
          Failed to map <strong>{releaseStats.unmappableTags.length}</strong>{' '}
          tags to releases
        </div>
      )}

      {releaseStats.unmatchedTags.length > 0 && (
        <div>
          Failed to match <strong>{releaseStats.unmatchedTags.length}</strong>{' '}
          tags to {project.versioningStrategy}
        </div>
      )}

      {releaseStats.unmatchedReleases.length > 0 && (
        <div>
          Failed to match{' '}
          <strong>{releaseStats.unmatchedReleases.length}</strong> releases to{' '}
          {project.versioningStrategy}
        </div>
      )}

      <div>See full output in the console</div>
    </Alert>
  );
};
