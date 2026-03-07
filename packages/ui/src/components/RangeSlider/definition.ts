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
 * Component definition for RangeSlider
 * @public
 */
export const RangeSliderDefinition = {
  classNames: {
    root: 'bui-RangeSlider',
    header: 'bui-RangeSliderHeader',
    track: 'bui-RangeSliderTrack',
    trackFill: 'bui-RangeSliderTrackFill',
    thumb: 'bui-RangeSliderThumb',
    output: 'bui-RangeSliderOutput',
  },
  dataAttributes: {
    disabled: [true, false] as const,
    orientation: ['horizontal', 'vertical'] as const,
  },
} as const satisfies ComponentDefinition;
