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

/** @public */
export const FieldLabel = forwardRef<HTMLDivElement, FieldLabelProps>(
  (props: FieldLabelProps, ref) => {
    const { label, secondaryLabel, description, htmlFor, id, ...rest } = props;

    if (!label) return null;

    return (
      <div className="canon-FieldLabel" {...rest} ref={ref}>
        {label && (
          <Label className="canon-FieldLabelLabel" htmlFor={htmlFor} id={id}>
            {label}
            {secondaryLabel && (
              <span
                aria-hidden="true"
                className="canon-FieldLabelSecondaryLabel"
              >
                ({secondaryLabel})
              </span>
            )}
          </Label>
        )}
        {description && (
          <div className="canon-FieldLabelDescription">{description}</div>
        )}
      </div>
    );
  },
);

FieldLabel.displayName = 'FieldLabel';
