/*
 * Copyright 2020 The Backstage Authors
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

import { EntityInfoCard, useEntity } from '@backstage/plugin-catalog-react';
import { Switch } from '@backstage/ui';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { useEffect, useState } from 'react';
import { ComponentsGrid } from './ComponentsGrid';
import { EntityRelationAggregation } from '../types';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import { orgTranslationRef } from '../../../translation';

/** @public */
export type OwnershipCardClassKey = 'grid';

const useStyles = makeStyles(
  () =>
    createStyles({
      grid: {
        overflowY: 'auto',
        marginTop: 0,
      },
    }),
  {
    name: 'PluginOrgOwnershipCard',
  },
);

/** @public */
export const OwnershipCard = (props: {
  entityFilterKind?: string[];
  hideRelationsToggle?: boolean;
  /** @deprecated Please use relationAggregation instead */
  relationsType?: EntityRelationAggregation;
  relationAggregation?: EntityRelationAggregation;
  entityLimit?: number;
}) => {
  const { entityFilterKind, hideRelationsToggle, entityLimit = 6 } = props;
  const relationAggregation = props.relationAggregation ?? props.relationsType;
  const relationsToggle =
    hideRelationsToggle === undefined ? false : hideRelationsToggle;
  const classes = useStyles();
  const { entity } = useEntity();
  const { t } = useTranslationRef(orgTranslationRef);

  const defaultRelationAggregation =
    entity.kind === 'User' ? 'aggregated' : 'direct';
  const [getRelationAggregation, setRelationAggregation] = useState(
    relationAggregation ?? defaultRelationAggregation,
  );

  useEffect(() => {
    if (!relationAggregation) {
      setRelationAggregation(defaultRelationAggregation);
    }
  }, [setRelationAggregation, defaultRelationAggregation, relationAggregation]);

  return (
    <EntityInfoCard
      title={t('ownershipCard.title')}
      headerActions={
        !relationsToggle && (
          <Switch
            isSelected={getRelationAggregation !== 'direct'}
            onChange={isSelected =>
              setRelationAggregation(isSelected ? 'aggregated' : 'direct')
            }
            label={t('ownershipCard.aggregateRelationsToggle.label')}
          />
        )
      }
    >
      <ComponentsGrid
        className={classes.grid}
        entity={entity}
        entityLimit={entityLimit}
        relationAggregation={getRelationAggregation}
        entityFilterKind={entityFilterKind}
      />
    </EntityInfoCard>
  );
};
