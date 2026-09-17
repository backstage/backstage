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
import { Checkbox as RACheckbox } from 'react-aria-components';
import type { CheckboxProps } from './types';
import { useDefinition } from '../../hooks/useDefinition';
import { CheckboxDefinition } from './definition';
import { RiCheckLine, RiSubtractLine } from '@remixicon/react';

/**
 * A form checkbox input with support for indeterminate state and accessible labeling.
 *
 * @public
 */
export const Checkbox = forwardRef<HTMLLabelElement, CheckboxProps>(
  (props, ref) => {
    const { ownProps, restProps, dataAttributes } = useDefinition(
      CheckboxDefinition,
      props,
    );
    const { classes, children } = ownProps;
    const ariaLabel = restProps['aria-label'];
    const ariaLabelledBy = restProps['aria-labelledby'];

    useEffect(() => {
      if (!children && !ariaLabel && !ariaLabelledBy) {
        console.warn(
          'Checkbox requires either a visible label, aria-label, or aria-labelledby for accessibility',
        );
      }
    }, [children, ariaLabel, ariaLabelledBy]);

    return (
      <RACheckbox
        ref={ref}
        className={classes.root}
        {...dataAttributes}
        {...restProps}
      >
        {({ isIndeterminate }) => (
          <>
            <div className={classes.indicator} aria-hidden="true">
              {isIndeterminate ? (
                <RiSubtractLine size={12} />
              ) : (
                <RiCheckLine size={12} />
              )}
            </div>
            {children != null && <div>{children}</div>}
          </>
        )}
      </RACheckbox>
    );
  },
);
