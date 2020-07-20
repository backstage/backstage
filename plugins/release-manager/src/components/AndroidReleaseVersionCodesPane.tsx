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
import React, { FC } from 'react';
import { AndroidVersionCode } from '../types';
import { RmExpansionPanel } from './RmExpansionPanel';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import { StatusContainer } from './StatusContainer';
import { InfoIcon } from './InfoIcon';
import { StatusItem } from './StatusItem';

type Props = {
  versionCodes: AndroidVersionCode[];
};

export const AndroidReleaseVersionCodesPane: FC<Props> = ({ versionCodes }) => {
  return (
    <RmExpansionPanel
      status="ok"
      flexDirection="column"
      expandable
      title={
        <StatusContainer>
          <StatusItem>Version Codes</StatusItem>
          <InfoIcon title={<span>Shows the version codes.</span>} />
        </StatusContainer>
      }
    >
      {versionCodes ? (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Version Code</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {versionCodes.map((versionCode, i) => (
              <TableRow key={i}>
                <TableCell>{versionCode}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Typography variant="body2">No version codes present.</Typography>
      )}
    </RmExpansionPanel>
  );
};
