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

import { ListBoxItem, Text } from 'react-aria-components';
import { RiCheckLine } from '@remixicon/react';
import { Avatar } from '../Avatar';
import { useDefinition } from '../../hooks/useDefinition';
import {
  ComboboxItemDefinition,
  ComboboxItemProfileDefinition,
  ComboboxItemTextDefinition,
} from './definition';
import type {
  ComboboxItemProfileProps,
  ComboboxItemProps,
  ComboboxItemTextProps,
} from './types';

/**
 * A combobox item wrapper for custom content.
 *
 * @public
 */
export function ComboboxItem<T extends object = object>(
  props: ComboboxItemProps<T>,
) {
  const { ownProps, restProps } = useDefinition(ComboboxItemDefinition, props);
  const { classes, children, textValue, showSelectionIndicator } = ownProps;

  return (
    <ListBoxItem {...restProps} className={classes.root} textValue={textValue}>
      {values => {
        const content =
          typeof children === 'function' ? children(values) : children;

        if (!showSelectionIndicator) {
          return content;
        }

        return (
          <>
            <div className={classes.indicator}>
              <RiCheckLine aria-hidden="true" />
            </div>
            <div className={classes.content}>{content}</div>
          </>
        );
      }}
    </ListBoxItem>
  );
}

/**
 * A combobox item that renders a title with an optional description and
 * leading icon.
 *
 * @public
 */
export function ComboboxItemText<T extends object = object>(
  props: ComboboxItemTextProps<T>,
) {
  const { ownProps, restProps } = useDefinition(
    ComboboxItemTextDefinition,
    props,
  );
  const { classes, title, description, leadingIcon, textValue } = ownProps;

  return (
    <ComboboxItem
      {...restProps}
      className={classes.root}
      textValue={textValue ?? title}
      showSelectionIndicator
    >
      {leadingIcon && <div className={classes.leadingIcon}>{leadingIcon}</div>}
      <div className={classes.text}>
        <Text slot="label" className={classes.title}>
          {title}
        </Text>
        {description && (
          <Text slot="description" className={classes.description}>
            {description}
          </Text>
        )}
      </div>
    </ComboboxItem>
  );
}

/**
 * A combobox item that renders a profile name with an optional avatar.
 *
 * @public
 */
export function ComboboxItemProfile<T extends object = object>(
  props: ComboboxItemProfileProps<T>,
) {
  const { ownProps, restProps } = useDefinition(
    ComboboxItemProfileDefinition,
    props,
  );
  const { classes, name, src, textValue } = ownProps;

  return (
    <ComboboxItem
      {...restProps}
      className={classes.root}
      textValue={textValue ?? name}
      showSelectionIndicator
    >
      <div className={classes.avatar}>
        <Avatar
          src={src ?? ''}
          name={name}
          size="x-small"
          purpose="decoration"
        />
      </div>
      <Text slot="label" className={classes.name}>
        {name}
      </Text>
    </ComboboxItem>
  );
}
