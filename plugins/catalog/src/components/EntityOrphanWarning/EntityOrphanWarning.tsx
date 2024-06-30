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
import { useEntity } from '@backstage/plugin-catalog-react';
import Alert from '@material-ui/lab/Alert';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DeleteEntityDialog } from './DeleteEntityDialog';
import { useRouteRef } from '@backstage/core-plugin-api';
import { rootRouteRef } from '../../routes';
import { catalogTranslationRef } from '../../translation';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';

/**
 * Returns true if the given entity has the orphan annotation given by the
 * catalog.
 *
 * @public
 */
export function isOrphan(entity: Entity): boolean {
  return entity?.metadata?.annotations?.['backstage.io/orphan'] === 'true';
}

/**
 * Displays a warning alert if the entity is marked as orphan with the ability
 * to delete said entity.
 *
 * @public
 */
export function EntityOrphanWarning() {
  const navigate = useNavigate();
  const catalogLink = useRouteRef(rootRouteRef);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const { entity } = useEntity();
  const { t } = useTranslationRef(catalogTranslationRef);

  const cleanUpAfterRemoval = async () => {
    setConfirmationDialogOpen(false);
    navigate(catalogLink());
  };

  return (
    <>
      <Alert severity="warning" onClick={() => setConfirmationDialogOpen(true)}>
        {t('deleteEntity.description')}
      </Alert>
      <DeleteEntityDialog
        open={confirmationDialogOpen}
        entity={entity!}
        onConfirm={cleanUpAfterRemoval}
        onClose={() => setConfirmationDialogOpen(false)}
      />
    </>
  );
}
