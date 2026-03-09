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

import { defineComponent } from '../../hooks/useDefinition';
import type { TimelineProps, TimelineItemProps } from './types';
import styles from './Timeline.module.css';

/**
 * Component definition for Timeline
 * @public
 */
export const TimelineDefinition = defineComponent<TimelineProps>()({
  styles,
  classNames: {
    root: 'bui-Timeline',
    item: 'bui-TimelineItem',
    itemMarker: 'bui-TimelineItemMarker',
    itemIcon: 'bui-TimelineItemIcon',
    itemLine: 'bui-TimelineItemLine',
    itemContent: 'bui-TimelineItemContent',
    itemTimestamp: 'bui-TimelineItemTimestamp',
    itemHeading: 'bui-TimelineItemHeading',
    itemDescription: 'bui-TimelineItemDescription',
  },
  propDefs: {
    children: {},
    className: {},
  },
});

/**
 * Component definition for TimelineItem
 * @public
 */
export const TimelineItemDefinition = defineComponent<TimelineItemProps>()({
  styles,
  classNames: {
    root: 'bui-TimelineItem',
    marker: 'bui-TimelineItemMarker',
    icon: 'bui-TimelineItemIcon',
    line: 'bui-TimelineItemLine',
    content: 'bui-TimelineItemContent',
    timestamp: 'bui-TimelineItemTimestamp',
    heading: 'bui-TimelineItemHeading',
    description: 'bui-TimelineItemDescription',
  },
  propDefs: {
    heading: {},
    description: {},
    timestamp: {},
    icon: {},
    className: {},
  },
});
