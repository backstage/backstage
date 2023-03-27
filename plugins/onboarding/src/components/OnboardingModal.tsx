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
import React, { useContext } from 'react';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import { Box, Button } from '@material-ui/core';
import { OnboardingContext } from '../context/OnboardingContext';

export const OnboardingModal: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { modal, toggleModal } = useContext(OnboardingContext);

  return (
    <Dialog fullWidth maxWidth="lg" onClose={toggleModal} open={modal}>
      <MuiDialogTitle id="Onboarding">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          Onboarding
          <Button color="primary" onClick={toggleModal}>
            Skip
          </Button>
        </Box>
      </MuiDialogTitle>
      {children}
    </Dialog>
  );
};
