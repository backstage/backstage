/*
 * Copyright 2020 The Backstage Authors
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
import { Check } from 'lucide-react';
import { PropsWithChildren } from 'react';

import { cn } from '../../lib/utils';
import { SimpleStepperFooter } from './SimpleStepperFooter';
import { StepProps } from './types';

/** @public */
export type SimpleStepperStepClassKey = 'end';

/**
 * A single step within the SimpleStepper vertical stepper component.
 *
 * Renders either as a regular step (with indicator circle, label, and
 * collapsible content area) or as an end/completion step (plain container
 * with title, children, and a footer that hides the Next button).
 *
 * Internal props `_index` and `_activeIndex` are injected by the parent
 * SimpleStepper via React.cloneElement to coordinate active/completed state
 * without relying on MUI's implicit step index injection.
 */
export function SimpleStepperStep(
  props: PropsWithChildren<
    StepProps & { _index?: number; _activeIndex?: number }
  >,
) {
  const { title, children, end, actions, _index, _activeIndex, ...restProps } =
    props;

  const isActive = _index === _activeIndex;
  const isCompleted =
    _index !== undefined && _activeIndex !== undefined && _index < _activeIndex;

  // The end step is not a part of the stepper.
  // It simply is the final screen with an option to have buttons such as reset or back.
  if (end) {
    return (
      <div className="p-6" {...restProps}>
        <h6 className="text-lg font-medium leading-tight">{title}</h6>
        {children}
        <SimpleStepperFooter
          actions={{ ...(actions || {}), showNext: false }}
        />
      </div>
    );
  }

  return (
    <li className="relative pb-4" {...restProps}>
      {/* Step indicator circle and label row — always visible */}
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-medium',
            isActive && 'border-primary bg-primary text-primary-foreground',
            isCompleted && 'border-primary bg-primary text-primary-foreground',
            !isActive &&
              !isCompleted &&
              'border-muted-foreground text-muted-foreground',
          )}
          aria-current={isActive ? 'step' : undefined}
        >
          {isCompleted && <Check className="h-4 w-4" />}
          {!isCompleted && _index !== undefined && _index + 1}
        </div>
        <h6
          className={cn(
            'text-lg font-medium leading-tight',
            !isActive && !isCompleted && 'text-muted-foreground',
          )}
        >
          {title}
        </h6>
      </div>

      {/* Step content — only visible when this step is the active step */}
      {isActive && (
        <div className="ml-4 border-l-2 border-border pl-8 pt-2 pb-2">
          {children}
          <SimpleStepperFooter actions={actions} />
        </div>
      )}

      {/* Vertical connector line for inactive steps */}
      {!isActive && (
        <div className="ml-4 border-l-2 border-border h-2" aria-hidden="true" />
      )}
    </li>
  );
}
