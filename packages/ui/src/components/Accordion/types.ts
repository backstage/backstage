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

import type {
  DisclosureProps as RADisclosureProps,
  HeadingProps as RAHeadingProps,
  DisclosurePanelProps as RADisclosurePanelProps,
  DisclosureGroupProps as RADisclosureGroupProps,
} from 'react-aria-components';

/**
 * Props for the Accordion component.
 * @public
 */
export interface AccordionProps extends RADisclosureProps {
  className?: string;
}

/**
 * Props for the AccordionTrigger component.
 * @public
 */
export interface AccordionTriggerProps extends RAHeadingProps {
  className?: string;
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  /**
   * Icon to display at the start of the trigger.
   * @defaultValue undefined
   */
  iconStart?: React.ReactNode;
  /**
   * Icon to display at the end of the trigger.
   * @defaultValue undefined
   */
  iconEnd?: React.ReactNode;
}

/**
 * Props for the AccordionPanel component.
 * @public
 */
export interface AccordionPanelProps extends RADisclosurePanelProps {
  className?: string;
}

/**
 * Props for the AccordionGroup component.
 * @public
 */
export interface AccordionGroupProps extends RADisclosureGroupProps {
  className?: string;
  /**
   * Whether multiple accordions can be expanded at the same time.
   * @defaultValue false
   */
  allowsMultiple?: boolean;
}
