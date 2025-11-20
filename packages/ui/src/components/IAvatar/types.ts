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
export interface IAvatarProps extends React.ComponentPropsWithoutRef<'div'> {
  /**
   * URL of the image to display
   */
  src: string;

  /**
   * Name of the person - used for generating initials and accessibility labels
   */
  name: string;

  /**
   * Size of the IAvatar
   * @defaultValue 'medium'
   */
  size?: 'x-small' | 'small' | 'medium' | 'large' | 'x-large';

  /**
   * Determines how the IAvatar is presented to assistive technologies.
   * - 'informative': IAvatar is announced as "\{name\}" to screen readers
   * - 'decoration': IAvatar is hidden from screen readers (use when name appears in adjacent text)
   * @defaultValue 'informative'
   */
  purpose?: 'decoration' | 'informative';

  /**
   * Visual presence/status of the person represented by the avatar.
   * Use to show a small status indicator and to colour the avatar shadow.
   * @defaultValue 'unavailable'
   */
  status?: 'active' | 'busy' | 'unavailable';

  /**
   * Optional id to show in the hover card (e.g. username, employee id)
   */
  userId?: string;

  /**
   * Enable or disable the hover card on avatar hover
   * @defaultValue true
   */
  isHoverCardEnabled?: boolean;
}
