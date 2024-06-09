/*
 * Copyright 2024 The Backstage Authors
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
import React, { useState } from 'react';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Close';
import CircularProgress from '@material-ui/core/CircularProgress';

import { usePodDelete } from './usePodDelete';
import { PodScope } from './types';

/**
 * Props for PodDeleteButton
 *
 * @public
 */
export interface PodDeleteButtonProps {
  podScope: PodScope;
  restartButtonTextEnable?: boolean;
}

/**
 * a Delete button to delete a given pod
 *
 * @public
 */
export const PodDeleteButton = ({
  podScope,
  restartButtonTextEnable,
}: PodDeleteButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const deletePod = usePodDelete();
  const getButtonText = restartButtonTextEnable ? 'Restart Pod' : 'Delete Pod';

  const handleDeleteClick = async () => {
    setIsLoading(true);
    try {
      await deletePod(podScope);
    } catch (error) {
      setHasError(true);
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  return (
    <Grid container item xs={12}>
      <Grid item xs={12}>
        <CardActions>
          <Button
            variant="outlined"
            aria-label={getButtonText}
            component="label"
            onClick={handleDeleteClick}
            startIcon={
              isLoading ? <CircularProgress size={18} /> : <DeleteIcon />
            }
            disabled={isLoading}
          >
            {getButtonText}
          </Button>
        </CardActions>
        {hasError && (
          <Typography
            variant="body1"
            color="error"
            style={{ textAlign: 'right' }}
          >
            Could not delete the pod. Please check the console for the full
            report.
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};
