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

/** @public */
export interface AvatarProps extends React.ComponentPropsWithoutRef<'div'> {
  /**
   * URL of the image to display
   */
  src: string;

  /**
   * Name of the person - used for generating initials and accessibility labels
   */
  name: string;

  /**
   * Size of the avatar
   * @defaultValue 'medium'
   */
  size?: 'x-small' | 'small' | 'medium' | 'large' | 'x-large';

  /**
   * Determines how the avatar is presented to assistive technologies.
   * - 'informative': Avatar is announced as "\{name\}" to screen readers
   * - 'decoration': Avatar is hidden from screen readers (use when name appears in adjacent text)
   * @defaultValue 'informative'
   */
  purpose?: 'decoration' | 'informative';
}
