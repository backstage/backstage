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

import { forwardRef, useEffect } from 'react';
import {
  RadioGroup as AriaRadioGroup,
  Radio as AriaRadio,
} from 'react-aria-components';
import { FieldLabel } from '../FieldLabel';
import { FieldError } from '../FieldError';
import { useDefinition } from '../../hooks/useDefinition';
import { RadioGroupDefinition, RadioDefinition } from './definition';

import type { RadioGroupProps, RadioProps } from './types';

/** @public */
export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  (props, ref) => {
    const { ownProps, restProps } = useDefinition(RadioGroupDefinition, props);
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
          'RadioGroup requires either a visible label, aria-label, or aria-labelledby for accessibility',
        );
      }
    }, [label, ariaLabel, ariaLabelledBy]);

    // If a secondary label is provided, use it. Otherwise, use 'Required' if the field is required.
    const secondaryLabelText =
      secondaryLabel || (isRequired ? 'Required' : null);

    return (
      <AriaRadioGroup className={classes.root} {...restProps} ref={ref}>
        <FieldLabel
          label={label}
          secondaryLabel={secondaryLabelText}
          description={description}
        />
        <div className={classes.content}>{children}</div>
        <FieldError />
      </AriaRadioGroup>
    );
  },
);

RadioGroup.displayName = 'RadioGroup';

/** @public */
export const Radio = forwardRef<HTMLLabelElement, RadioProps>((props, ref) => {
  const { ownProps, restProps } = useDefinition(RadioDefinition, props);

  return (
    <AriaRadio className={ownProps.classes.root} {...restProps} ref={ref} />
  );
});

Radio.displayName = 'Radio';
