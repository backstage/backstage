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
import { Badge } from '../ui/badge';
import { cn } from '../../lib/utils';

/**
 * Properties for the Lifecycle indicator component.
 * Supports optional shorthand mode (Greek letters) and alpha/beta state.
 */
type Props = {
  shorthand?: boolean;
  alpha?: boolean;
  className?: string;
};

/**
 * Public API type for lifecycle stage CSS class keys.
 * Preserved for backward compatibility with the overridable components system.
 * @public
 */
export type LifecycleClassKey = 'alpha' | 'beta';

/**
 * Lifecycle indicator component displaying Alpha or Beta stage badges.
 *
 * @remarks
 * Renders a styled badge indicating the lifecycle stage of a feature.
 * - Alpha: primary background with white text, serif italic styling
 * - Beta: secondary background with primary (blue) text, serif italic styling
 * - Shorthand mode renders Greek letters (α/β) at 120% font size
 * - Verbose mode renders full words ("Alpha"/"Beta")
 *
 * Migrated from MUI Typography/makeStyles to shadcn/ui Badge with Tailwind CSS.
 *
 * @example
 * ```tsx
 * <Lifecycle alpha />          // Renders "Alpha" badge
 * <Lifecycle alpha shorthand /> // Renders "α" badge
 * <Lifecycle />                // Renders "Beta" badge
 * <Lifecycle shorthand />      // Renders "β" badge
 * ```
 *
 * @public
 */
export function Lifecycle(props: Props) {
  const { shorthand, alpha, className } = props;

  /**
   * Shared serif italic styling preserved from original MUI makeStyles:
   * - alpha: white text on primary background (replaces theme.palette.common.white)
   * - beta: primary (blue) text on secondary background (replaces hardcoded #4d65cc)
   */
  const variantClass = alpha
    ? 'font-serif font-normal italic text-primary-foreground'
    : 'font-serif font-normal italic text-primary';

  // Determine the display label based on lifecycle stage and shorthand mode
  let label: string;
  if (shorthand) {
    label = alpha ? 'α' : 'β';
  } else {
    label = alpha ? 'Alpha' : 'Beta';
  }

  return (
    <Badge
      variant={alpha ? 'default' : 'secondary'}
      className={cn(variantClass, shorthand && 'text-[120%]', className)}
    >
      {label}
    </Badge>
  );
}
