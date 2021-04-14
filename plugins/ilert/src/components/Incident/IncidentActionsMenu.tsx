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
import { alertApiRef, useApi } from '@backstage/core';
import { IconButton, Menu, MenuItem, Typography } from '@material-ui/core';
import Link from '@material-ui/core/Link';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { ilertApiRef } from '../../api';
import { Incident } from '../../types';
import { IncidentAssignModal } from './IncidentAssignModal';

export const IncidentActionsMenu = ({
  incident,
  onIncidentChanged,
  setIsLoading,
}: {
  incident: Incident;
  onIncidentChanged?: (incident: Incident) => void;
  setIsLoading?: (isLoading: boolean) => void;
}) => {
  const ilertApi = useApi(ilertApiRef);
  const alertApi = useApi(alertApiRef);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const callback = onIncidentChanged || ((_: Incident): void => {});
  const setProcessing = setIsLoading || ((_: boolean): void => {});
  const [
    isAssignIncidentModalOpened,
    setIsAssignIncidentModalOpened,
  ] = React.useState(false);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleAccept = async (): Promise<void> => {
    try {
      handleCloseMenu();
      setProcessing(true);
      const newIncident = await ilertApi.acceptIncident(incident);
      alertApi.post({ message: 'Incident accepted.' });

      callback(newIncident);
      setProcessing(false);
    } catch (err) {
      setProcessing(false);
      alertApi.post({ message: err, severity: 'error' });
    }
  };

  const handleResolve = async (): Promise<void> => {
    try {
      handleCloseMenu();
      setProcessing(true);
      const newIncident = await ilertApi.resolveIncident(incident);
      alertApi.post({ message: 'Incident resolved.' });

      callback(newIncident);
      setProcessing(false);
    } catch (err) {
      setProcessing(false);
      alertApi.post({ message: err, severity: 'error' });
    }
  };

  const handleAssign = () => {
    handleCloseMenu();
    setIsAssignIncidentModalOpened(true);
  };

  return (
    <>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
        size="small"
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id={`incident-actions-menu-${incident.id}`}
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        PaperProps={{
          style: { maxHeight: 48 * 4.5 },
        }}
      >
        {incident.status === 'PENDING' ? (
          <MenuItem key="ack" onClick={handleAccept}>
            <Typography variant="inherit" noWrap>
              Accept
            </Typography>
          </MenuItem>
        ) : null}

        {incident.status !== 'RESOLVED' ? (
          <MenuItem key="close" onClick={handleResolve}>
            <Typography variant="inherit" noWrap>
              Resolve
            </Typography>
          </MenuItem>
        ) : null}

        {incident.status !== 'RESOLVED' ? (
          <MenuItem key="assign" onClick={handleAssign}>
            <Typography variant="inherit" noWrap>
              Assign
            </Typography>
          </MenuItem>
        ) : null}

        <MenuItem key="details" onClick={handleCloseMenu}>
          <Typography variant="inherit" noWrap>
            <Link href={ilertApi.getIncidentDetailsURL(incident)}>
              View in iLert
            </Link>
          </Typography>
        </MenuItem>
      </Menu>
      <IncidentAssignModal
        incident={incident}
        setIsModalOpened={setIsAssignIncidentModalOpened}
        isModalOpened={isAssignIncidentModalOpened}
        onIncidentChanged={onIncidentChanged}
      />
    </>
  );
};
