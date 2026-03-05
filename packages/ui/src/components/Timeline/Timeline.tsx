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

import { forwardRef, Ref } from 'react';
import type { TimelineProps, TimelineItemProps } from './types';
import { useDefinition } from '../../hooks/useDefinition';
import { TimelineDefinition, TimelineItemDefinition } from './definition';

/**
 * Timeline component for displaying chronological events
 * @public
 */
export const Timeline = forwardRef(
  (props: TimelineProps, ref: Ref<HTMLDivElement>) => {
    const { ownProps, restProps } = useDefinition(TimelineDefinition, props);
    const { classes, children } = ownProps;

    return (
      <div ref={ref} className={classes.root} {...restProps}>
        {children}
      </div>
    );
  },
);

Timeline.displayName = 'Timeline';

/**
 * TimelineItem component for individual timeline events
 * @public
 */
export const TimelineItem = forwardRef(
  (props: TimelineItemProps, ref: Ref<HTMLDivElement>) => {
    const { ownProps, restProps } = useDefinition(
      TimelineItemDefinition,
      props,
    );
    const { classes, title, description, timestamp, icon } = ownProps;

    return (
      <div ref={ref} className={classes.root} {...restProps}>
        <div className={classes.marker}>
          {icon ? (
            <div className={classes.icon}>{icon}</div>
          ) : (
            <div className={classes.icon} />
          )}
          <div className={classes.line} />
        </div>
        <div className={classes.content}>
          {timestamp && <div className={classes.timestamp}>{timestamp}</div>}
          <div className={classes.title}>{title}</div>
          {description && (
            <div className={classes.description}>{description}</div>
          )}
        </div>
      </div>
    );
  },
);

TimelineItem.displayName = 'TimelineItem';
