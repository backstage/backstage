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

import React from 'react';
import {
  Button,
  Dialog as MaterialDialog,
  DialogActions,
  DialogTitle,
} from '@material-ui/core';

import { LinearProgressWithLabel } from './LinearProgressWithLabel';
import { ResponseStep } from '../types/types';
import { ResponseStepList } from './ResponseStepList/ResponseStepList';
import { useRefetchContext } from '../contexts/RefetchContext';

interface DialogProps {
  progress: number;
  responseSteps: ResponseStep[];
  title: string;
}

export const Dialog = ({ progress, responseSteps, title }: DialogProps) => {
  const { setRefetchTrigger } = useRefetchContext();

  return (
    <MaterialDialog open maxWidth="md" fullWidth>
      <DialogTitle>{title}</DialogTitle>

      <ResponseStepList responseSteps={responseSteps} />

      <LinearProgressWithLabel value={progress} />

      <DialogActions>
        <Button
          onClick={() => setRefetchTrigger(Date.now())}
          color="primary"
          variant="contained"
          size="large"
        >
          Ok
        </Button>
      </DialogActions>
    </MaterialDialog>
  );
};
