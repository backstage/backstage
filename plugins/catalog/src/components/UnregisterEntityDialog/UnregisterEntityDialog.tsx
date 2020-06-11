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

import { Entity, LOCATION_ANNOTATION } from '@backstage/catalog-model';
import { Progress, useApi, alertApiRef } from '@backstage/core';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import React, { FC } from 'react';
import { useAsync } from 'react-use';
import { AsyncState } from 'react-use/lib/useAsync';
import { catalogApiRef } from '../../api/types';

type Props = {
  open: boolean;
  onConfirm: () => any;
  onClose: () => any;
  entity: Entity;
};

function useColocatedEntities(entity: Entity): AsyncState<Entity[]> {
  const catalogApi = useApi(catalogApiRef);
  return useAsync(async () => {
    const myLocation = entity.metadata.annotations?.[LOCATION_ANNOTATION];
    return myLocation
      ? await catalogApi.getEntities({ [LOCATION_ANNOTATION]: myLocation })
      : [];
  }, [catalogApi, entity]);
}

export const UnregisterEntityDialog: FC<Props> = ({
  open,
  onConfirm,
  onClose,
  entity,
}) => {
  const { value: entities, loading, error } = useColocatedEntities(entity);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const catalogApi = useApi(catalogApiRef);
  const alertApi = useApi(alertApiRef);

  const removeEntity = async () => {
    const uid = entity.metadata.uid;
    try {
      await catalogApi.removeEntityByUid(uid!);
    } catch (err) {
      alertApi.post({ message: err.message });
    }

    onConfirm();
  };

  return (
    <Dialog fullScreen={fullScreen} open={open} onClose={onClose}>
      <DialogTitle id="responsive-dialog-title">
        Are you sure you want to unregister this entity?
      </DialogTitle>
      <DialogContent>
        {loading ? <Progress /> : null}
        {error ? (
          <Alert severity="error" style={{ wordBreak: 'break-word' }}>
            {error.toString()}
          </Alert>
        ) : null}
        {entities ? (
          <>
            <DialogContentText>
              This action will unregister the following entities:
            </DialogContentText>
            <Typography component="div">
              <ul>
                {entities.map(e => (
                  <li key={e.metadata.name}>{e.metadata.name}</li>
                ))}
              </ul>
            </Typography>
            <DialogContentText>
              That are located at the following location:
            </DialogContentText>
            <Typography component="div">
              <ul>
                <li>
                  {entities[0]?.metadata.annotations?.[LOCATION_ANNOTATION]}
                </li>
              </ul>
            </Typography>
            <DialogContentText>
              To undo, just re-register the entity in Backstage.
            </DialogContentText>
          </>
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button
          disabled={!!(loading || error)}
          onClick={removeEntity}
          color="secondary"
        >
          Unregister
        </Button>
      </DialogActions>
    </Dialog>
  );
};
