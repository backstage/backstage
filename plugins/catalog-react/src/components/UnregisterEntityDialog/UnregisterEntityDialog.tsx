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

import { CompoundEntityRef, Entity } from '@backstage/catalog-model';
import { EntityRefLink } from '../EntityRefLink';
import { makeStyles } from '@material-ui/core/styles';
import { ReactNode, useCallback, useState } from 'react';
import {
  UseUnregisterEntityDialogState,
  useUnregisterEntityDialogState,
} from './useUnregisterEntityDialogState';

import { alertApiRef, configApiRef, useApi } from '@backstage/core-plugin-api';
import { Progress, ResponseErrorPanel } from '@backstage/core-components';
import { assertError } from '@backstage/errors';
import { catalogReactTranslationRef } from '../../translation';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import {
  Accordion,
  AccordionPanel,
  AccordionTrigger,
  Alert,
  Box,
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Text,
} from '@backstage/ui';

const useStyles = makeStyles({
  bodyContent: {
    overflowWrap: 'break-word',
  },
});

type DialogHandlers = {
  state: UseUnregisterEntityDialogState;
  busyAction: 'unregister' | 'delete' | null;
  onUnregister: () => Promise<void>;
  onDelete: () => Promise<void>;
  onClose: () => void;
};

function useUnregisterDialogHandlers(
  entity: Entity,
  onConfirm: () => void,
  onClose: () => void,
): DialogHandlers {
  const alertApi = useApi(alertApiRef);
  const state = useUnregisterEntityDialogState(entity);
  const [busyAction, setBusyAction] = useState<'unregister' | 'delete' | null>(
    null,
  );
  const { t } = useTranslationRef(catalogReactTranslationRef);

  const onUnregister = useCallback(async () => {
    if ('unregisterLocation' in state) {
      setBusyAction('unregister');
      try {
        await state.unregisterLocation();
        onConfirm();
      } catch (err) {
        assertError(err);
        alertApi.post({ message: err.message });
      } finally {
        setBusyAction(null);
      }
    }
  }, [alertApi, onConfirm, state]);

  const onDelete = useCallback(async () => {
    if ('deleteEntity' in state) {
      setBusyAction('delete');
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
        setBusyAction(null);
      }
    }
  }, [alertApi, onConfirm, state, entity, t]);

  return { state, busyAction, onUnregister, onDelete, onClose };
}

function AdvancedDeleteAccordion({
  triggerTitle,
  description,
  onDelete,
  busyAction,
}: {
  triggerTitle: string;
  description: string;
  onDelete: () => void;
  busyAction: 'unregister' | 'delete' | null;
}) {
  const { t } = useTranslationRef(catalogReactTranslationRef);

  return (
    <Box mt="4">
      <Accordion>
        <AccordionTrigger title={triggerTitle} />
        <AccordionPanel>
          <Text as="p">{description}</Text>
          <Box mt="4">
            <Button
              variant="primary"
              destructive
              loading={busyAction === 'delete'}
              isDisabled={busyAction !== null && busyAction !== 'delete'}
              onPress={onDelete}
            >
              {t('unregisterEntityDialog.deleteButtonTitle')}
            </Button>
          </Box>
        </AccordionPanel>
      </Accordion>
    </Box>
  );
}

function BootstrapBody({
  location,
  appTitle,
  onDelete,
  busyAction,
}: {
  location: string;
  appTitle: string;
  onDelete: () => void;
  busyAction: 'unregister' | 'delete' | null;
}) {
  const { t } = useTranslationRef(catalogReactTranslationRef);

  return (
    <>
      <Alert
        status="info"
        icon
        description={t('unregisterEntityDialog.bootstrapState.title', {
          appTitle,
          location,
        })}
      />
      <AdvancedDeleteAccordion
        triggerTitle={t(
          'unregisterEntityDialog.bootstrapState.advancedOptions',
        )}
        description={t(
          'unregisterEntityDialog.bootstrapState.advancedDescription',
        )}
        onDelete={onDelete}
        busyAction={busyAction}
      />
    </>
  );
}

function OnlyDeleteBody() {
  const { t } = useTranslationRef(catalogReactTranslationRef);

  return <Text as="p">{t('unregisterEntityDialog.onlyDeleteStateTitle')}</Text>;
}

