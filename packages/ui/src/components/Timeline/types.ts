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

import type { ReactNode } from 'react';

/**
 * Props for the Timeline component
 * @public
 */
export interface TimelineProps
  extends Omit<
    React.OlHTMLAttributes<HTMLOListElement>,
    'children' | 'className'
  > {
  /**
   * Timeline items to display
   */
  children: ReactNode;
  /**
   * Additional CSS class name
   */
  className?: string;
}

/**
 * Props for the TimelineItem component
 * @public
 */
export interface TimelineItemProps
  extends Omit<React.LiHTMLAttributes<HTMLLIElement>, 'title' | 'className'> {
  /**
   * Item title or heading
   */
  title: ReactNode;
  /**
   * Item description or content
   */
  description?: ReactNode;
  /**
   * Timestamp or date for the item
   */
  timestamp?: ReactNode;
  /**
   * Icon or marker for the item
   */
  icon?: ReactNode;
  /**
   * Additional CSS class name
   */
  className?: string;
}
