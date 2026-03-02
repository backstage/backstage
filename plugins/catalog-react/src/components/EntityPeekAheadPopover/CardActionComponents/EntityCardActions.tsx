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
import { Info } from 'lucide-react';
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
    <Link
      to={entityRoute(getCompoundEntityRef(props.entity))}
      aria-label={t('entityPeekAheadPopover.entityCardActionsAriaLabel')}
      title={t('entityPeekAheadPopover.entityCardActionsTitle')}
      className="inline-flex items-center justify-center rounded-md w-9 h-9 hover:bg-accent hover:text-accent-foreground transition-colors"
    >
      <Info className="h-4 w-4" />
    </Link>
  );
};