function UnregisterBody({
  state,
  appTitle,
  onDelete,
  busyAction,
}: {
  state: Extract<UseUnregisterEntityDialogState, { type: 'unregister' }>;
  appTitle: string;
  onDelete: () => void;
  busyAction: 'unregister' | 'delete' | null;
}) {
  const { t } = useTranslationRef(catalogReactTranslationRef);

  return (
    <>
      <Text as="p">{t('unregisterEntityDialog.unregisterState.title')}</Text>
      <ul>
        {state.colocatedEntities.map((e: CompoundEntityRef) => (
          <li key={`${e.kind}:${e.namespace}/${e.name}`}>
            <EntityRefLink entityRef={e} />
          </li>
        ))}
      </ul>
      <Text as="p">{t('unregisterEntityDialog.unregisterState.subTitle')}</Text>
      <ul>
        <li>{state.location}</li>
      </ul>
      <Text as="p">
        {t('unregisterEntityDialog.unregisterState.description', {
          appTitle,
        })}
      </Text>
      <AdvancedDeleteAccordion
        triggerTitle={t(
          'unregisterEntityDialog.unregisterState.advancedOptions',
        )}
        description={t(
          'unregisterEntityDialog.unregisterState.advancedDescription',
        )}
        onDelete={onDelete}
        busyAction={busyAction}
      />
    </>
  );
}

function useDialogContent(
  handlers: DialogHandlers,
  appTitle: string,
): { body: ReactNode; actionButton: ReactNode | null } {
  const { t } = useTranslationRef(catalogReactTranslationRef);
  const { state, busyAction, onUnregister, onDelete } = handlers;

  switch (state.type) {
    case 'loading':
      return { body: <Progress />, actionButton: null };
    case 'error':
      return {
        body: <ResponseErrorPanel error={state.error} />,
        actionButton: null,
      };
    case 'bootstrap':
      return {
        body: (
          <BootstrapBody
            location={state.location}
            appTitle={appTitle}
            onDelete={onDelete}
            busyAction={busyAction}
          />
        ),
        actionButton: null,
      };
    case 'only-delete':
      return {
        body: <OnlyDeleteBody />,
        actionButton: (
          <Button
            variant="primary"
            destructive
            loading={busyAction === 'delete'}
            isDisabled={busyAction !== null && busyAction !== 'delete'}
            onPress={onDelete}
          >
            {t('unregisterEntityDialog.deleteButtonTitle')}
          </Button>
        ),
      };
    case 'unregister':
      return {
        body: (
          <UnregisterBody
            state={state}
            appTitle={appTitle}
            onDelete={onDelete}
            busyAction={busyAction}
          />
        ),
        actionButton: (
          <Button
            variant="primary"
            destructive
            loading={busyAction === 'unregister'}
            isDisabled={busyAction !== null && busyAction !== 'unregister'}
            onPress={onUnregister}
          >
            {t('unregisterEntityDialog.unregisterState.unregisterButtonTitle')}
          </Button>
        ),
      };
    default:
      return {
        body: (
          <Alert
            status="danger"
            description={t('unregisterEntityDialog.errorStateTitle')}
          />
        ),
        actionButton: null,
      };
  }
}

/** @public */
export type UnregisterEntityDialogProps = {
  open: boolean;
  onConfirm: () => any;
  onClose: () => any;
  entity: Entity;
};

function DialogContents({
  entity,
  onConfirm,
  onClose,
}: {
  entity: Entity;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const classes = useStyles();
  const { t } = useTranslationRef(catalogReactTranslationRef);
  const configApi = useApi(configApiRef);
  const appTitle = configApi.getOptionalString('app.title') ?? 'Backstage';

  const handlers = useUnregisterDialogHandlers(entity, onConfirm, onClose);
  const { body, actionButton } = useDialogContent(handlers, appTitle);

  return (
    <>
      <DialogHeader>{t('unregisterEntityDialog.title')}</DialogHeader>
      <DialogBody className={classes.bodyContent}>{body}</DialogBody>
      <DialogFooter>
        <Button variant="secondary" onPress={onClose}>
          {t('unregisterEntityDialog.cancelButtonTitle')}
        </Button>
        {actionButton}
      </DialogFooter>
    </>
  );
}

/** @public */
export const UnregisterEntityDialog = (props: UnregisterEntityDialogProps) => {
  const { open, onConfirm, onClose, entity } = props;

  return (
    <Dialog
      isOpen={open}
      onOpenChange={isOpen => !isOpen && onClose()}
      width={600}
    >
      {open && (
        <DialogContents
          entity={entity}
          onConfirm={onConfirm}
          onClose={onClose}
        />
      )}
    </Dialog>
  );
};
