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
import { TextArea, TextField as AriaTextField } from 'react-aria-components';
import { FieldLabel } from '../FieldLabel';
import { FieldError } from '../FieldError';
import type { TextAreaFieldProps } from './types';
import { useDefinition } from '../../hooks/useDefinition';
import { TextAreaFieldDefinition } from './definition';

/**
 * A multi-line text input with an integrated label and inline error display.
 *
 * @public
 */
export const TextAreaField = forwardRef<HTMLDivElement, TextAreaFieldProps>(
  (props, ref) => {
    const { ownProps, restProps, dataAttributes } = useDefinition(
      TextAreaFieldDefinition,
      props,
    );
    const { classes, label, secondaryLabel, placeholder, description, rows } =
      ownProps;

    useEffect(() => {
      if (!label && !restProps['aria-label'] && !restProps['aria-labelledby']) {
        console.warn(
          'TextAreaField requires either a visible label, aria-label, or aria-labelledby for accessibility',
        );
      }
    }, [label, restProps['aria-label'], restProps['aria-labelledby']]);

    // If a secondary label is provided, use it. Otherwise, use 'Required' if the field is required.
    const secondaryLabelText =
      secondaryLabel || (restProps.isRequired ? 'Required' : null);

    return (
      <AriaTextField
        className={classes.root}
        {...dataAttributes}
        {...restProps}
        ref={ref}
      >
        <FieldLabel
          label={label}
          secondaryLabel={secondaryLabelText}
          description={description}
          descriptionSlot="description"
        />
        <TextArea
          className={classes.textArea}
          data-size={dataAttributes['data-size']}
          placeholder={placeholder}
          rows={rows}
        />
        <FieldError />
      </AriaTextField>
    );
  },
);

TextAreaField.displayName = 'TextAreaField';
