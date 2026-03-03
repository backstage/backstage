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
import {
  ReactNode,
  createContext,
  Children,
  isValidElement,
  cloneElement,
  useState,
  useEffect,
  PropsWithChildren,
} from 'react';
import { cn } from '../../lib/utils';

type InternalState = {
  stepperLength: number;
  stepIndex: number;
  setStepIndex: any;
  stepHistory: number[];
  setStepHistory: any;
  onStepChange?: (prevIndex: number, nextIndex: number) => void;
};

const noop = () => {};

export const VerticalStepperContext = createContext<InternalState>({
  stepperLength: 0,
  stepIndex: 0,
  setStepIndex: noop,
  stepHistory: [],
  setStepHistory: noop,
  onStepChange: noop,
});

export interface StepperProps {
  elevated?: boolean;
  onStepChange?: (prevIndex: number, nextIndex: number) => void;
  activeStep?: number;
}

export function SimpleStepper(props: PropsWithChildren<StepperProps>) {
  const { children, elevated, onStepChange, activeStep = 0 } = props;
  const [stepIndex, setStepIndex] = useState<number>(activeStep);
  /*
  Recreates the stepHistory array based on the activeStep
  to make sure the handleBack function of the Footer works when activeStep is higher than 0
  */
  const inOrderRecreatedStepHistory = Array.from(
    { length: activeStep + 1 },
    (_, i) => i,
  );
  const [stepHistory, setStepHistory] = useState<number[]>(
    inOrderRecreatedStepHistory,
  );

  useEffect(() => {
    setStepIndex(activeStep);
  }, [activeStep]);

  const steps: ReactNode[] = [];
  let endStep;
  Children.forEach(children, child => {
    if (isValidElement(child)) {
      if (child.props.end) {
        endStep = child;
      } else {
        steps.push(child);
      }
    }
  });

  return (
    <>
      <VerticalStepperContext.Provider
        value={{
          stepIndex,
          setStepIndex,
          stepHistory,
          setStepHistory,
          onStepChange,
          stepperLength: Children.count(children),
        }}
      >
        {/* Custom vertical stepper replacing MUI Stepper — uses semantic
            ordered list with step indicators, labels, and collapsible content.
            Elevated variant applies card background and shadow matching the
            former MUI elevation={2} behavior. */}
        <div
          className={cn(
            'relative',
            elevated && 'rounded-lg bg-card shadow-md p-6',
          )}
        >
          <ol className="relative space-y-0">
            {Children.map(steps, (child, index) => {
              if (isValidElement(child)) {
                return cloneElement(child, {
                  _index: index,
                  _activeIndex: stepIndex,
                } as any);
              }
              return child;
            })}
          </ol>
        </div>
      </VerticalStepperContext.Provider>
      {stepIndex >= Children.count(children) - 1 && endStep}
    </>
  );
}
