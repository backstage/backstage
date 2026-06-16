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

import { RiCheckLine } from '@remixicon/react';
import { ListBoxItem, Text } from 'react-aria-components';
import { Avatar } from '../Avatar';
import { useDefinition } from '../../hooks/useDefinition';
import {
  SelectItemDefinition,
  SelectItemProfileDefinition,
  SelectItemTextDefinition,
} from './definition';
import type {
  SelectItemProfileProps,
  SelectItemProps,
  SelectItemTextProps,
} from './types';

/**
 * A low-level Select item wrapper for custom item content.
 *
 * @public
 */
export function SelectItem<T extends object = object>(
  props: SelectItemProps<T>,
) {
  const { ownProps, restProps } = useDefinition(SelectItemDefinition, props);
  const { classes, children, showSelectionIndicator } = ownProps;

  return (
    <ListBoxItem className={classes.root} {...restProps}>
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
 * A Select item preset with a title and optional supporting content.
 *
 * @public
 */
export function SelectItemText<T extends object = object>(
  props: SelectItemTextProps<T>,
) {
  const { ownProps, restProps } = useDefinition(
    SelectItemTextDefinition,
    props,
  );
  const { classes, title, description, leadingIcon } = ownProps;

  return (
    <SelectItem
      className={classes.root}
      textValue={title}
      showSelectionIndicator
      {...restProps}
    >
      <div className={classes.content}>
        {leadingIcon && (
          <div className={classes.leadingIcon}>{leadingIcon}</div>
        )}
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
      </div>
    </SelectItem>
  );
}

/**
 * A Select item preset for a person or other named profile.
 *
 * @public
 */
export function SelectItemProfile<T extends object = object>(
  props: SelectItemProfileProps<T>,
) {
  const { ownProps, restProps } = useDefinition(
    SelectItemProfileDefinition,
    props,
  );
  const { classes, name, src } = ownProps;

  return (
    <SelectItem
      className={classes.root}
      textValue={name}
      showSelectionIndicator
      {...restProps}
    >
      <div className={classes.content}>
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
      </div>
    </SelectItem>
  );
}
