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

import { PopoverProps as AriaPopoverProps } from 'react-aria-components';

/**
 * Properties for {@link Popover}
 *
 * @public
 */
export interface PopoverProps extends Omit<AriaPopoverProps, 'children'> {
  /**
   * The content to display inside the popover.
   * Content is automatically wrapped with padding and scroll behavior.
   */
  children: React.ReactNode;

  /**
   * Whether to hide the arrow pointing to the trigger element.
   * Arrow is also automatically hidden for MenuTrigger and SubmenuTrigger contexts.
   *
   * @defaultValue false
   */
  hideArrow?: boolean;
}
