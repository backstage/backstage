/*
 * Copyright 2021 Spotify AB
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

import { Link } from '@backstage/core';
import { Grid, Typography } from '@material-ui/core';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import React from 'react';
import { BackButton } from '../Buttons';
import { EntityListComponent } from '../EntityListComponent';
import { ReviewResult } from '../useImportState';

type Props = {
  reviewResult: ReviewResult;
  onReset: () => void;
};

export const StepFinishImportLocation = ({ reviewResult, onReset }: Props) => (
  <>
    {reviewResult.type === 'repository' && (
      <>
        <Typography paragraph>
          The following Pull Request has been opened:{' '}
          <Link
            to={reviewResult.pullRequest.url}
            target="_blank"
            rel="noreferrer"
          >
            {reviewResult.pullRequest.url}
          </Link>
        </Typography>

        <Typography paragraph>
          Your entities will be imported as soon as the Pull Request is merged.
        </Typography>
      </>
    )}

    <Typography>
      The following entities have been added to the catalog:
    </Typography>

    <EntityListComponent
      locations={reviewResult.locations}
      locationListItemIcon={() => <LocationOnIcon />}
      withLinks
    />

    <Grid container spacing={0}>
      <BackButton onClick={onReset}>Register another</BackButton>
    </Grid>
  </>
);
