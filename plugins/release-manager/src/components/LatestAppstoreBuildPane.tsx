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
import React from 'react';
import { Table, TableRow, TableBody } from '@material-ui/core';
import { LatestBuild } from '../types';
import { latestBuildStatus } from '../utils/status';
import { AxiosError } from 'axios';
import { RmExpansionPanel } from './RmExpansionPanel';

import { StatusContainer } from './StatusContainer';
import { StatusItem } from './StatusItem';
import capitalize from 'lodash/capitalize';
import { InfoIcon } from './InfoIcon';
import { parseError } from '../utils/errors';

export const LatestAppstoreBuildPane = ({
  build,
  loading,
  error,
}: {
  build: LatestBuild;
  loading: boolean;
  error?: AxiosError;
}) => {
  const status = latestBuildStatus(build, error) || 'loading';

  const Title = () => {
    const extraStatusItems = () => {
      if (loading || error) return null;

      const statusItems = [];

      statusItems.push(
        <StatusItem key="track" chip>
          {capitalize(build.track)}
        </StatusItem>,
      );
      statusItems.push(
        <StatusItem key="version" chip>
          {build.version}
        </StatusItem>,
      );

      return statusItems;
    };

    return (
      <StatusContainer>
        <StatusItem>Latest Version in App Store</StatusItem>
        {extraStatusItems()}
        <InfoIcon
          title={
            <span>
              Lists the latest build that has been promoted to Alpha or Beta
              users or that has been rolled out to production.
            </span>
          }
        />
      </StatusContainer>
    );
  };

  return (
    <RmExpansionPanel
      status={status}
      loading={loading}
      title={<Title />}
      expandable={!loading && !error}
    >
      {error && parseError(error)}
      {!loading && !error && (
        <Table size="medium">
          <TableBody>
            <TableRow />
          </TableBody>
        </Table>
      )}
    </RmExpansionPanel>
  );
};
