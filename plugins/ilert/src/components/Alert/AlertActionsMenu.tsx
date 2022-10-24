/*
 * Copyright 2021 The Backstage Authors
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
import { IconButton, Menu, MenuItem, Typography } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import React from 'react';
import { ilertApiRef } from '../../api';
import { useAlertActions } from '../../hooks/useAlertActions';
import { Alert, AlertAction } from '../../types';
import { AlertAssignModal } from './AlertAssignModal';

import { DEFAULT_NAMESPACE, parseEntityRef } from '@backstage/catalog-model';
import { Link, Progress } from '@backstage/core-components';
import {
  alertApiRef,
  identityApiRef,
  useApi,
} from '@backstage/core-plugin-api';

export const AlertActionsMenu = ({
  alert,
  onAlertChanged,
  setIsLoading,
}: {
  alert: Alert;
  onAlertChanged?: (alert: Alert) => void;
  setIsLoading?: (isLoading: boolean) => void;
}) => {
  const ilertApi = useApi(ilertApiRef);
  const alertApi = useApi(alertApiRef);
  const identityApi = useApi(identityApiRef);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const callback = onAlertChanged || ((_: Alert): void => {});
  const setProcessing = setIsLoading || ((_: boolean): void => {});
  const [isAssignAlertModalOpened, setIsAssignAlertModalOpened] =
    React.useState(false);

  const [{ alertActions, isLoading }] = useAlertActions(
    alert,
    Boolean(anchorEl),
  );

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

      const { userEntityRef } = await identityApi.getBackstageIdentity();
      const { name: userName } = parseEntityRef(userEntityRef, {
        defaultKind: 'User',
        defaultNamespace: DEFAULT_NAMESPACE,
      });
      const newAlert = await ilertApi.acceptAlert(alert, userName);
      alertApi.post({ message: 'Alert accepted.' });

      callback(newAlert);
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
      const { userEntityRef } = await identityApi.getBackstageIdentity();
      const { name: userName } = parseEntityRef(userEntityRef, {
        defaultKind: 'User',
        defaultNamespace: DEFAULT_NAMESPACE,
      });
      const newAlert = await ilertApi.resolveAlert(alert, userName);
      alertApi.post({ message: 'Alert resolved.' });

      callback(newAlert);
      setProcessing(false);
    } catch (err) {
      setProcessing(false);
      alertApi.post({ message: err, severity: 'error' });
    }
  };

  const handleAssign = () => {
    handleCloseMenu();
    setIsAssignAlertModalOpened(true);
  };

  const handleTriggerAction = (action: AlertAction) => async () => {
    try {
      handleCloseMenu();
      setProcessing(true);
      await ilertApi.triggerAlertAction(alert, action);
      alertApi.post({ message: 'Alert action triggered.' });
      setProcessing(false);
    } catch (err) {
      setProcessing(false);
      alertApi.post({ message: err, severity: 'error' });
    }
  };

  const actions: React.ReactNode[] = alertActions.map(a => {
    const successTrigger = a.history
      ? a.history.find(h => h.success)
      : undefined;
    const triggeredBy =
      successTrigger && successTrigger.actor
        ? `${successTrigger.actor.firstName} ${successTrigger.actor.lastName}`
        : '';
    return (
      <MenuItem
        key={a.webhookId}
        onClick={handleTriggerAction(a)}
        disabled={!!successTrigger}
      >
        <Typography variant="inherit" noWrap>
          {triggeredBy ? `${a.name} (by ${triggeredBy})` : a.name}
        </Typography>
      </MenuItem>
    );
  });

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
        id={`alert-actions-menu-${alert.id}`}
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        PaperProps={{
          style: { maxHeight: 48 * 5.5 },
        }}
      >
        {alert.status === 'PENDING' ? (
          <MenuItem key="ack" onClick={handleAccept}>
            <Typography variant="inherit" noWrap>
              Accept
            </Typography>
          </MenuItem>
        ) : null}

        {alert.status !== 'RESOLVED' ? (
          <MenuItem key="close" onClick={handleResolve}>
            <Typography variant="inherit" noWrap>
              Resolve
            </Typography>
          </MenuItem>
        ) : null}

        {alert.status !== 'RESOLVED' ? (
          <MenuItem key="assign" onClick={handleAssign}>
            <Typography variant="inherit" noWrap>
              Assign
            </Typography>
          </MenuItem>
        ) : null}

        {isLoading ? (
          <MenuItem key="loading">
            <Progress style={{ width: '100%' }} />
          </MenuItem>
        ) : (
          actions
        )}

        <MenuItem key="details" onClick={handleCloseMenu}>
          <Typography variant="inherit" noWrap>
            <Link to={ilertApi.getAlertDetailsURL(alert)}>View in iLert</Link>
          </Typography>
        </MenuItem>
      </Menu>
      <AlertAssignModal
        alert={alert}
        setIsModalOpened={setIsAssignAlertModalOpened}
        isModalOpened={isAssignAlertModalOpened}
        onAlertChanged={onAlertChanged}
      />
    </>
  );
};
