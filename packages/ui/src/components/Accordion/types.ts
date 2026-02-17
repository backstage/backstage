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
 * Own props for the Accordion component.
 * @public
 */
export type AccordionOwnProps = {
  className?: string;
};

/**
 * Props for the Accordion component.
 * @public
 */
export interface AccordionProps
  extends Omit<RADisclosureProps, 'className'>,
    AccordionOwnProps {}

/**
 * Own props for the AccordionTrigger component.
 * @public
 */
export type AccordionTriggerOwnProps = {
  className?: string;
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  /**
   * Icon to display at the start of the trigger.
   * @defaultValue undefined
   */
  iconStart?: React.ReactElement;
  /**
   * Icon to display at the end of the trigger.
   * @defaultValue undefined
   */
  iconEnd?: React.ReactElement;
};

/**
 * Props for the AccordionTrigger component.
 * @public
 */
export interface AccordionTriggerProps
  extends Omit<RAHeadingProps, 'children' | 'className'>,
    AccordionTriggerOwnProps {}

/**
 * Own props for the AccordionPanel component.
 * @public
 */
export type AccordionPanelOwnProps = {
  className?: string;
};

/**
 * Props for the AccordionPanel component.
 * @public
 */
export interface AccordionPanelProps
  extends Omit<RADisclosurePanelProps, 'className'>,
    AccordionPanelOwnProps {}

/**
 * Own props for the AccordionGroup component.
 * @public
 */
export type AccordionGroupOwnProps = {
  className?: string;
  /**
   * Whether multiple accordions can be expanded at the same time.
   * @defaultValue false
   */
  allowsMultiple?: boolean;
};

/**
 * Props for the AccordionGroup component.
 * @public
 */
export interface AccordionGroupProps
  extends Omit<RADisclosureGroupProps, 'className'>,
    AccordionGroupOwnProps {}
