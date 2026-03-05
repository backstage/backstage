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
import clsx from 'clsx';
import type { TimelineProps, TimelineItemProps } from './types';
import { TimelineDefinition } from './definition';
import styles from './Timeline.module.css';

/**
 * Timeline component for displaying chronological events
 * @public
 */
export const Timeline = forwardRef<HTMLDivElement, TimelineProps>(
  ({ children, className }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          TimelineDefinition.classNames.root,
          styles[TimelineDefinition.classNames.root],
          className,
        )}
      >
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
export const TimelineItem = forwardRef<HTMLDivElement, TimelineItemProps>(
  ({ title, description, timestamp, icon, className, isLast }, ref) => {
    const classNames = TimelineDefinition.classNames;

    return (
      <div
        ref={ref}
        className={clsx(classNames.item, styles[classNames.item], className)}
        data-last={isLast || undefined}
      >
        <div
          className={clsx(classNames.itemMarker, styles[classNames.itemMarker])}
        >
          {icon ? (
            <div
              className={clsx(classNames.itemIcon, styles[classNames.itemIcon])}
            >
              {icon}
            </div>
          ) : (
            <div
              className={clsx(classNames.itemIcon, styles[classNames.itemIcon])}
            />
          )}
          {!isLast && (
            <div
              className={clsx(classNames.itemLine, styles[classNames.itemLine])}
            />
          )}
        </div>
        <div
          className={clsx(
            classNames.itemContent,
            styles[classNames.itemContent],
          )}
        >
          {timestamp && (
            <div
              className={clsx(
                classNames.itemTimestamp,
                styles[classNames.itemTimestamp],
              )}
            >
              {timestamp}
            </div>
          )}
          <div
            className={clsx(classNames.itemTitle, styles[classNames.itemTitle])}
          >
            {title}
          </div>
          {description && (
            <div
              className={clsx(
                classNames.itemDescription,
                styles[classNames.itemDescription],
              )}
            >
              {description}
            </div>
          )}
        </div>
      </div>
    );
  },
);

TimelineItem.displayName = 'TimelineItem';
