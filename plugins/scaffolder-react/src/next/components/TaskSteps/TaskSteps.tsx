/*
 * Copyright 2022 The Backstage Authors
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
import { TaskStep } from '@backstage/plugin-scaffolder-common';
import { StepIcon } from './StepIcon';
import { StepTime } from './StepTime';
import { TaskBorder } from './TaskBorder';
import { ScaffolderStep } from '@backstage/plugin-scaffolder-react';

/**
 * Local replacement for MUI's StepIconProps, used to pass step status
 * information to the StepIcon component after the MUI → Tailwind migration.
 */
interface StepIconComponentProps {
  active: boolean;
  completed: boolean;
  error: boolean;
  skipped: boolean;
}

/**
 * Props for the TaskSteps component
 *
 * @alpha
 */
export interface TaskStepsProps {
  steps: (TaskStep & ScaffolderStep)[];
  activeStep?: number;
  isComplete?: boolean;
  isError?: boolean;
}

/**
 * The visual stepper of the task event stream
 *
 * @alpha
 */
export const TaskSteps = (props: TaskStepsProps) => {
  return (
    <div className="relative overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <TaskBorder
        isComplete={props.isComplete ?? false}
        isError={props.isError ?? false}
      />
      <div className="p-4">
        <div className="flex overflow-x-auto gap-2" role="list">
          {props.steps.map(step => {
            const isCompleted = step.status === 'completed';
            const isFailed = step.status === 'failed';
            const isActive = step.status === 'processing';
            const isSkipped = step.status === 'skipped';
            const stepIconProps: StepIconComponentProps = {
              completed: isCompleted,
              error: isFailed,
              active: isActive,
              skipped: isSkipped,
            };

            return (
              <div
                key={step.id}
                className="flex flex-col items-center flex-shrink-0 min-w-[120px]"
                role="listitem"
              >
                <button
                  type="button"
                  className="flex flex-col items-center gap-1 bg-transparent border-none cursor-pointer p-2 rounded-md transition-colors hover:bg-accent/50"
                >
                  <div
                    className="flex flex-col items-center gap-1"
                    data-testid="step-label"
                  >
                    <StepIcon {...stepIconProps} />
                    <span className="text-xs font-medium text-foreground">
                      {step.name}
                    </span>
                    {!isSkipped && <StepTime step={step} />}
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
