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

import { Link } from '@backstage/core-components';
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { Button, FormHelperText, Grid, Typography } from '@material-ui/core';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import { Alert } from '@material-ui/lab';
import React, { useCallback, useState } from 'react';
import { BackButton, NextButton } from '../Buttons';
import { EntityListComponent } from '../EntityListComponent';
import { PrepareResult, ReviewResult } from '../useImportState';

type Props = {
  prepareResult: PrepareResult;
  onReview: (result: ReviewResult) => void;
  onGoBack?: () => void;
};

function isConflictError(error: Error): string | undefined {
  try {
    const parse = JSON.parse(error.message);

    if (parse.error.name === 'ConflictError') {
      return parse.error.message;
    }
  } catch (_) {
    // ignore
  }

  return undefined;
}

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
  const [locationConflictMessage, setLocationConflictMessage] =
    useState<string>();

  const handleImport = useCallback(async () => {
    setSubmitted(true);
    try {
      const result = await Promise.all(
        prepareResult.locations.map(l =>
          catalogApi.addLocation({
            type: 'url',
            target: l.target,
            presence:
              prepareResult.type === 'repository' ? 'optional' : 'required',
          }),
        ),
      );

      onReview({
        ...prepareResult,
        locations: result.map(r => ({
          target: r.location.target,
          entities: r.entities,
        })),
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
      } else if (isConflictError(e)) {
        setLocationConflictMessage(isConflictError(e));
        setSubmitted(false);
      } else {
        setError(e.message);
        setSubmitted(false);
      }
    }
  }, [prepareResult, onReview, catalogApi]);

  const handleRefresh = useCallback(async () => {
    setSubmitted(true);
    setLocationConflictMessage(undefined);
    try {
      // TODO: do something
      await new Promise(resolve => setTimeout(resolve, 1000));

      // TODO: is this correct?
      onReview(prepareResult as unknown as ReviewResult);
    } catch (e) {
      setError(e.message);
      setSubmitted(false);
    }
  }, [onReview, prepareResult]);

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
        The following entities will be added to the catalog:
      </Typography>

      <EntityListComponent
        locations={prepareResult.locations}
        locationListItemIcon={() => <LocationOnIcon />}
      />

      {error && <FormHelperText error>{error}</FormHelperText>}

      {locationConflictMessage && (
        <Alert
          variant="outlined"
          severity="warning"
          action={
            <Button color="inherit" onClick={handleRefresh}>
              Refresh
            </Button>
          }
        >
          This location is already registered. Do you want to refresh it?
        </Alert>
      )}

      <Grid container spacing={0}>
        {onGoBack && <BackButton onClick={onGoBack} disabled={submitted} />}
        <NextButton
          disabled={submitted}
          loading={submitted}
          onClick={() => handleImport()}
        >
          Import
        </NextButton>
      </Grid>
    </>
  );
};
