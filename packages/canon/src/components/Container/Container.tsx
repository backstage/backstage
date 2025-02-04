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

import { createElement, forwardRef } from 'react';
import { ContainerProps } from './types';
import clsx from 'clsx';
import { displayPropDefs } from '../../props/display.props';
import { extractProps } from '../../utils/extractProps';

/** @public */
export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  (props, ref) => {
    const { children } = props;

    const propDefs = {
      ...displayPropDefs,
    };
    const { className, style } = extractProps(props, propDefs);

    return createElement('div', {
      ref,
      className: clsx('canon-Container', className),
      style,
      children,
    });
  },
);
