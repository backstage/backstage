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

import { forwardRef, useEffect } from 'react';
import { useCheckboxGroupState } from 'react-stately';
import { useCheckboxGroup } from 'react-aria';
import {
  Provider,
  LabelContext,
  TextContext,
  FieldErrorContext,
} from 'react-aria-components';
import type { SwitchGroupProps } from './types';
import { useDefinition } from '../../hooks/useDefinition';
import { SwitchGroupDefinition } from './definition';
import { SwitchGroupStateContext } from './context';
import { FieldLabel } from '../FieldLabel';
import { FieldError } from '../FieldError';

/**
 * A group of switches for toggling multiple options on or off.
 * @public
 */
export const SwitchGroup = forwardRef<HTMLDivElement, SwitchGroupProps>(
  (props, ref) => {
    const { ownProps, restProps, dataAttributes } = useDefinition(
      SwitchGroupDefinition,
      props,
    );
    const {
      classes,
      label,
      secondaryLabel,
      description,
      isRequired,
      children,
    } = ownProps;

    const ariaLabel = restProps['aria-label'];
    const ariaLabelledBy = restProps['aria-labelledby'];

    useEffect(() => {
      if (!label && !ariaLabel && !ariaLabelledBy) {
        console.warn(
          'SwitchGroup requires either a visible label, aria-label, or aria-labelledby for accessibility',
        );
      }
    }, [label, ariaLabel, ariaLabelledBy]);

    const state = useCheckboxGroupState({
      ...restProps,
      isRequired,
    });

    const {
      groupProps,
      labelProps,
      descriptionProps,
      errorMessageProps,
      ...validation
    } = useCheckboxGroup(
      {
        ...restProps,
        label,
        isRequired,
      },
      state,
    );

    const secondaryLabelText =
      secondaryLabel || (isRequired ? 'Required' : null);

    return (
      <div
        ref={ref}
        className={classes.root}
        {...groupProps}
        {...dataAttributes}
      >
        <Provider
          values={[
            [SwitchGroupStateContext, state],
            [LabelContext, { ...labelProps, elementType: 'span' }],
            [
              TextContext,
              {
                slots: {
                  description: descriptionProps,
                  errorMessage: errorMessageProps,
                },
              },
            ],
            [FieldErrorContext, validation],
          ]}
        >
          <FieldLabel
            label={label}
            secondaryLabel={secondaryLabelText}
            description={description}
            descriptionSlot="description"
          />
          <div className={classes.content}>{children}</div>
          <FieldError />
        </Provider>
      </div>
    );
  },
);

SwitchGroup.displayName = 'SwitchGroup';
