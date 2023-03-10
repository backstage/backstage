/*
 * Copyright 2023 The Backstage Authors
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

import React from 'react';
import { entityFeedbackApiRef } from '../../api';
import { useApi } from '@backstage/core-plugin-api';
import { ErrorPanel, InfoCard } from '@backstage/core-components';
import { Box, Divider, Grid, Typography } from '@material-ui/core';
import useAsync from 'react-use/lib/useAsync';
import StarIcon from '@material-ui/icons/Star';
import { AppRatingButton, AppRatingButtonProps } from '../AppRatingButton';

export const AppRatingCard = (props: {
  showRatingButton?: boolean;
  ratingButtonProps?: AppRatingButtonProps;
}) => {
  const ratingApi = useApi(entityFeedbackApiRef);
  const {
    error,
    loading,
    value: ratings,
  } = useAsync(async () => {
    return ratingApi.getAppRatings();
  }, [ratingApi]);

  if (error) {
    return (
      <ErrorPanel
        defaultExpanded
        title="Failed to load rating responses"
        error={error}
      />
    );
  }

  if (loading || !ratings) {
    return null;
  }

  const avg =
    ratings.reduce((total, rating) => total + rating.rating, 0) /
    ratings.length;
  return (
    <InfoCard
      noPadding
      title={
        <Box display="flex" alignItems="center">
          <Box mr={1}>
            <StarIcon fontSize="large" />
          </Box>
          <Typography display="inline" variant="h5">
            Application ratings
          </Typography>
        </Box>
      }
      actions={
        props.showRatingButton ? (
          <Box>
            <AppRatingButton {...props.ratingButtonProps} />
          </Box>
        ) : null
      }
    >
      <Box pt={2} pb={2}>
        <Grid container spacing={4} alignItems="center" justifyContent="center">
          <Grid item>
            <Typography align="center" variant="body1">
              Average
            </Typography>
            <Typography align="center" variant="h4">
              {isNaN(avg) ? 'No ratings' : avg.toFixed(2)}
            </Typography>
          </Grid>
          <Grid item>
            <Typography align="center" variant="body1">
              Votes
            </Typography>
            <Typography align="center" variant="h4">
              {ratings.length === 0 ? 'No ratings' : ratings.length}
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <Divider />
    </InfoCard>
  );
};
