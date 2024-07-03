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

import { Entity } from '@backstage/catalog-model';
import { EntityRefLink } from '../EntityRefLink';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import React, { useCallback, useState } from 'react';
import { useUnregisterEntityDialogState } from './useUnregisterEntityDialogState';

import { alertApiRef, configApiRef, useApi } from '@backstage/core-plugin-api';
import { Progress, ResponseErrorPanel } from '@backstage/core-components';
import { assertError } from '@backstage/errors';
import { catalogReactTranslationRef } from '../../translation';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';

const useStyles = makeStyles({
  advancedButton: {
    fontSize: '0.7em',
  },
  dialogActions: {
    display: 'inline-block',
  },
});

const Contents = ({
  entity,
  onConfirm,
  onClose,
}: {
  entity: Entity;
  onConfirm: () => any;
  onClose: () => any;
}) => {
  const alertApi = useApi(alertApiRef);
  const configApi = useApi(configApiRef);
  const classes = useStyles();
  const state = useUnregisterEntityDialogState(entity);
  const [showDelete, setShowDelete] = useState(false);
  const [busy, setBusy] = useState(false);
  const appTitle = configApi.getOptionalString('app.title') ?? 'Backstage';
  const { t } = useTranslationRef(catalogReactTranslationRef);

  const onUnregister = useCallback(
    async function onUnregisterFn() {
      if ('unregisterLocation' in state) {
        setBusy(true);
        try {
          await state.unregisterLocation();
          onConfirm();
        } catch (err) {
          assertError(err);
          alertApi.post({ message: err.message });
        } finally {
          setBusy(false);
        }
      }
    },
    [alertApi, onConfirm, state],
  );

  const onDelete = useCallback(
    async function onDeleteFn() {
      if ('deleteEntity' in state) {
        setBusy(true);
        try {
          await state.deleteEntity();
          const entityName = entity.metadata.title ?? entity.metadata.name;
          onConfirm();
          alertApi.post({
            message: t('unregisterEntityDialog.deleteEntitySuccessMessage', {
              entityName,
            }),
            severity: 'success',
            display: 'transient',
          });
        } catch (err) {
          assertError(err);
          alertApi.post({ message: err.message });
        } finally {
          setBusy(false);
        }
      }
    },
    [alertApi, onConfirm, state, entity, t],
  );

  const DialogActionsPanel = () => (
    <DialogActions className={classes.dialogActions}>
      <Button onClick={onClose} color="primary">
        {t('unregisterEntityDialog.cancelButtonTitle')}
      </Button>
    </DialogActions>
  );

  if (state.type === 'loading') {
    return <Progress />;
  }

  if (state.type === 'error') {
    return <ResponseErrorPanel error={state.error} />;
  }

  if (state.type === 'bootstrap') {
    return (
      <>
        <Alert severity="info">
          {t('unregisterEntityDialog.bootstrapState.title', {
            appTitle,
            location: state.location,
          })}
        </Alert>

        <Box marginTop={2}>
          {!showDelete && (
            <>
              <Button
                variant="text"
                size="small"
                color="primary"
                className={classes.advancedButton}
                onClick={() => setShowDelete(true)}
              >
                {t('unregisterEntityDialog.bootstrapState.advancedOptions')}
              </Button>
              <DialogActionsPanel />
            </>
          )}

          {showDelete && (
            <>
              <DialogContentText>
                {t('unregisterEntityDialog.bootstrapState.advancedDescription')}
              </DialogContentText>
              <Button
                variant="contained"
                color="secondary"
                disabled={busy}
                onClick={onDelete}
              >
                {t('unregisterEntityDialog.deleteButtonTitle')}
              </Button>
              <DialogActionsPanel />
            </>
          )}
        </Box>
      </>
    );
  }

  if (state.type === 'only-delete') {
    return (
      <>
        <DialogContentText>
          {t('unregisterEntityDialog.onlyDeleteStateTitle')}
        </DialogContentText>
        <Button
          variant="contained"
          color="secondary"
          disabled={busy}
          onClick={onDelete}
        >
          {t('unregisterEntityDialog.deleteButtonTitle')}
        </Button>
        <DialogActionsPanel />
      </>
    );
  }

  if (state.type === 'unregister') {
    return (
      <>
        <DialogContentText>
          {t('unregisterEntityDialog.unregisterState.title')}
        </DialogContentText>
        <DialogContentText component="ul">
          {state.colocatedEntities.map(e => (
            <li key={`${e.kind}:${e.namespace}/${e.name}`}>
              <EntityRefLink entityRef={e} />
            </li>
          ))}
        </DialogContentText>
        <DialogContentText>
          {t('unregisterEntityDialog.unregisterState.subTitle')}
        </DialogContentText>
        <DialogContentText component="ul">
          <li>{state.location}</li>
        </DialogContentText>
        <DialogContentText>
          {t('unregisterEntityDialog.unregisterState.description', {
            appTitle,
          })}
        </DialogContentText>
        <Box marginTop={2}>
          <Button
            variant="contained"
            color="secondary"
            disabled={busy}
            onClick={onUnregister}
          >
            {t('unregisterEntityDialog.unregisterState.unregisterButtonTitle')}
          </Button>
          {!showDelete && (
            <Box component="span" marginLeft={2}>
              <Button
                variant="text"
                size="small"
                color="primary"
                className={classes.advancedButton}
                onClick={() => setShowDelete(true)}
              >
                {t('unregisterEntityDialog.unregisterState.advancedOptions')}
              </Button>
            </Box>
          )}
        </Box>

        {showDelete && (
          <>
            <Box paddingTop={4} paddingBottom={4}>
              <Divider />
            </Box>
            <DialogContentText>
              {t('unregisterEntityDialog.unregisterState.advancedDescription')}
            </DialogContentText>
            <Button
              variant="contained"
              color="secondary"
              disabled={busy}
              onClick={onDelete}
            >
              {t('unregisterEntityDialog.deleteButtonTitle')}
            </Button>
          </>
        )}
      </>
    );
  }

  return (
    <Alert severity="error">
      {t('unregisterEntityDialog.errorStateTitle')}
    </Alert>
  );
};

/** @public */
export type UnregisterEntityDialogProps = {
  open: boolean;
  onConfirm: () => any;
  onClose: () => any;
  entity: Entity;
};

/** @public */
export const UnregisterEntityDialog = (props: UnregisterEntityDialogProps) => {
  const { open, onConfirm, onClose, entity } = props;
  const { t } = useTranslationRef(catalogReactTranslationRef);
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle id="responsive-dialog-title">
        {t('unregisterEntityDialog.title')}
      </DialogTitle>
      <DialogContent>
        <Contents entity={entity} onConfirm={onConfirm} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
};
