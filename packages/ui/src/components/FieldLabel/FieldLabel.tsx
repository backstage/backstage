/*
 * Copyright 2025 The Backstage Authors
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
import { Label } from 'react-aria-components';
import { forwardRef } from 'react';
import type { FieldLabelProps } from './types';
import { useDefinition } from '../../hooks/useDefinition';
import { FieldLabelDefinition } from './definition';

/** @public */
export const FieldLabel = forwardRef<HTMLDivElement, FieldLabelProps>(
  (props: FieldLabelProps, ref) => {
    const { ownProps, restProps } = useDefinition(FieldLabelDefinition, props);
    const { classes, label, secondaryLabel, description, htmlFor, id } =
      ownProps;

    if (!label) return null;

    return (
      <div className={classes.root} {...restProps} ref={ref}>
        {label && (
          <Label className={classes.label} htmlFor={htmlFor} id={id}>
            {label}
            {secondaryLabel && (
              <span aria-hidden="true" className={classes.secondaryLabel}>
                ({secondaryLabel})
              </span>
            )}
          </Label>
        )}
        {description && (
          <div className={classes.description}>{description}</div>
        )}
      </div>
    );
  },
);

FieldLabel.displayName = 'FieldLabel';
