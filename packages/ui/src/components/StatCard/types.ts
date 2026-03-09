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

import type { ComponentPropsWithRef, ReactNode } from 'react';

/** @public */
export type StatCardOwnProps = {
  /** The label describing the statistic */
  label: string;
  /** The value/metric to display */
  value: string | number;
  /** Optional trend indicator (e.g., "+12%", "-5%") */
  trend?: string;
  /** Status indicator for the metric */
  status?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  /** Optional icon to display alongside the label */
  icon?: ReactNode;
  /** Additional description or context */
  description?: string;
  /** Optional action handler when clicking the card */
  onPress?: () => void;
  /** Optional href to make the card a link */
  href?: string;
  /** Additional CSS class name */
  className?: string;
};

/** @public */
export type StatCardProps = StatCardOwnProps &
  Omit<ComponentPropsWithRef<'div'>, keyof StatCardOwnProps>;
