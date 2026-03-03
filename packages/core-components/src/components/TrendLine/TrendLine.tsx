/*
 * Copyright 2020 The Backstage Authors
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

import {
  Sparklines,
  SparklinesLine,
  SparklinesLineProps,
  SparklinesProps,
} from 'react-sparklines';
import { cn } from '../../lib/utils';

/**
 * Derives a CSS custom property color value based on the last data point.
 * Uses shadcn/ui token system variables for theme-aware status colors:
 * - `--success-foreground` (>=0.9) — green success indicator
 * - `--warning` (>=0.5) — amber warning indicator
 * - `--destructive` (<0.5) — red error/destructive indicator
 */
function getStatusColor(data: number[]): string | undefined {
  const lastNum = data[data.length - 1];
  if (!lastNum) return undefined;
  if (lastNum >= 0.9) return 'var(--success-foreground)';
  if (lastNum >= 0.5) return 'var(--warning)';
  return 'var(--destructive)';
}

export function TrendLine(
  props: SparklinesProps &
    Pick<SparklinesLineProps, 'color'> & { title?: string; className?: string },
) {
  if (!props.data) return null;
  return (
    <div className={cn('inline-flex items-center', props.className)}>
      <Sparklines width={120} height={30} min={0} max={1} {...props}>
        {props.title && <title>{props.title}</title>}
        <SparklinesLine color={props.color ?? getStatusColor(props.data)} />
      </Sparklines>
    </div>
  );
}
