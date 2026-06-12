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

import { forwardRef, useContext, useMemo } from 'react';
import { Switch as AriaSwitch } from 'react-aria-components';
import type { SwitchProps } from './types';
import { useDefinition } from '../../hooks/useDefinition';
import { SwitchDefinition } from './definition';
import { SwitchGroupStateContext } from '../SwitchGroup/context';

/**
 * A toggle control for switching between on and off states, with an optional visible label.
 *
 * @public
 */
export const Switch = forwardRef<HTMLLabelElement, SwitchProps>(
  (props, ref) => {
    const { ownProps, restProps, dataAttributes } = useDefinition(
      SwitchDefinition,
      props,
    );
    const { classes, label } = ownProps;

    const groupState = useContext(SwitchGroupStateContext);

    const switchProps = useMemo(() => {
      if (!groupState || !restProps.value) {
        return restProps;
      }

      const value = restProps.value;
      return {
        ...restProps,
        isSelected: groupState.isSelected(value),
        onChange(isSelected: boolean) {
          groupState.toggleValue(value);
          restProps.onChange?.(isSelected);
        },
        isDisabled: restProps.isDisabled || groupState.isDisabled,
        isReadOnly: restProps.isReadOnly || groupState.isReadOnly,
      };
    }, [groupState, restProps]);

    return (
      <AriaSwitch
        className={classes.root}
        ref={ref}
        {...dataAttributes}
        {...switchProps}
      >
        <div className={classes.indicator} />
        {label}
      </AriaSwitch>
    );
  },
);

Switch.displayName = 'Switch';
