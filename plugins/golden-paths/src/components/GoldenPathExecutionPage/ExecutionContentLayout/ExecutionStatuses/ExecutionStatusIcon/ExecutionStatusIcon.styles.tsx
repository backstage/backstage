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
import { styled, Theme } from '@material-ui/core';
import { StepStatus } from './ExecutionStatusIcon.types';

type ContainerProps = { theme: Theme } & { status: StepStatus };

export const Container = styled('div')(({ theme, status }: ContainerProps) => {
  let color = theme.palette.text.disabled;

  switch (status) {
    case 'failed':
      color = theme.palette.status.error;
      break;
    case 'completed':
    case 'marked_as_done':
      color = theme.palette.status.ok;
      break;
    case 'enabled':
    case 'skipped':
      color = theme.palette.text.primary;
      break;
    case 'active':
      color = theme.palette.primary.main;
      break;
    default:
      break;
  }

  return {
    color,
    display: 'flex',

    '& svg': {
      width: 36,
      height: 36,

      '& circle': {
        r: 10,
      },
    },
  };
});
