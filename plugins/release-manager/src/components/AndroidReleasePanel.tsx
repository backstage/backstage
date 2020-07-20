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
import React, { useState, useEffect } from 'react';
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Status, AndroidRelease } from '../types';
import { findStatuses } from '../utils/status';
import { StatusContainer } from './StatusContainer';
import { StatusItem } from './StatusItem';
import { StatusIndicator } from './StatusIndicator';
import { AndroidReleaseStatusPane } from './AndroidReleaseStatusPane';
import { AndroidReleaseNotesPane } from './AndroidReleaseNotesPane';
import { AndroidReleaseVersionCodesPane } from './AndroidReleaseVersionCodesPane';

export const AndroidReleasePanel = ({
  version,
  release,
}: {
  version: string;
  release: AndroidRelease;
}) => {
  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    findStatuses({
      setStatus,
      status,
      androidRelease: release,
    });
  }, [setStatus, status, release]);

  return (
    <ExpansionPanel>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <StatusContainer>
          <StatusItem>
            <StatusIndicator status={status} />
            <Typography variant="body2">{version}</Typography>
          </StatusItem>
        </StatusContainer>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails style={{ flexDirection: 'column' }}>
        <AndroidReleaseNotesPane releaseNotes={release.releaseNotes} />
        <AndroidReleaseVersionCodesPane versionCodes={release.versionCodes} />
        <AndroidReleaseStatusPane releaseStatus={release.status} />
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};
