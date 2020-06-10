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
import { Progress, useApi } from '@backstage/core';
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
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import React, { FC } from 'react';
import { useAsync } from 'react-use';
import { AsyncState } from 'react-use/lib/useAsync';
import { catalogApiRef } from '../../api/types';

type ComponentRemovalDialogProps = {
  onConfirm: () => any;
  onCancel: () => any;
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

export const ComponentRemovalDialog: FC<ComponentRemovalDialogProps> = ({
  onConfirm,
  onCancel,
  onClose,
  entity,
}) => {
  const catalogApi = useApi(catalogApiRef);
  const alertApi = useApi(alertApiRef);
  const { value: entities, loading, error } = useColocatedEntities(entity);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Dialog fullScreen={fullScreen} open onClose={onClose}>
      <DialogTitle id="responsive-dialog-title">
        Are you sure you want to unregister this component?
      </DialogTitle>
      <DialogContent>
        {loading ? <Progress /> : null}
        {error ? (
          <DialogContentText>{error.toString()}</DialogContentText>
        ) : null}
        {entities ? (
          <>
            <DialogContentText>
              This action will unregister the following entities:
            </DialogContentText>
            <List dense>
              {entities.map(e => (
                <ListItem key={e.metadata.name}>
                  <ListItemText primary={e.metadata.name} />
                </ListItem>
              ))}
            </List>
            <DialogContentText>
              That are located at the following location:
            </DialogContentText>
            <List dense>
              <ListItem>
                <ListItemText
                  primary={
                    entities[0]?.metadata?.annotations?.[LOCATION_ANNOTATION]
                  }
                />
              </ListItem>
            </List>
            <DialogContentText>
              To undo, just re-register the component in Backstage.
            </DialogContentText>
          </>
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary">
          Cancel
        </Button>
        <Button
          disabled={!!(loading || error)}
          onClick={async () => {
            const uid = entity.metadata?.uid;
            if (uid) {
              try {
                await catalogApi.removeEntityByUid(uid);
              } catch (err) {
                alertApi.post({ message: err.message });
              }
            } else {
              alertApi.post({ message: `No entity with UID ${uid}` });
            }

            onConfirm();
          }}
          color="primary"
        >
          Unregister
        </Button>
      </DialogActions>
    </Dialog>
  );
};
