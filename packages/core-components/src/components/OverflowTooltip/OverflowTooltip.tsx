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

import React from 'react';
import {
  ShadcnTooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '../ui/tooltip';
import { cn } from '../../lib/utils';

/**
 * Radix-compatible side values.
 * @internal
 */
type Side = 'top' | 'right' | 'bottom' | 'left';

/**
 * Radix-compatible align values.
 * @internal
 */
type Align = 'start' | 'center' | 'end';

/**
 * Placement values accepted by the OverflowTooltip, matching the original
 * MUI `Tooltip` placement API for full backward compatibility. Compound
 * values (e.g. `"bottom-start"`) are internally mapped to Radix `side` +
 * `align` props.
 *
 * @public
 */
type Placement =
  | 'bottom-end'
  | 'bottom-start'
  | 'bottom'
  | 'left-end'
  | 'left-start'
  | 'left'
  | 'right-end'
  | 'right-start'
  | 'right'
  | 'top-end'
  | 'top-start'
  | 'top';

/** Props for the {@link OverflowTooltip} component. */
type Props = {
  /** The text content to display and truncate when overflowing. */
  text?: string | undefined;
  /** Custom tooltip content. Falls back to `text` when not provided. */
  title?: React.ReactNode;
  /** Maximum number of lines before truncation (defaults to 1). */
  line?: number | undefined;
  /**
   * Tooltip placement relative to the trigger element.
   * Accepts the full set of MUI-compatible placement values
   * (e.g. `"bottom-start"`) which are mapped to Radix `side` + `align`.
   */
  placement?: Placement;
  /** Additional CSS class names applied to the trigger element via `cn()`. */
  className?: string;
};

/** @public */
export type OverflowTooltipClassKey = 'container';

/**
 * Parses a MUI-style placement string into Radix `side` and `align` values.
 *
 * @param placement - e.g. `"bottom"`, `"bottom-start"`, `"left-end"`
 * @returns An object with `side` and `align` keys for Radix Tooltip positioning
 * @internal
 */
function parsePlacement(placement?: Placement): {
  side: Side | undefined;
  align: Align | undefined;
} {
  if (!placement) {
    return { side: undefined, align: undefined };
  }
  const parts = placement.split('-');
  const side = parts[0] as Side;
  const align = (parts[1] as Align) ?? undefined;
  return { side, align };
}

/**
 * A text component that truncates its content after a configurable number
 * of lines and displays the full text in a tooltip on hover.
 *
 * @remarks
 * Uses Radix UI Tooltip primitives (via shadcn/ui) and Tailwind CSS utility
 * classes. The dynamic `-webkit-line-clamp` value is applied through an
 * inline style because the `line` prop accepts any number, not only the
 * fixed set provided by Tailwind's `line-clamp-*` utilities.
 *
 * @example
 * ```tsx
 * <OverflowTooltip text="A very long label that will be truncated" />
 * <OverflowTooltip text="Two-line clamp" line={2} placement="bottom" />
 * <OverflowTooltip text="Truncated" title="Full custom tooltip" />
 * ```
 *
 * @public
 */
export function OverflowTooltip(props: Props) {
  const { text, title, line = 1, placement, className } = props;
  const { side, align } = parsePlacement(placement);

  return (
    <TooltipProvider>
      <ShadcnTooltip>
        <TooltipTrigger asChild>
          <span
            className={cn(
              'inline-block max-w-full overflow-hidden text-ellipsis text-inherit',
              className,
            )}
            style={{
              display: '-webkit-box',
              WebkitLineClamp: line,
              WebkitBoxOrient: 'vertical' as const,
              overflow: 'hidden',
            }}
          >
            {text}
          </span>
        </TooltipTrigger>
        <TooltipContent side={side} align={align}>
          {title ?? text ?? ''}
        </TooltipContent>
      </ShadcnTooltip>
    </TooltipProvider>
  );
}
