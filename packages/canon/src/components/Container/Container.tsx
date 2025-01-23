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
import React, { forwardRef } from 'react';
import { ContainerProps } from './types';
import { getClassNames } from '../../utils/getClassNames';

/** @public */
export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  (props, ref) => {
    const { children, className, style, ...restProps } = props;

    // Generate utility class names
    const utilityClassNames = getClassNames(restProps);

    // Combine the base class name, the sprinkles class name, and any additional class names
    const classNames = ['canon-container', utilityClassNames, className]
      .filter(Boolean)
      .join(' ');

    return (
      <div ref={ref} className={classNames} style={style}>
        {children}
      </div>
    );
  },
);
