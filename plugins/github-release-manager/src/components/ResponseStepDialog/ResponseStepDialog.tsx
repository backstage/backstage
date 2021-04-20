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

import React, { forwardRef, Ref } from 'react';
import {
  Button,
  Dialog as MaterialDialog,
  DialogActions,
  DialogTitle,
  Slide,
} from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';
import RefreshIcon from '@material-ui/icons/Refresh';

import { LinearProgressWithLabel } from './LinearProgressWithLabel';
import { ResponseStep } from '../../types/types';
import { ResponseStepList } from './ResponseStepList';
import { useRefetchContext } from '../../contexts/RefetchContext';

interface DialogProps {
  progress: number;
  responseSteps: ResponseStep[];
  title: string;
}

const Transition = forwardRef(function Transition(
  props: { children?: React.ReactElement<any, any> } & TransitionProps,
  ref: Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const ResponseStepDialog = ({
  progress,
  responseSteps,
  title,
}: DialogProps) => {
  const { setRefetchTrigger } = useRefetchContext();

  return (
    <MaterialDialog
      open
      maxWidth="md"
      fullWidth
      TransitionComponent={Transition}
    >
      <DialogTitle>{title}</DialogTitle>

      <ResponseStepList responseSteps={responseSteps} />

      <LinearProgressWithLabel
        progress={progress}
        responseSteps={responseSteps}
      />

      <DialogActions style={{ padding: 20 }}>
        <Button
          onClick={() => setRefetchTrigger(Date.now())}
          variant="contained"
          size="large"
          color="primary"
          startIcon={<RefreshIcon />}
        >
          Ok
        </Button>
      </DialogActions>
    </MaterialDialog>
  );
};
