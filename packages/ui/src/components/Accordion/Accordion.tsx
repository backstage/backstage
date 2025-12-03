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

import { forwardRef } from 'react';
import {
  Disclosure as RADisclosure,
  Button as RAButton,
  DisclosurePanel as RADisclosurePanel,
  DisclosureGroup as RADisclosureGroup,
  Heading as RAHeading,
} from 'react-aria-components';
import { RiArrowDownSLine } from '@remixicon/react';
import clsx from 'clsx';
import type {
  AccordionProps,
  AccordionTriggerProps,
  AccordionPanelProps,
  AccordionGroupProps,
} from './types';
import { useStyles } from '../../hooks/useStyles';
import { AccordionDefinition } from './definition';
import styles from './Accordion.module.css';
import { Flex } from '../Flex';

/** @public */
export const Accordion = forwardRef<
  React.ElementRef<typeof RADisclosure>,
  AccordionProps
>(({ className, ...props }, ref) => {
  const { classNames, cleanedProps } = useStyles(AccordionDefinition, props);

  return (
    <RADisclosure
      ref={ref}
      className={clsx(classNames.root, styles[classNames.root], className)}
      {...cleanedProps}
    />
  );
});

Accordion.displayName = 'Accordion';

/** @public */
export const AccordionTrigger = forwardRef<
  React.ElementRef<typeof RAHeading>,
  AccordionTriggerProps
>(({ className, title, subtitle, children, ...props }, ref) => {
  const { classNames, cleanedProps } = useStyles(AccordionDefinition, props);

  return (
    <RAHeading
      ref={ref}
      className={clsx(
        classNames.trigger,
        styles[classNames.trigger],
        className,
      )}
      {...cleanedProps}
    >
      <RAButton
        slot="trigger"
        className={clsx(
          classNames.triggerButton,
          styles[classNames.triggerButton],
        )}
      >
        {children ? (
          children
        ) : (
          <Flex gap="2" align="center">
            <span
              className={clsx(
                classNames.triggerTitle,
                styles[classNames.triggerTitle],
              )}
            >
              {title}
            </span>
            {subtitle && (
              <span
                className={clsx(
                  classNames.triggerSubtitle,
                  styles[classNames.triggerSubtitle],
                )}
              >
                {subtitle}
              </span>
            )}
          </Flex>
        )}

        <RiArrowDownSLine
          className={clsx(
            classNames.triggerIcon,
            styles[classNames.triggerIcon],
          )}
          size={16}
        />
      </RAButton>
    </RAHeading>
  );
});

AccordionTrigger.displayName = 'AccordionTrigger';

/** @public */
export const AccordionPanel = forwardRef<
  React.ElementRef<typeof RADisclosurePanel>,
  AccordionPanelProps
>(({ className, ...props }, ref) => {
  const { classNames, cleanedProps } = useStyles(AccordionDefinition, props);

  return (
    <RADisclosurePanel
      ref={ref}
      className={clsx(classNames.panel, styles[classNames.panel], className)}
      {...cleanedProps}
    />
  );
});

AccordionPanel.displayName = 'AccordionPanel';

/** @public */
export const AccordionGroup = forwardRef<
  React.ElementRef<typeof RADisclosureGroup>,
  AccordionGroupProps
>(({ className, allowsMultiple = false, ...props }, ref) => {
  const { classNames, cleanedProps } = useStyles(AccordionDefinition, props);

  return (
    <RADisclosureGroup
      ref={ref}
      allowsMultipleExpanded={allowsMultiple}
      className={clsx(classNames.group, styles[classNames.group], className)}
      {...cleanedProps}
    />
  );
});

AccordionGroup.displayName = 'AccordionGroup';
