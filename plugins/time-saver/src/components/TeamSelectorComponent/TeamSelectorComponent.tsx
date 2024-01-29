/*
 * Copyright 2024 The Backstage Authors
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
import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useEffect, useState } from 'react';
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import CircularProgress from '@mui/material/CircularProgress';
import { Button, Grid } from '@material-ui/core';

interface TeamSelectorProps {
  onTeamChange: (team: string) => void;
  onClearButtonClick?: () => void;
}

type GroupsResponse = {
  groups: string[];
};

export default function TeamSelector({
  onTeamChange,
  onClearButtonClick,
}: TeamSelectorProps) {
  const [team, setTeam] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    const selectedTeam = event.target.value as string;
    setTeam(selectedTeam);
    onTeamChange(selectedTeam);
  };

  const handleClearClick = () => {
    setTeam('');
    onClearButtonClick?.();
  };

  const [data, setData] = useState<GroupsResponse | null>(null);
  const configApi = useApi(configApiRef);

  useEffect(() => {
    fetch(`${configApi.getString('backend.baseUrl')}/api/time-saver/groups`)
      .then(response => response.json())
      .then(dt => setData(dt))
      .catch();
  }, [configApi, onTeamChange]);

  if (!data) {
    return <CircularProgress />;
  }

  const groups = data.groups;
  return (
    <Box sx={{ minWidth: 360 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Team</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={team}
          label="Team"
          onChange={handleChange}
        >
          {groups.map(group => (
            <MenuItem key={group} value={group}>
              {group}
            </MenuItem>
          ))}
        </Select>
        {onClearButtonClick && (
          <Grid xs={2}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleClearClick}
            >
              Clear
            </Button>
          </Grid>
        )}
      </FormControl>
    </Box>
  );
}
