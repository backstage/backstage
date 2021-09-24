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

import { Grid, Typography } from '@material-ui/core';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import React from 'react';
import { BackButton } from '../Buttons';
import { EntityListComponent } from '../EntityListComponent';
import { PrepareResult } from '../useImportState';
import { Link } from '@backstage/core-components';
import partition from 'lodash/partition';

type Props = {
  prepareResult: PrepareResult;
  onReset: () => void;
};

export const StepFinishImportLocation = ({ prepareResult, onReset }: Props) => {
  const continueButton = (
    <Grid container spacing={0}>
      <BackButton onClick={onReset}>Register another</BackButton>
    </Grid>
  );

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

        {continueButton}
      </>
    );
  }

  const [existingLocations, newLocations] = partition(
    prepareResult.locations,
    l => l.exists,
  );

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
      {continueButton}
    </>
  );
};
