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
import { Typography, TextField, ClickAwayListener } from '@material-ui/core';
import { InfoCard } from '@backstage/core';

type OverviewComponentProps = {
  capabilityId?: string;
  description?: string;
  createdAt?: string;
  baseUrl?: string;
  id?: string;
  token?: string;
};

const OverviewComponent: FC<OverviewComponentProps> = ({
  capabilityId,
  description,
  // createdAt,
  //baseUrl,
  //id,
  //token,
}) => {
  const [descriptionText, setDescription] = React.useState(description);
  const [editingMode, setEditingMode] = React.useState(false);
  return (
    <InfoCard title="Summary">
      <Typography variant="body1">
        <b>Capability ID</b> - {capabilityId}
      </Typography>
      <Typography variant="body1" onClick={() => setEditingMode(true)}>
        <b>Description</b> -{' '}
        {editingMode ? (
          <ClickAwayListener
            onClickAway={async () => {
              setEditingMode(false);
              // await fetch(
              //   `${baseUrl}/api/proxy/dfds-api/capsvc/capabilities/${id}`,
              //   {
              //     method: 'PUT',
              //     headers: {
              //       Authorization: `Bearer ${token}`,
              //       'Content-Type': 'application/json',
              //     },
              //     body: JSON.stringify({
              //       name: capabilityId,
              //       description: descriptionText,
              //     }),
              //   },
              // );
            }}
          >
            <TextField
              variant="outlined"
              size="small"
              value={descriptionText}
              onChange={e => setDescription(e.target.value)}
            />
          </ClickAwayListener>
        ) : (
          descriptionText
        )}
      </Typography>
    </InfoCard>
  );
};

export default OverviewComponent;
