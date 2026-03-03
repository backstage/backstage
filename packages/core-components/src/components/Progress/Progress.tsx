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
  type ComponentPropsWithoutRef,
  type PropsWithChildren,
  useEffect,
  useState,
} from 'react';

import { ProgressIndicator } from '../ui/progress';
import { cn } from '../../lib/utils';

/**
 * Default delay in milliseconds before the progress indicator becomes visible.
 * Prevents flash of loading indicator during quick operations.
 * Replaces MUI's theme.transitions.duration.short (250ms).
 */
const PROGRESS_DELAY_MS = 250;

/**
 * A loading progress indicator that appears after a short delay to prevent
 * flashing during quick loads. Wraps the shadcn/ui ProgressIndicator
 * (Radix Progress primitive) with configurable visibility delay.
 *
 * @public
 */
export function Progress(
  props: PropsWithChildren<ComponentPropsWithoutRef<typeof ProgressIndicator>>,
) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handle = setTimeout(() => setIsVisible(true), PROGRESS_DELAY_MS);
    return () => clearTimeout(handle);
  }, []);

  return isVisible ? (
    <ProgressIndicator {...props} data-testid="progress" />
  ) : (
    <div className={cn('hidden')} data-testid="progress" />
  );
}
