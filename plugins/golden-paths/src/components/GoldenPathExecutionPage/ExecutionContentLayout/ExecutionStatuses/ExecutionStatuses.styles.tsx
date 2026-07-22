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
import { StepButton, Stepper, styled } from '@material-ui/core';

export const StyledStepper = styled(Stepper)({
  backgroundColor: 'unset',
  padding: '20px 0 0 0',

  '& [class*=MuiStepConnector-vertical]': {
    marginLeft: 17,
    padding: 0,
  },

  '& [class*=MuiStepLabel-active]': {
    fontWeight: 'bold',
  },
});

export const StyledStepButton = styled(StepButton)({
  '& [class*=MuiStepLabel-root-]': {
    minWidth: 0,

    '& [class*=MuiStepLabel-labelContainer-]': {
      minWidth: 0,

      '& [class*=MuiStepLabel-label-]': {
        textAlign: 'left',
        display: '-webkit-box',
        ['-webkit-box-orient']: 'vertical',
        ['-webkit-line-clamp']: 2,
        textOverflow: 'ellipsis',
        overflow: 'hidden',
      },
    },
  },
});
