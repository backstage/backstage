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

import { forwardRef, Ref } from 'react';
import {
  Disclosure as RADisclosure,
  Button as RAButton,
  DisclosurePanel as RADisclosurePanel,
  DisclosureGroup as RADisclosureGroup,
  Heading as RAHeading,
} from 'react-aria-components';
import { RiArrowDownSLine } from '@remixicon/react';
import type {
  AccordionProps,
  AccordionTriggerProps,
  AccordionPanelProps,
  AccordionGroupProps,
} from './types';
import { useDefinition } from '../../hooks/useDefinition';
import {
  AccordionDefinition,
  AccordionTriggerDefinition,
  AccordionPanelDefinition,
  AccordionGroupDefinition,
} from './definition';
import { Flex } from '../Flex';

/** @public */
export const Accordion = forwardRef(
  (props: AccordionProps, ref: Ref<React.ElementRef<typeof RADisclosure>>) => {
    const { ownProps, restProps, dataAttributes } = useDefinition(
      AccordionDefinition,
      props,
    );
    const { classes } = ownProps;

    return (
      <RADisclosure
        ref={ref}
        className={classes.root}
        {...dataAttributes}
        {...restProps}
      />
    );
  },
);

Accordion.displayName = 'Accordion';

/** @public */
export const AccordionTrigger = forwardRef<
  React.ElementRef<typeof RAHeading>,
  AccordionTriggerProps
>(
  (
    { className, title, subtitle, children, iconStart, iconEnd, ...props },
    ref,
  ) => {
    const { classNames, cleanedProps } = useStyles(AccordionDefinition, props);
export const AccordionTrigger = forwardRef(
  (
    props: AccordionTriggerProps,
    ref: Ref<React.ElementRef<typeof RAHeading>>,
  ) => {
    const { ownProps, restProps, dataAttributes } = useDefinition(
      AccordionTriggerDefinition,
      props,
    );
    const { classes, title, subtitle, children } = ownProps;

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
        className={classes.root}
        {...dataAttributes}
        {...restProps}
      >
        <RAButton slot="trigger" className={classes.button}>
          {children ? (
            children
          ) : (
            <Flex gap="2" align="center">
              {iconStart && (
                <span
                  className={clsx(
                    classNames.triggerIconStart,
                    styles[classNames.triggerIconStart],
                  )}
                >
                  {iconStart}
                </span>
              )}
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
              {iconEnd && (
                <span
                  className={clsx(
                    classNames.triggerIconEnd,
                    styles[classNames.triggerIconEnd],
                  )}
                >
                  {iconEnd}
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
              <span className={classes.title}>{title}</span>
              {subtitle && <span className={classes.subtitle}>{subtitle}</span>}
            </Flex>
          )}

          <RiArrowDownSLine className={classes.icon} size={16} />
        </RAButton>
      </RAHeading>
    );
  },
);

AccordionTrigger.displayName = 'AccordionTrigger';

/** @public */
export const AccordionPanel = forwardRef(
  (
    props: AccordionPanelProps,
    ref: Ref<React.ElementRef<typeof RADisclosurePanel>>,
  ) => {
    const { ownProps, restProps, dataAttributes } = useDefinition(
      AccordionPanelDefinition,
      props,
    );
    const { classes } = ownProps;

    return (
      <RADisclosurePanel
        ref={ref}
        className={classes.root}
        {...dataAttributes}
        {...restProps}
      />
    );
  },
);

AccordionPanel.displayName = 'AccordionPanel';

/** @public */
export const AccordionGroup = forwardRef(
  (
    props: AccordionGroupProps,
    ref: Ref<React.ElementRef<typeof RADisclosureGroup>>,
  ) => {
    const { ownProps, restProps, dataAttributes } = useDefinition(
      AccordionGroupDefinition,
      props,
    );
    const { classes, allowsMultiple } = ownProps;

    return (
      <RADisclosureGroup
        ref={ref}
        allowsMultipleExpanded={allowsMultiple}
        className={classes.root}
        {...dataAttributes}
        {...restProps}
      />
    );
  },
);

AccordionGroup.displayName = 'AccordionGroup';
