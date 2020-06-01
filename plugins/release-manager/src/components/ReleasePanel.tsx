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
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Release, Status } from '../types';
import useAxios from 'axios-hooks';
import { baseUrl } from '../utils/config';
import { LatestAppstoreBuildPane } from './LatestAppstoreBuildPane';
import { findStatuses } from '../utils/status';

export const ReleasePanel = ({ release }: { release: Release }) => {
  const [status, setStatus] = useState<Status>('loading');

  const [
    {
      data: latestAppstoreData,
      loading: latestAppstoreLoading,
      error: latestAppstoreError,
    },
  ] = useAxios({
    url: `${baseUrl}/latest-build/${release.platform}/${release.version}`,
    params: {
      check_store: true,
    },
  });

  useEffect(() => {
    if (latestAppstoreLoading) {
      return;
    }

    findStatuses({
      setStatus,
      latestAppstoreData,
      latestAppstoreError,
      status,
    });
  }, [
    setStatus,
    status,
    latestAppstoreData,
    latestAppstoreLoading,
    latestAppstoreError,
  ]);

  return (
    <ExpansionPanel>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} />
      <ExpansionPanelDetails style={{ flexDirection: 'column' }}>
        <LatestAppstoreBuildPane
          loading={latestAppstoreLoading}
          error={latestAppstoreError}
          build={latestAppstoreData}
        />
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};
