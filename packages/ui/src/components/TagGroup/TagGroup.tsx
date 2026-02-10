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

import type { TagProps, TagGroupProps } from './types';
import {
  TagGroup as ReactAriaTagGroup,
  TagList as ReactAriaTagList,
  Tag as ReactAriaTag,
  Button as ReactAriaButton,
} from 'react-aria-components';
import { forwardRef, type PropsWithRef, type ReactNode, type Ref } from 'react';
import { RiCloseCircleLine } from '@remixicon/react';
import clsx from 'clsx';
import { useStyles } from '../../hooks/useStyles';
import { TagGroupDefinition } from './definition';
import { createRoutingRegistration } from '../InternalLinkProvider';
import styles from './TagGroup.module.css';

const { RoutingProvider, useRoutingRegistrationEffect } =
  createRoutingRegistration();

/**
 * A component that renders a list of tags.
 *
 * @public
 */
export const TagGroup = <T extends object>(props: TagGroupProps<T>) => {
  const { classNames, cleanedProps } = useStyles(TagGroupDefinition, props);
  const { items, children, renderEmptyState, ...rest } = cleanedProps;

  return (
    <RoutingProvider>
      <ReactAriaTagGroup
        className={clsx(classNames.group, styles[classNames.group])}
        {...rest}
      >
        <ReactAriaTagList
          className={clsx(classNames.list, styles[classNames.list])}
          items={items}
          renderEmptyState={renderEmptyState}
        >
          {children}
        </ReactAriaTagList>
      </ReactAriaTagGroup>
    </RoutingProvider>
  );
};

/**
 * A component that renders a tag.
 *
 * @public
 */
export const Tag = forwardRef(
  (props: PropsWithRef<TagProps>, ref: Ref<HTMLDivElement>) => {
    const { classNames, cleanedProps } = useStyles(TagGroupDefinition, {
      size: 'small',
      ...props,
    });
    const { children, className, icon, size, href, ...rest } = cleanedProps;
    const textValue = typeof children === 'string' ? children : undefined;

    useRoutingRegistrationEffect(href);

    return (
      <ReactAriaTag
        ref={ref}
        textValue={textValue}
        className={clsx(classNames.tag, styles[classNames.tag], className)}
        data-size={size}
        href={href}
        {...rest}
      >
        {({ allowsRemoving }) => (
          <>
            {icon && (
              <span
                className={clsx(classNames.tagIcon, styles[classNames.tagIcon])}
              >
                {icon}
              </span>
            )}
            {children as ReactNode}
            {allowsRemoving && (
              <ReactAriaButton
                className={clsx(
                  classNames.tagRemoveButton,
                  styles[classNames.tagRemoveButton],
                )}
                slot="remove"
              >
                <RiCloseCircleLine size={16} />
              </ReactAriaButton>
            )}
          </>
        )}
      </ReactAriaTag>
    );
  },
);
