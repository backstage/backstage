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
import React, { ChangeEvent, FC } from 'react';
import { AndroidReleaseNote } from '../types';
import { RmExpansionPanel } from './RmExpansionPanel';
import { TextField, Typography } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { Spacer } from './Spacer';
import { StatusContainer } from './StatusContainer';
import { InfoIcon } from './InfoIcon';
import { StatusItem } from './StatusItem';
import { getAndroidReleaseNotesStatus } from '../utils/status';

type Props = {
  releaseNotes: AndroidReleaseNote[];
};

export const AndroidReleaseNotesPane: FC<Props> = ({ releaseNotes }) => {
  const status = getAndroidReleaseNotesStatus(releaseNotes) || 'loading';
  const [value, setValue] = React.useState<AndroidReleaseNote | null>(
    (releaseNotes && releaseNotes[0]) || null,
  );

  return (
    <RmExpansionPanel
      flexDirection="column"
      expandable
      title={
        <StatusContainer>
          <StatusItem>Release Notes</StatusItem>
          <InfoIcon
            title={
              <span>
                Shows the release notes for all languages that are available.
              </span>
            }
          />
        </StatusContainer>
      }
      status={status}
    >
      {releaseNotes ? (
        <>
          <Autocomplete
            value={value}
            onChange={(
              _event: ChangeEvent<{}>,
              newValue: React.SetStateAction<AndroidReleaseNote | null>,
            ) => {
              setValue(newValue);
            }}
            options={releaseNotes}
            getOptionLabel={option => option.language}
            defaultValue={releaseNotes[0]}
            renderInput={params => (
              <TextField {...params} label="Language" variant="outlined" />
            )}
          />
          <Spacer spacing={2} />
          <Typography variant="body2">{value && value.text}</Typography>
        </>
      ) : (
        <Typography variant="body2">No release notes present.</Typography>
      )}
    </RmExpansionPanel>
  );
};
