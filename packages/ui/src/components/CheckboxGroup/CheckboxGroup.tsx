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
import { CheckboxGroup as RACheckboxGroup } from 'react-aria-components';
import type { CheckboxGroupProps } from './types';
import { useDefinition } from '../../hooks/useDefinition';
import { CheckboxGroupDefinition } from './definition';
import { FieldLabel } from '../FieldLabel';
import { FieldError } from '../FieldError';

/**
 * A group of checkboxes for selecting multiple options from a list.
 * @public
 */
export const CheckboxGroup = forwardRef<HTMLDivElement, CheckboxGroupProps>(
  (props, ref) => {
    const { ownProps, restProps } = useDefinition(
      CheckboxGroupDefinition,
      props,
    );
    const {
      classes,
      label,
      secondaryLabel,
      description,
      isRequired,
      orientation,
      children,
    } = ownProps;

    const ariaLabel = restProps['aria-label'];
    const ariaLabelledBy = restProps['aria-labelledby'];

    useEffect(() => {
      if (!label && !ariaLabel && !ariaLabelledBy) {
        console.warn(
          'CheckboxGroup requires either a visible label, aria-label, or aria-labelledby for accessibility',
        );
      }
    }, [label, ariaLabel, ariaLabelledBy]);

    const secondaryLabelText =
      secondaryLabel || (isRequired ? 'Required' : null);

    return (
      <RACheckboxGroup
        ref={ref}
        className={classes.root}
        isRequired={isRequired}
        data-orientation={orientation}
        {...restProps}
      >
        <FieldLabel
          label={label}
          secondaryLabel={secondaryLabelText}
          description={description}
        />
        <div className={classes.content}>{children}</div>
        <FieldError />
      </RACheckboxGroup>
    );
  },
);

CheckboxGroup.displayName = 'CheckboxGroup';
