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

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import { BackButton, ViewComponentButton } from '../Buttons';
import { EntityListComponent } from '../EntityListComponent';
import { PrepareResult } from '../useImportState';
import { Link } from '@backstage/core-components';
import partition from 'lodash/partition';
import { CompoundEntityRef, DEFAULT_NAMESPACE } from '@backstage/catalog-model';
import { entityRouteRef } from '@backstage/plugin-catalog-react';
import { useRouteRef } from '@backstage/core-plugin-api';

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
  const entityRoute = useRouteRef(entityRouteRef);

  if (prepareResult.type === 'repository') {
    return (
      <>
        <Typography paragraph>
          The following Pull Request has been opened:{' '}
          <Link
            to={prepareResult.pullRequest.url}
            target="_blank"
            rel="noreferrer"
          >
            {prepareResult.pullRequest.url}
          </Link>
        </Typography>
        <Typography paragraph>
          Your entities will be imported as soon as the Pull Request is merged.
        </Typography>
        <Grid container spacing={0}>
          <BackButton onClick={onReset}>Register another</BackButton>
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
          <Typography>
            The following entities have been added to the catalog:
          </Typography>

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
            A refresh was triggered for the following locations:
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
            View Component
          </ViewComponentButton>
        )}
        <BackButton onClick={onReset}>Register another</BackButton>
      </Grid>
    </>
  );
};
