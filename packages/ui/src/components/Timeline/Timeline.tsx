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

import { forwardRef } from 'react';
import type { TimelineProps, TimelineItemProps } from './types';
import { useDefinition } from '../../hooks/useDefinition';
import { TimelineDefinition, TimelineItemDefinition } from './definition';

/**
 * Timeline component for displaying chronological events
 *
 * @remarks
 * Renders as an ordered list for semantic HTML and better accessibility.
 * Use TimelineItem components as children to display individual events.
 *
 * @public
 */
export const Timeline = forwardRef<HTMLOListElement, TimelineProps>(
  (props, ref) => {
    const { ownProps, restProps } = useDefinition(TimelineDefinition, props);
    const { classes, children } = ownProps;

    return (
      <ol ref={ref} className={classes.root} {...restProps}>
        {children}
      </ol>
    );
  },
);

Timeline.displayName = 'Timeline';

/**
 * TimelineItem component for individual timeline events
 *
 * @remarks
 * Renders as a list item with marker (icon/circle), connecting line,
 * and content area for title, timestamp, and description.
 *
 * @public
 */
export const TimelineItem = forwardRef<HTMLLIElement, TimelineItemProps>(
  (props, ref) => {
    const { ownProps, restProps } = useDefinition(
      TimelineItemDefinition,
      props,
    );
    const { classes, title, description, timestamp, icon } = ownProps;

    return (
      <li ref={ref} className={classes.root} {...restProps}>
        <div className={classes.marker}>
          <div className={classes.icon}>{icon}</div>
          <div className={classes.line} />
        </div>
        <div className={classes.content}>
          {timestamp && <div className={classes.timestamp}>{timestamp}</div>}
          <div className={classes.title}>{title}</div>
          {description && (
            <div className={classes.description}>{description}</div>
          )}
        </div>
      </li>
    );
  },
);

TimelineItem.displayName = 'TimelineItem';
