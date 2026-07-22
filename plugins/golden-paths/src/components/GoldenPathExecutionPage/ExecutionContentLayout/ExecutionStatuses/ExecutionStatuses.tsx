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
import { Step, Tooltip } from '@material-ui/core';
import { toString } from 'lodash';
import { JsonValue } from '@backstage/types';

import { StyledStepButton, StyledStepper } from './ExecutionStatuses.styles';
import { ExecutionStatusIcon, StepStatus } from './ExecutionStatusIcon';
import { useGoldenPathTaskContext } from '../../useGoldenPathTaskContext';
import { useExecutionNavigation } from '../../../../hooks/useExecutionNavigation';

export const ExecutionStatuses = () => {
  const {
    value: { stepIndex, mappedStatuses },
  } = useGoldenPathTaskContext();
  const { navigateToStepIndex } = useExecutionNavigation();

  const renderStepLabel = (
    status: string | undefined,
    name: JsonValue | undefined,
    index: number,
  ) => {
    return (
      <StyledStepButton
        icon={<ExecutionStatusIcon status={status as StepStatus} />}
        onClick={() => navigateToStepIndex(index, status || '')}
        style={status === 'missing' ? { cursor: 'unset' } : undefined}
      >
        {toString(name)}
      </StyledStepButton>
    );
  };

  return (
    <StyledStepper orientation="vertical" activeStep={stepIndex}>
      {mappedStatuses.map(({ name, id, status }, index) => {
        return (
          <Step key={`${id}-${index}`} disabled={!mappedStatuses[index].status}>
            {status === 'missing' ? (
              <Tooltip title="This template is missing">
                {renderStepLabel(status, name, index)}
              </Tooltip>
            ) : (
              renderStepLabel(status, name, index)
            )}
          </Step>
        );
      })}
    </StyledStepper>
  );
};
