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

import { Line } from 'rc-progress';

import {
  ShadcnTooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '../ui/tooltip';
import { GaugePropsGetColor, getProgressColor } from './Gauge';

/**
 * CSS custom property–based palette adapter that supplies color values
 * compatible with the BackstagePalette interface used by getProgressColor.
 *
 * rc-progress sets strokeColor via inline SVG style, so CSS custom
 * property references (var(--*)) are resolved by the browser at render time.
 */
const defaultPalette = {
  status: {
    error: 'var(--destructive)',
    warning: 'var(--warning)',
    ok: 'var(--success)',
  },
} as any;

type Props = {
  /**
   * Progress value between 0.0 - 1.0.
   */
  value: number;
  width?: 'thick' | 'thin';
  getColor?: GaugePropsGetColor;
};

/**
 * Horizontal linear gauge built on rc-progress's Line component.
 * Replaces MUI Tooltip + Typography with shadcn/ui Tooltip + Tailwind span.
 * @public
 */
export function LinearGauge(props: Props) {
  const { value, getColor = getProgressColor, width = 'thick' } = props;

  if (isNaN(value)) {
    return null;
  }

  let percent = Math.round(value * 100 * 100) / 100;
  if (percent > 100) {
    percent = 100;
  }

  const lineWidth = width === 'thick' ? 4 : 1;
  const strokeColor = getColor({
    palette: defaultPalette,
    value: percent,
    inverse: false,
    max: 100,
  });

  return (
    <TooltipProvider>
      <ShadcnTooltip>
        <TooltipTrigger asChild>
          <span
            className="inline-block w-full"
            title={`${percent}%`}
            aria-label={`${percent}%`}
          >
            <Line
              percent={percent}
              strokeWidth={lineWidth}
              trailWidth={lineWidth}
              strokeColor={strokeColor}
            />
          </span>
        </TooltipTrigger>
        <TooltipContent>{`${percent}%`}</TooltipContent>
      </ShadcnTooltip>
    </TooltipProvider>
  );
}
