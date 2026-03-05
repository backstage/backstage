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
import { ReactNode, useCallback, useState } from 'react';
import {
  UseUnregisterEntityDialogState,
  useUnregisterEntityDialogState,
} from './useUnregisterEntityDialogState';

import { alertApiRef, configApiRef, useApi } from '@backstage/core-plugin-api';
import {
  Progress,
  ResponseErrorPanel,
  // shadcn/ui Dialog primitives (conflict-safe names)
  ShadcnDialog,
  ShadcnDialogContent,
  ShadcnDialogTitle,
  DialogHeader,
  DialogFooter,
  DialogDescription,
  // shadcn/ui Accordion primitives
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  // shadcn/ui Alert
  Alert,
  AlertDescription,
  // shadcn/ui Button (aliased from ShadcnButton to avoid barrel collision with LinkButton)
  ShadcnButton as Button,
  // Tailwind class composition utility
  cn,
} from '@backstage/core-components';
import { assertError } from '@backstage/errors';
import { catalogReactTranslationRef } from '../../translation';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';

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
    <div className="mt-4">
      <Accordion type="single" collapsible>
        <AccordionItem value="advanced">
          <AccordionTrigger>{triggerTitle}</AccordionTrigger>
          <AccordionContent>
            <p className="text-sm">{description}</p>
            <div className="mt-4">
              <Button
                variant="destructive"
                disabled={busyAction !== null && busyAction !== 'delete'}
                onClick={onDelete}
              >
                {busyAction === 'delete'
                  ? '...'
                  : t('unregisterEntityDialog.deleteButtonTitle')}
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
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
      <Alert variant="info">
        <AlertDescription>
          {t('unregisterEntityDialog.bootstrapState.title', {
            appTitle,
            location,
          })}
        </AlertDescription>
      </Alert>
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

  return (
    <p className="text-sm">
      {t('unregisterEntityDialog.onlyDeleteStateTitle')}
    </p>
  );
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
      <p className="text-sm">
        {t('unregisterEntityDialog.unregisterState.title')}
      </p>
      <ul>
        {state.colocatedEntities.map((e: CompoundEntityRef) => (
          <li key={`${e.kind}:${e.namespace}/${e.name}`}>
            <EntityRefLink entityRef={e} />
          </li>
        ))}
      </ul>
      <p className="text-sm">
        {t('unregisterEntityDialog.unregisterState.subTitle')}
      </p>
      <ul>
        <li>{state.location}</li>
      </ul>
      <p className="text-sm">
        {t('unregisterEntityDialog.unregisterState.description', {
          appTitle,
        })}
      </p>
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
            variant="destructive"
            disabled={busyAction !== null && busyAction !== 'delete'}
            onClick={onDelete}
          >
            {busyAction === 'delete'
              ? '...'
              : t('unregisterEntityDialog.deleteButtonTitle')}
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
            variant="destructive"
            disabled={busyAction !== null && busyAction !== 'unregister'}
            onClick={onUnregister}
          >
            {busyAction === 'unregister'
              ? '...'
              : t(
                  'unregisterEntityDialog.unregisterState.unregisterButtonTitle',
                )}
          </Button>
        ),
      };
    default:
      return {
        body: (
          <Alert variant="destructive">
            <AlertDescription>
              {t('unregisterEntityDialog.errorStateTitle')}
            </AlertDescription>
          </Alert>
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
  const { t } = useTranslationRef(catalogReactTranslationRef);
  const configApi = useApi(configApiRef);
  const appTitle = configApi.getOptionalString('app.title') ?? 'Backstage';

  const handlers = useUnregisterDialogHandlers(entity, onConfirm, onClose);
  const { body, actionButton } = useDialogContent(handlers, appTitle);

  return (
    <>
      <DialogHeader>
        <ShadcnDialogTitle>
          {t('unregisterEntityDialog.title')}
        </ShadcnDialogTitle>
        <DialogDescription className="sr-only">
          {t('unregisterEntityDialog.title')}
        </DialogDescription>
      </DialogHeader>
      <div className={cn('break-words', 'px-6 py-4')}>{body}</div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
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
    <ShadcnDialog open={open} onOpenChange={isOpen => !isOpen && onClose()}>
      <ShadcnDialogContent className="max-w-[600px]">
        {open && (
          <DialogContents
            entity={entity}
            onConfirm={onConfirm}
            onClose={onClose}
          />
        )}
      </ShadcnDialogContent>
    </ShadcnDialog>
  );
};
