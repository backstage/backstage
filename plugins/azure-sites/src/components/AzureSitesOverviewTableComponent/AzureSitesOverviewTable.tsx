/*
 * Copyright 2022 The Backstage Authors
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

import React, { Dispatch, useEffect, useState } from 'react';
import {
  Box,
  Card,
  IconButton,
  LinearProgress,
  Menu,
  MenuItem,
  Snackbar,
  Tooltip,
} from '@material-ui/core';
import { default as MuiAlert } from '@material-ui/lab/Alert';
import { AzureSite } from '@backstage/plugin-azure-sites-common';
import { Table, TableColumn, Link } from '@backstage/core-components';
import FlashOnIcon from '@material-ui/icons/FlashOn';
import PublicIcon from '@material-ui/icons/Public';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import StartIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
import Typography from '@material-ui/core/Typography';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { DateTime } from 'luxon';
import { useApi } from '@backstage/core-plugin-api';
import { azureSiteApiRef } from '../../api';

type States = 'Waiting' | 'Running' | 'Paused' | 'Failed' | 'Stopped';
type Kinds = 'app' | 'functionapp';

const State = ({ value }: { value: States }) => {
  const colorMap = {
    Waiting: '#dcbc21',
    Running: 'green',
    Paused: 'black',
    Failed: 'red',
    Stopped: 'black',
  };
  return (
    <Box display="flex" alignItems="center">
      <Typography
        component="span"
        style={{
          display: 'block',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: colorMap[value],
          marginRight: '5px',
        }}
      />
      {value}
    </Box>
  );
};

const Kind = ({ value }: { value: Kinds }) => {
  const iconMap = {
    app: <PublicIcon />,
    functionapp: <FlashOnIcon />,
  };
  return (
    <Box display="flex" alignItems="center">
      <Tooltip title={value}>{iconMap[value]}</Tooltip>
    </Box>
  );
};

type TableProps = {
  data: AzureSite[];
  loading: boolean;
};

const ActionButtons = ({
  value,
  onMenuItemClick,
}: {
  value: AzureSite;
  onMenuItemClick: Dispatch<React.SetStateAction<string | null>>;
}) => {
  const azureApi = useApi(azureSiteApiRef);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const start = () => {
    azureApi.start({
      name: value.name,
      resourceGroup: value.resourceGroup,
      subscription: value.subscription,
    });
    onMenuItemClick('Starting, this may take some time...');
    handleClose();
  };
  const stop = () => {
    azureApi.stop({
      name: value.name,
      resourceGroup: value.resourceGroup,
      subscription: value.subscription,
    });
    onMenuItemClick('Stopping, this may take some time...');
    handleClose();
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleOpen}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: 48 * 4.5,
            width: '20ch',
          },
        }}
      >
        {value.state !== 'Running' && (
          <MenuItem key="start" onClick={start}>
            <StartIcon />
            &nbsp;Start
          </MenuItem>
        )}
        {value.state !== 'Stopped' && (
          <MenuItem key="stop" onClick={stop}>
            <StopIcon />
            &nbsp;Stop
          </MenuItem>
        )}
        <MenuItem
          component="a"
          href={value.logstreamHref}
          target="_blank"
          key="logStream"
          onClick={handleClose}
        >
          <OpenInNewIcon />
          &nbsp;Log Stream
        </MenuItem>
      </Menu>
    </div>
  );
};

/** @public */
export const AzureSitesOverviewTable = ({ data, loading }: TableProps) => {
  const [snackbarMessage, setSnackbarMessage] = useState<null | string>(null);
  const [isSnackbarOpen, setSnackbarOpen] = useState(false);

  const onSnackbarClose = () => {
    setSnackbarMessage(null);
  };

  useEffect(() => {
    setSnackbarOpen(!!snackbarMessage);
  }, [snackbarMessage]);

  const columns: TableColumn<AzureSite>[] = [
    {
      width: '25px',
      field: 'kind',
      render: (func: AzureSite) => <Kind value={func.kind as Kinds} />,
    },
    {
      title: 'name',
      field: 'name',
      highlight: true,
      render: (func: AzureSite) => {
        return <Link to={func.href}>{func.name}</Link>;
      },
    },
    {
      title: 'location',
      field: 'location',
      render: (func: AzureSite) => func.location ?? 'unknown',
    },
    {
      title: 'status',
      field: 'status',
      render: (func: AzureSite) => <State value={func.state as States} />,
    },
    {
      title: 'last modified',
      field: 'lastModifiedDate',
      render: (func: AzureSite) =>
        DateTime.fromISO(func.lastModifiedDate).toLocaleString(
          DateTime.DATETIME_MED,
        ),
    },
    {
      title: 'actions',
      align: 'right',
      sorting: false,
      field: 'actions',
      render: (func: AzureSite) => (
        <ActionButtons value={func} onMenuItemClick={setSnackbarMessage} />
      ),
    },
  ];

  const tableStyle = {
    minWidth: '0',
    width: '100%',
  };

  return (
    <Card style={tableStyle}>
      <Table
        title={
          <Box display="flex" alignItems="center">
            <FlashOnIcon style={{ fontSize: 30 }} />
            <Box mr={1} />
            Azure Sites
          </Box>
        }
        options={{ paging: true, search: false, pageSize: 10 }}
        data={data}
        emptyContent={<LinearProgress />}
        isLoading={loading}
        columns={columns}
      />
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={6_000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        onClose={onSnackbarClose}
      >
        <MuiAlert onClose={onSnackbarClose} severity="info">
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </Card>
  );
};
