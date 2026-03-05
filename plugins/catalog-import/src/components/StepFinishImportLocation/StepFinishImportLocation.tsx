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

import { CompoundEntityRef, DEFAULT_NAMESPACE } from '@backstage/catalog-model';
import { Link } from '@backstage/core-components';
import { useRouteRef } from '@backstage/core-plugin-api';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import { entityRouteRef } from '@backstage/plugin-catalog-react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import partition from 'lodash/partition';

import { catalogImportTranslationRef } from '../../translation';
import { BackButton, ViewComponentButton } from '../Buttons';
import { EntityListComponent } from '../EntityListComponent';
import { PrepareResult } from '../useImportState';

type Props = {
  prepareResult: PrepareResult;
  onReset: () => void;
};

// Among the newly registered entities, return a software entity (e.g. Component, API, Resource)
const filterComponentEntity = (
  newLocations: Array<{
    exists?: boolean;
    target: string;
    entities: CompoundEntityRef[];
  }>,
): CompoundEntityRef | null => {
  for (const location of newLocations) {
    for (const entity of location.entities) {
      if (
        ['component', 'api', 'resource'].includes(
          entity.kind.toLocaleLowerCase('en-US'),
        )
      ) {
        return {
          kind: entity.kind.toLocaleLowerCase('en-US'),
          namespace:
            entity.namespace?.toLocaleLowerCase('en-US') ?? DEFAULT_NAMESPACE,
          name: entity.name,
        };
      }
    }
  }

  return null;
};

export const StepFinishImportLocation = ({ prepareResult, onReset }: Props) => {
  const { t } = useTranslationRef(catalogImportTranslationRef);
  const entityRoute = useRouteRef(entityRouteRef);

  if (prepareResult.type === 'repository') {
    return (
      <>
        <Typography paragraph>
          {t('stepFinishImportLocation.repository.title')}
          <Link
            to={prepareResult.pullRequest.url}
            target="_blank"
            rel="noreferrer"
          >
            {prepareResult.pullRequest.url}
          </Link>
        </Typography>
        <Typography paragraph>
          {t('stepFinishImportLocation.repository.description')}
        </Typography>
        <Grid container spacing={0}>
          <BackButton onClick={onReset}>
            {t('stepFinishImportLocation.backButtonText')}
          </BackButton>
        </Grid>
      </>
    );
  }

  const [existingLocations, newLocations] = partition(
    prepareResult.locations,
    l => l.exists,
  );
  const newComponentEntity = filterComponentEntity(newLocations);
  return (
    <>
      {newLocations.length > 0 && (
        <>
          <Typography>{t('stepFinishImportLocation.locations.new')}</Typography>

          <EntityListComponent
            locations={newLocations}
            locationListItemIcon={() => <LocationOnIcon />}
            withLinks
          />
        </>
      )}
      {existingLocations.length > 0 && (
        <>
          <Typography>
            {t('stepFinishImportLocation.locations.existing')}
          </Typography>

          <EntityListComponent
            locations={existingLocations}
            locationListItemIcon={() => <LocationOnIcon />}
            withLinks
          />
        </>
      )}
      <Grid container spacing={0}>
        {newComponentEntity && (
          <ViewComponentButton to={entityRoute(newComponentEntity)}>
            {t('stepFinishImportLocation.locations.viewButtonText')}
          </ViewComponentButton>
        )}
        <BackButton onClick={onReset}>
          {t('stepFinishImportLocation.backButtonText')}
        </BackButton>
      </Grid>
    </>
  );
};
