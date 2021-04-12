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
import React, { PropsWithChildren } from 'react';
import { List, CircularProgress } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import { ResponseStep, SetRefetch } from '../../types/types';
import { TEST_IDS } from '../../test-helpers/test-ids';
import { ResponseStepListItem } from './ResponseStepListItem';

interface ResponseStepListProps {
  responseSteps?: ResponseStep[];
  setRefetch: SetRefetch;
  title: string;
  animationDelay?: number;
  loading: boolean;
  closeable?: boolean;
  denseList?: boolean;
}

export const ResponseStepList = ({
  responseSteps,
  animationDelay,
  setRefetch,
  loading = false,
  closeable = false,
  denseList = false,
  title,
  children,
}: PropsWithChildren<ResponseStepListProps>) => {
  const [open, setOpen] = React.useState(true);

  const handleClose = () => setOpen(false);

  return (
    <Dialog
      open={open}
      onClose={() => {
        if (closeable) {
          handleClose();
        }
      }}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>{title}</DialogTitle>

      {loading || !responseSteps ? (
        <div style={{ margin: 10, textAlign: 'center' }}>
          <CircularProgress
            data-testid={TEST_IDS.components.circularProgress}
          />
        </div>
      ) : (
        <>
          <DialogContent
            data-testid={TEST_IDS.components.responseStepListDialogContent}
          >
            <List dense={denseList}>
              {responseSteps.map((responseStep, index) => (
                <ResponseStepListItem
                  key={`ResponseStepListItem-${index}`}
                  responseStep={responseStep}
                  index={index}
                  animationDelay={animationDelay}
                />
              ))}
            </List>

            {children}
          </DialogContent>
          <DialogActions>
            {closeable && (
              <Button
                onClick={() => handleClose()}
                color="primary"
                variant="contained"
                size="medium"
              >
                Close
              </Button>
            )}
            <Button
              onClick={() => setRefetch(Date.now())}
              color="primary"
              variant="contained"
              size="large"
            >
              Ok
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};
