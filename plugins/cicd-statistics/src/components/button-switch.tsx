/*
 * Copyright 2022 The Backstage Authors
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

import React, { useCallback, MouseEvent } from 'react';
import { ButtonGroup, Button, Tooltip, Zoom } from '@material-ui/core';

export interface SwitchValueDetails<T extends string> {
  value: T;
  tooltip?: string;
  text?: string | JSX.Element;
}

export type SwitchValue<T extends string> = T | SwitchValueDetails<T>;

export interface ButtonSwitchPropsBase<T extends string> {
  values: ReadonlyArray<SwitchValue<T>>;
  vertical?: boolean;
}
export interface ButtonSwitchPropsSingle<T extends string>
  extends ButtonSwitchPropsBase<T> {
  multi?: false;
  selection: T;
  onChange: (selected: T) => void;
}
export interface ButtonSwitchPropsMulti<T extends string>
  extends ButtonSwitchPropsBase<T> {
  multi: true;
  selection: ReadonlyArray<T>;
  onChange: (selected: Array<T>) => void;
}

export type ButtonSwitchProps<T extends string> =
  | ButtonSwitchPropsSingle<T>
  | ButtonSwitchPropsMulti<T>;

function switchValue<T extends string>(value: SwitchValue<T>): T {
  return typeof value === 'object' ? value.value : value;
}

function switchText<T extends string>(
  value: SwitchValue<T>,
): string | JSX.Element {
  return typeof value === 'object' ? value.text ?? value.value : value;
}

function findParent(tagName: string, elem: HTMLElement): HTMLElement {
  let node: HTMLElement | null = elem;
  while (node.tagName !== tagName) {
    node = node.parentElement;
    if (!node) {
      throw new Error(`Couldn't find ${tagName} parent`);
    }
  }
  return node;
}

export function ButtonSwitch<T extends string>(props: ButtonSwitchProps<T>) {
  const { values, vertical = false } = props;

  const onClick = useCallback(
    (ev: MouseEvent<HTMLSpanElement>) => {
      const btn = findParent('BUTTON', ev.target as HTMLElement);
      const index = [...btn.parentElement!.children].findIndex(
        child => child === btn,
      );
      const value = switchValue(values[index]);

      if (props.multi) {
        props.onChange(
          props.selection.includes(value as T)
            ? props.selection.filter(val => val !== value)
            : [...props.selection, value as T],
        );
      } else {
        props.onChange(value as T);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [values, props.selection, props.multi, props.onChange],
  );

  const hasSelection = (value: T) => {
    if (props.multi) {
      return props.selection.includes(value);
    }
    return props.selection === value;
  };

  const tooltipify = (value: SwitchValue<T>, elem: JSX.Element) =>
    typeof value === 'object' && value.tooltip ? (
      <Tooltip
        key={value.value}
        TransitionComponent={Zoom}
        title={value.tooltip}
        arrow
      >
        {elem}
      </Tooltip>
    ) : (
      elem
    );

  return (
    <ButtonGroup
      disableElevation
      orientation={vertical ? 'vertical' : 'horizontal'}
      variant="outlined"
      size="small"
    >
      {values.map(value =>
        tooltipify(
          value,
          <Button
            key={switchValue(value)}
            color={hasSelection(switchValue(value)) ? 'primary' : 'default'}
            variant={
              hasSelection(switchValue(value)) ? 'contained' : 'outlined'
            }
            onClick={onClick}
          >
            {switchText(value)}
          </Button>,
        ),
      )}
    </ButtonGroup>
  );
}
