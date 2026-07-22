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
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import PanoramaFishEyeIcon from '@material-ui/icons/PanoramaFishEye';

import { Container } from './ExecutionStatusIcon.styles';
import { ExecutionStatusIconProps } from './ExecutionStatusIcon.types';

export const ExecutionStatusIcon = ({ status }: ExecutionStatusIconProps) => {
  const getIcon = () => {
    switch (status) {
      case 'active':
        return <FiberManualRecordIcon />;
      case 'completed':
      case 'marked_as_done':
        return <CheckCircleIcon />;
      case 'failed':
        return <ErrorIcon />;
      case 'skipped':
        return <RemoveCircleOutlineIcon />;
      default:
        return <PanoramaFishEyeIcon />;
    }
  };

  return <Container status={status}>{getIcon()}</Container>;
};
