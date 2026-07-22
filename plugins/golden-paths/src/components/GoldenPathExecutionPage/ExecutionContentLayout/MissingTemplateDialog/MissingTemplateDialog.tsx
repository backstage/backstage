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

import { MissingTemplateProps } from './MissingTemplateDialog.types';
import {
  StyledSpan,
  StyledDialogContent,
  StyledDialogTitle,
} from './MissingTemplateDialog.styles';
import { useExecutionNavigation } from '../../../../hooks/useExecutionNavigation';
import { useGoldenPathTaskContext } from '../../useGoldenPathTaskContext';
import { useCancelGoldenPath, useStartOver } from '../../TaskContextMenu';

export const MissingTemplateDialog = ({
  isOpen,
  continueCurrent,
  isLast,
}: MissingTemplateProps) => {
  const { startOverGoldenPath } = useStartOver();
  const { triggerCancel } = useCancelGoldenPath();
  const { completeGoldenPath } = useExecutionNavigation();
  const {
    value: { goldenPathTask },
  } = useGoldenPathTaskContext();

  const handleStartOverWithCancel = (id: string | undefined) => {
    if (!id) {
      return;
    }
    triggerCancel(id).then(() => {
      startOverGoldenPath();
    });
  };

  return (
    <Dialog open={isOpen}>
      <StyledDialogTitle>Missing template</StyledDialogTitle>
      <StyledDialogContent>
        <Typography>
          It seems that the{' '}
          <StyledSpan>
            {' '}
            template has been removed from the repository and it is impossible
            to execute.
          </StyledSpan>{' '}
          We suggest that you to start again the entire Golden Path.
        </Typography>
        <Typography
          style={{ padding: '24px 0' }}
          data-testid="MissingTemplateDialog-supportText"
        >
          You can also continue the current Golden Path and mark it as
          done/skipped, but the final result may be incorrect
        </Typography>
        <DialogActions>
          {!isLast ? (
            <Button
              variant="outlined"
              color="secondary"
              onClick={continueCurrent}
            >
              Continue current
            </Button>
          ) : (
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => completeGoldenPath(goldenPathTask.id)}
            >
              Complete Golden Path
            </Button>
          )}
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleStartOverWithCancel(goldenPathTask.id)}
          >
            Start over Golden Path
          </Button>
        </DialogActions>
      </StyledDialogContent>
    </Dialog>
  );
};
