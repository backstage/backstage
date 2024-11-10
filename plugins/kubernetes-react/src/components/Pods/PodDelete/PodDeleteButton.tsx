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

import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Close';
import CircularProgress from '@mui/material/CircularProgress';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { kubernetesReactTranslationRef } from '../../../translation';

import { usePodDelete } from './usePodDelete';
import { PodScope } from './types';

/**
 * Props for PodDeleteButton
 *
 * @public
 */
export interface PodDeleteButtonProps {
  podScope: PodScope;
}

/**
 * a Delete button to delete a given pod
 *
 * @public
 */
export const PodDeleteButton = ({ podScope }: PodDeleteButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const deletePod = usePodDelete();

  const { t } = useTranslationRef(kubernetesReactTranslationRef);
  const buttonText = t('podDrawer.buttons.delete');

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
    <Grid container xs={12}>
      <Grid xs={12}>
        <CardActions>
          <Button
            variant="outlined"
            aria-label={buttonText}
            component="label"
            onClick={handleDeleteClick}
            startIcon={
              isLoading ? <CircularProgress size={18} /> : <DeleteIcon />
            }
            disabled={isLoading}
          >
            {buttonText}
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
