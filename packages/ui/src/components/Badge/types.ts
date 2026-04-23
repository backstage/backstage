/*
 * Copyright 2025 The Backstage Authors
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

/**
 * Own props for the Badge component.
 *
 * @public
 */
export type BadgeOwnProps = {
  /**
   * The icon to display before the badge text.
   */
  icon?: React.ReactNode;
  /**
   * The size of the badge.
   */
  size?: 'small' | 'medium';
  children?: React.ReactNode;
  className?: string;
};

/**
 * Props for the Badge component.
 *
 * @public
 */
export interface BadgeProps
  extends BadgeOwnProps,
    Omit<React.HTMLAttributes<HTMLSpanElement>, keyof BadgeOwnProps> {}
