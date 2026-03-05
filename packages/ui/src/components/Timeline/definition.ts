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

import type { ComponentDefinition } from '../../types';

/**
 * Component definition for Timeline
 * @public
 */
export const TimelineDefinition = {
  classNames: {
    root: 'bui-Timeline',
    item: 'bui-TimelineItem',
    itemContent: 'bui-TimelineItemContent',
    itemMarker: 'bui-TimelineItemMarker',
    itemIcon: 'bui-TimelineItemIcon',
    itemLine: 'bui-TimelineItemLine',
    itemTitle: 'bui-TimelineItemTitle',
    itemDescription: 'bui-TimelineItemDescription',
    itemTimestamp: 'bui-TimelineItemTimestamp',
  },
} satisfies ComponentDefinition;
