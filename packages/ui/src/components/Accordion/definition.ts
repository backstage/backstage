/*
 * Copyright 2024 The Backstage Authors
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

import { defineComponent } from '../../hooks/useDefinition';
import type {
  AccordionOwnProps,
  AccordionTriggerOwnProps,
  AccordionPanelOwnProps,
  AccordionGroupOwnProps,
} from './types';
import styles from './Accordion.module.css';

/**
 * Component definition for Accordion
 * @public
 */
export const AccordionDefinition = defineComponent<AccordionOwnProps>()({
  styles,
  classNames: {
    root: 'bui-Accordion',
  },
  bg: 'provider',
  propDefs: {
    bg: { dataAttribute: true, default: 'neutral-auto' },
    children: {},
    className: {},
  },
});

/**
 * Component definition for AccordionTrigger
 * @public
 */
export const AccordionTriggerDefinition =
  defineComponent<AccordionTriggerOwnProps>()({
    styles,
    classNames: {
      root: 'bui-AccordionTrigger',
      button: 'bui-AccordionTriggerButton',
      title: 'bui-AccordionTriggerTitle',
      subtitle: 'bui-AccordionTriggerSubtitle',
      icon: 'bui-AccordionTriggerIcon',
    },
    propDefs: {
      className: {},
      title: {},
      subtitle: {},
      children: {},
    },
  });

/**
 * Component definition for AccordionPanel
 * @public
 */
export const AccordionPanelDefinition =
  defineComponent<AccordionPanelOwnProps>()({
    styles,
    classNames: {
      root: 'bui-AccordionPanel',
    },
    propDefs: {
      className: {},
    },
  });

/**
 * Component definition for AccordionGroup
 * @public
 */
export const AccordionGroupDefinition =
  defineComponent<AccordionGroupOwnProps>()({
    styles,
    classNames: {
      root: 'bui-AccordionGroup',
    },
    propDefs: {
      className: {},
      allowsMultiple: { default: false },
    },
  });
