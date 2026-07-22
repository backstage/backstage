/*
 * Copyright 2026 The Backstage Authors
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
import { Button, Dialog, DialogActions, Typography } from '@material-ui/core';

import {
  StyledDialogContent,
  StyledDialogTitle,
  StyledTypography,
} from './CompleteGoldenPathDialog.styles';
import { useGoldenPathTaskContext } from '../../useGoldenPathTaskContext';
import { useExecutionNavigation } from '../../../../hooks/useExecutionNavigation';

type CompleteGoldenPathProps = {
  open: boolean;
  onClose: () => void;
};

export const CompleteGoldenPathDialog = ({
  open,
  onClose,
}: CompleteGoldenPathProps) => {
  const {
    value: { goldenPathTask },
  } = useGoldenPathTaskContext();
  const { completeGoldenPath } = useExecutionNavigation();

  return (
    <Dialog open={open}>
      <StyledDialogTitle>Completion of the Golden Path</StyledDialogTitle>
      <StyledDialogContent>
        <Typography>
          You have successfully finished all templates in this Golden Path.{' '}
        </Typography>
        <StyledTypography data-testid="CompleteGoldenPathDialog-supportText">
          Do you want to complete?
        </StyledTypography>
        <DialogActions>
          <Button variant="outlined" color="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => completeGoldenPath(goldenPathTask.id)}
          >
            Complete Golden Path
          </Button>
        </DialogActions>
      </StyledDialogContent>
    </Dialog>
  );
};
