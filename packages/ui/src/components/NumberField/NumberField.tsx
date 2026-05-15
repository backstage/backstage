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

import { forwardRef, useEffect, useMemo } from 'react';
import {
  Group,
  Input,
  NumberField as AriaNumberField,
} from 'react-aria-components';
import { RiAddLine, RiSubtractLine } from '@remixicon/react';
import { FieldLabel } from '../FieldLabel';
import { FieldError } from '../FieldError';
import { ButtonIcon } from '../ButtonIcon';
import type { NumberFieldProps } from './types';
import { useDefinition } from '../../hooks/useDefinition';
import { NumberFieldDefinition } from './definition';

/**
 * A numeric input with an integrated label, optional icon, and inline error display.
 *
 * @public
 */
export const NumberField = forwardRef<HTMLDivElement, NumberFieldProps>(
  (props, ref) => {
    const { ownProps, restProps, dataAttributes } = useDefinition(
      NumberFieldDefinition,
      props,
    );
    const { classes, label, icon, secondaryLabel, placeholder, description } =
      ownProps;

    useEffect(() => {
      if (!label && !restProps['aria-label'] && !restProps['aria-labelledby']) {
        console.warn(
          'NumberField requires either a visible label, aria-label, or aria-labelledby for accessibility',
        );
      }
    }, [label, restProps['aria-label'], restProps['aria-labelledby']]);

    const secondaryLabelText =
      secondaryLabel || (restProps.isRequired ? 'Required' : null);

    const formatOptions = useMemo(
      () => ({
        useGrouping: false,
        ...restProps.formatOptions,
      }),
      [restProps.formatOptions],
    );

    return (
      <AriaNumberField
        className={classes.root}
        {...dataAttributes}
        {...restProps}
        formatOptions={formatOptions}
        ref={ref}
      >
        <FieldLabel
          label={label}
          secondaryLabel={secondaryLabelText}
          description={description}
          descriptionSlot="description"
        />
        <Group
          className={classes.inputWrapper}
          data-size={dataAttributes['data-size']}
        >
          {icon && (
            <div
              className={classes.inputIcon}
              data-size={dataAttributes['data-size']}
              aria-hidden="true"
            >
              {icon}
            </div>
          )}
          <Input
            className={classes.input}
            {...(icon && { 'data-icon': true })}
            placeholder={placeholder}
          />
          <div className={classes.stepperButtons}>
            <ButtonIcon
              slot="decrement"
              variant="tertiary"
              size={ownProps.size}
              className={classes.stepperButton}
              icon={<RiSubtractLine />}
              aria-label="Decrease"
            />
            <ButtonIcon
              slot="increment"
              variant="tertiary"
              size={ownProps.size}
              className={classes.stepperButton}
              icon={<RiAddLine />}
              aria-label="Increase"
            />
          </div>
        </Group>
        <FieldError />
      </AriaNumberField>
    );
  },
);

NumberField.displayName = 'NumberField';
