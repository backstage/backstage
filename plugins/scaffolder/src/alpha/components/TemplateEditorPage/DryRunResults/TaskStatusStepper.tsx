/*
 * Copyright 2024 The Backstage Authors
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
import { useState, memo } from 'react';
import { ScaffolderTaskStatus } from '@backstage/plugin-scaffolder-react';
import { DateTime, Interval } from 'luxon';
import useInterval from 'react-use/esm/useInterval';
import humanizeDuration from 'humanize-duration';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { scaffolderTranslationRef } from '../../../../translation';

/* shadcn/ui migration — replaces MUI makeStyles + classNames */
import { cn } from '@backstage/core-components';
/* lucide-react icons — replace @material-ui/icons and CircularProgress */
import { XCircle, Check, Circle, Loader2 } from 'lucide-react';

/**
 * Represents a single step in the scaffolder task execution pipeline.
 * Preserves the original type contract used by the stepper.
 */
type TaskStep = {
  id: string;
  name: string;
  status: ScaffolderTaskStatus;
  startedAt?: string;
  endedAt?: string;
};

/**
 * Local StepIconProps interface — replaces the MUI StepIconProps import.
 * Provides active/completed/error status flags for icon rendering.
 */
interface StepIconProps {
  active?: boolean;
  completed?: boolean;
  error?: boolean;
}

/**
 * Displays a live-updating elapsed-time ticker for a scaffolder task step.
 * Uses luxon for time interval calculation and humanize-duration for formatting.
 *
 * All timing logic (useState, useInterval, luxon DateTime/Interval, humanizeDuration)
 * is preserved exactly from the original MUI implementation.
 */
const StepTimeTicker = ({ step }: { step: TaskStep }) => {
  const [time, setTime] = useState('');

  useInterval(() => {
    if (!step.startedAt) {
      setTime('');
      return;
    }

    const end = step.endedAt
      ? DateTime.fromISO(step.endedAt)
      : DateTime.local();

    const startedAt = DateTime.fromISO(step.startedAt);
    const formatted = Interval.fromDateTimes(startedAt, end)
      .toDuration()
      .valueOf();

    setTime(humanizeDuration(formatted, { round: true }));
  }, 1000);

  /* Typography variant="caption" → text-xs text-muted-foreground */
  // eslint-disable-next-line react/forbid-elements -- MUI Typography replaced with Tailwind-styled span per shadcn/ui migration
  return <span className="text-xs text-muted-foreground">{time}</span>;
};

/**
 * Renders the status icon for each step in the task stepper.
 * Icon selection is based on the step's current status:
 * - active (processing) → spinning Loader2 icon
 * - completed → Check icon (green)
 * - error (failed/cancelled) → XCircle icon (destructive red)
 * - default (pending) → Circle icon (muted)
 *
 * Replaces the MUI StepIconComponent + useStepIconStyles pattern with
 * lucide-react icons and Tailwind utility classes via cn().
 */
function TaskStepIconComponent(props: StepIconProps) {
  const { active, completed, error } = props;

  const getIcon = () => {
    if (active) return <Loader2 className="h-6 w-6 animate-spin" />;
    if (completed) return <Check className="h-6 w-6" />;
    if (error) return <XCircle className="h-6 w-6" />;
    return <Circle className="h-6 w-6" />;
  };

  return (
    <div
      className={cn(
        'flex h-[22px] items-center text-muted-foreground',
        completed && 'text-green-600 dark:text-green-400',
        error && 'text-destructive',
      )}
    >
      {getIcon()}
    </div>
  );
}

/**
 * A vertical task-status stepper displaying each step of a scaffolder task
 * with interactive step selection, status icons, and elapsed-time tickers.
 *
 * Replaces the MUI Stepper/Step/StepButton/StepLabel composition with a
 * custom Tailwind CSS vertical stepper built from semantic button elements,
 * flexbox layout, and vertical connector lines.
 *
 * @remarks
 * - memo() wrapper is preserved for render optimization
 * - useTranslationRef provides i18n for the "Skipped" label
 * - The `classes?.root` prop is preserved for backward compatibility
 * - Each step is a focusable button for accessibility (keyboard-operable)
 */
export const TaskStatusStepper = memo(
  (props: {
    steps: TaskStep[];
    currentStepId: string | undefined;
    onUserStepChange: (id: string) => void;
    classes?: {
      root?: string;
    };
  }) => {
    const { steps, currentStepId, onUserStepChange } = props;
    const { t } = useTranslationRef(scaffolderTranslationRef);

    return (
      <div className={cn('w-full', props.classes?.root)}>
        <div className="flex flex-col">
          {steps.map((step, index) => {
            const isCancelled = step.status === 'cancelled';
            const isActive = step.status === 'processing';
            const isCompleted = step.status === 'completed';
            const isFailed = step.status === 'failed';
            const isSkipped = step.status === 'skipped';

            return (
              // eslint-disable-next-line react/forbid-elements -- MUI Button replaced with native button per shadcn/ui migration
              <button
                key={String(index)}
                type="button"
                className={cn(
                  'flex items-start gap-3 px-4 py-2 w-full text-left hover:bg-accent/50 transition-colors',
                  currentStepId === step.id && 'bg-accent',
                )}
                onClick={() => onUserStepChange(step.id)}
              >
                {/* Step icon with vertical connector */}
                <div className="flex flex-col items-center pt-0.5">
                  <TaskStepIconComponent
                    completed={isCompleted}
                    error={isFailed || isCancelled}
                    active={isActive}
                  />
                  {/* Vertical connector line between steps */}
                  {index < steps.length - 1 && (
                    <div className="w-px flex-1 bg-border mt-1 min-h-[16px]" />
                  )}
                </div>

                {/* Step label and time/status content */}
                <div className="flex flex-1 flex-row justify-between w-full min-w-0">
                  {/* eslint-disable-next-line react/forbid-elements -- MUI Typography replaced with Tailwind-styled span per shadcn/ui migration */}
                  <span className="text-sm font-medium">{step.name}</span>
                  {isSkipped ? (
                    // eslint-disable-next-line react/forbid-elements -- MUI Typography replaced with Tailwind-styled span per shadcn/ui migration
                    <span className="text-xs text-muted-foreground">
                      {t(
                        'templateEditorPage.taskStatusStepper.skippedStepTitle',
                      )}
                    </span>
                  ) : (
                    <StepTimeTicker step={step} />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  },
);
