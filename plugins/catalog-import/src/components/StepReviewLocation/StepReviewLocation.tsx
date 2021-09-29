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

import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { FormHelperText, Grid, Typography } from '@material-ui/core';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import React, { useCallback, useState } from 'react';
import { BackButton, NextButton } from '../Buttons';
import { EntityListComponent } from '../EntityListComponent';
import { PrepareResult, ReviewResult } from '../useImportState';

import { configApiRef, useApi } from '@backstage/core-plugin-api';
import { Link } from '@backstage/core-components';
import { stringifyEntityRef } from '@backstage/catalog-model';

type Props = {
  prepareResult: PrepareResult;
  onReview: (result: ReviewResult) => void;
  onGoBack?: () => void;
};

export const StepReviewLocation = ({
  prepareResult,
  onReview,
  onGoBack,
}: Props) => {
  const catalogApi = useApi(catalogApiRef);
  const configApi = useApi(configApiRef);

  const appTitle = configApi.getOptional('app.title') || 'Backstage';

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string>();
  const exists =
    prepareResult.type === 'locations' &&
    prepareResult.locations.some(l => l.exists)
      ? true
      : false;
  const handleClick = useCallback(async () => {
    setSubmitted(true);
    try {
      let refreshed = new Array<{ target: string }>();
      if (prepareResult.type === 'locations') {
        refreshed = await Promise.all(
          prepareResult.locations
            .filter(l => l.exists)
            .map(async l => {
              const ref = stringifyEntityRef(l.entities[0] ?? l);
              await catalogApi.refreshEntity(ref);
              return { target: l.target };
            }),
        );
      }

      const locations = await Promise.all(
        prepareResult.locations
          .filter((l: unknown) => !(l as { exists?: boolean }).exists)
          .map(async l => {
            const result = await catalogApi.addLocation({
              type: 'url',
              target: l.target,
              presence:
                prepareResult.type === 'repository' ? 'optional' : 'required',
            });
            return {
              target: result.location.target,
              entities: result.entities,
            };
          }),
      );

      onReview({
        ...prepareResult,
        ...{ refreshed },
        locations,
      });
    } catch (e) {
      // TODO: this error should be handled differently. We add it as 'optional' and
      //       it is not uncommon that a PR has not been merged yet.
      if (
        prepareResult.type === 'repository' &&
        e.message.startsWith(
          'Location was added but has no entities specified yet',
        )
      ) {
        onReview({
          ...prepareResult,
          locations: prepareResult.locations.map(l => ({
            target: l.target,
            entities: [],
          })),
        });
      } else {
        setError(e.message);
        setSubmitted(false);
      }
    }
  }, [prepareResult, onReview, catalogApi]);

  return (
    <>
      {prepareResult.type === 'repository' && (
        <>
          <Typography paragraph>
            The following Pull Request has been opened:{' '}
            <Link
              to={prepareResult.pullRequest.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {prepareResult.pullRequest.url}
            </Link>
          </Typography>

          <Typography paragraph>
            You can already import the location and {appTitle} will fetch the
            entities as soon as the Pull Request is merged.
          </Typography>
        </>
      )}

      <Typography>
        {exists
          ? 'The following locations already exist in the catalog:'
          : 'The following entities will be added to the catalog:'}
      </Typography>

      <EntityListComponent
        locations={prepareResult.locations}
        locationListItemIcon={() => <LocationOnIcon />}
      />

      {error && <FormHelperText error>{error}</FormHelperText>}

      <Grid container spacing={0}>
        {onGoBack && <BackButton onClick={onGoBack} disabled={submitted} />}
        <NextButton
          disabled={submitted}
          loading={submitted}
          onClick={() => handleClick()}
        >
          {exists ? 'Refresh' : 'Import'}
        </NextButton>
      </Grid>
    </>
  );
};
