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

import { Entity, ORIGIN_LOCATION_ANNOTATION } from '@backstage/catalog-model';
import { alertApiRef, configApiRef, Progress, useApi } from '@backstage/core';
import {
  catalogApiRef,
  formatEntityRefTitle,
} from '@backstage/plugin-catalog-react';
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
import React from 'react';
import { useAsync } from 'react-use';
import { AsyncState } from 'react-use/lib/useAsync';

type Props = {
  open: boolean;
  onConfirm: () => any;
  onClose: () => any;
  entity: Entity;
};

class DeniedLocationException extends Error {
  constructor(public readonly locationName: string) {
    super(`You may not remove the location ${locationName}`);
    this.name = 'DeniedLocationException';
  }
}

function useColocatedEntities(entity: Entity): AsyncState<Entity[]> {
  const catalogApi = useApi(catalogApiRef);
  return useAsync(async () => {
    const myLocation =
      entity.metadata.annotations?.[ORIGIN_LOCATION_ANNOTATION];
    if (!myLocation) {
      return [];
    }

    if (myLocation === 'bootstrap:bootstrap') {
      throw new DeniedLocationException(myLocation);
    }

    const response = await catalogApi.getEntities({
      filter: {
        [`metadata.annotations.${ORIGIN_LOCATION_ANNOTATION}`]: myLocation,
      },
    });
    return response.items;
  }, [catalogApi, entity]);
}

export const UnregisterEntityDialog = ({
  open,
  onConfirm,
  onClose,
  entity,
}: Props) => {
  const { value: entities, loading, error } = useColocatedEntities(entity);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const catalogApi = useApi(catalogApiRef);
  const alertApi = useApi(alertApiRef);
  const configApi = useApi(configApiRef);

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
            {error.name === 'DeniedLocationException' ? (
              <>
                You cannot unregister this entity, since it originates from a
                protected Backstage configuration (location{' '}
                {`"${(error as DeniedLocationException).locationName}"`}). If
                you believe this is in error, please contact the{' '}
                {configApi.getOptionalString('app.title') ?? 'Backstage'}{' '}
                integrator.
              </>
            ) : (
              error.toString()
            )}
          </Alert>
        ) : null}

        {entities?.length ? (
          <>
            <DialogContentText>
              This action will unregister the following entities:
            </DialogContentText>
            <Typography component="div">
              <ul>
                {entities.map(e => {
                  const fullName = formatEntityRefTitle(e);
                  return <li key={fullName}>{fullName}</li>;
                })}
              </ul>
            </Typography>
            <DialogContentText>
              That are located at the following location:
            </DialogContentText>
            <Typography component="div">
              <ul style={{ wordBreak: 'break-word' }}>
                <li>
                  {
                    entities[0]?.metadata.annotations?.[
                      ORIGIN_LOCATION_ANNOTATION
                    ]
                  }
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
