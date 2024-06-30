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

import { entityRouteRef } from '../../../routes';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import React from 'react';
import { useRouteRef } from '@backstage/core-plugin-api';
import { Entity, getCompoundEntityRef } from '@backstage/catalog-model';
import { Link } from '@backstage/core-components';
import { catalogReactTranslationRef } from '../../../translation';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';

/**
 * Card actions that show for all entities
 *
 * @private
 */
export const EntityCardActions = (props: { entity: Entity }) => {
  const entityRoute = useRouteRef(entityRouteRef);
  const { t } = useTranslationRef(catalogReactTranslationRef);

  return (
    <IconButton
      component={Link}
      aria-label="Show"
      title={t('entityPeekAheadPopover.entityCardActionsTitle')}
      to={entityRoute(getCompoundEntityRef(props.entity))}
    >
      <InfoIcon />
    </IconButton>
  );
};
