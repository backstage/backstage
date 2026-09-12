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
import { forwardRef, type ReactNode } from 'react';
import { RiCloseCircleLine } from '@remixicon/react';
import { useDefinition } from '../../hooks/useDefinition';
import { TagGroupDefinition, TagDefinition } from './definition';
import { getNodeText } from '../../analytics/getNodeText';
import { BUIRoutingProvider } from '../../navigation/BUIRoutingProvider';

/**
 * A component that renders a list of tags.
 *
 * @public
 */
export const TagGroup = <T extends object>(props: TagGroupProps<T>) => {
  const { ownProps, restProps } = useDefinition(TagGroupDefinition, props);
  const { classes, items, children, renderEmptyState } = ownProps;

  return (
    <BUIRoutingProvider>
      <ReactAriaTagGroup className={classes.root} {...restProps}>
        <ReactAriaTagList
          className={classes.list}
          items={items}
          renderEmptyState={renderEmptyState}
        >
          {children}
        </ReactAriaTagList>
      </ReactAriaTagGroup>
    </BUIRoutingProvider>
  );
};

/**
 * A component that renders a tag.
 *
 * @public
 */
export const Tag = forwardRef<HTMLDivElement, TagProps>((props, ref) => {
  const { ownProps, restProps, dataAttributes, analytics } = useDefinition(
    TagDefinition,
    props,
  );
  const { classes, children, icon } = ownProps;
  const rawHref = restProps.href;
  const textValue = typeof children === 'string' ? children : undefined;

  const handlePress: typeof restProps.onPress = e => {
    restProps.onPress?.(e);
    if (rawHref) {
      const text =
        (restProps as React.AriaAttributes)['aria-label'] ??
        textValue ??
        getNodeText(children) ??
        String(rawHref);
      analytics.captureEvent('click', text, {
        attributes: { to: String(rawHref) },
      });
    }
  };

  return (
    <ReactAriaTag
      ref={ref}
      textValue={textValue}
      className={classes.root}
      {...dataAttributes}
      {...restProps}
      onPress={handlePress}
    >
      {({ allowsRemoving }) => (
        <>
          {icon && <span className={classes.icon}>{icon}</span>}
          {children as ReactNode}
          {allowsRemoving && (
            <ReactAriaButton className={classes.removeButton} slot="remove">
              <RiCloseCircleLine size={16} />
            </ReactAriaButton>
          )}
        </>
      )}
    </ReactAriaTag>
  );
});

Tag.displayName = 'Tag';
