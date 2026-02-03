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

import { ElementType, JSX } from 'react';
import { type IconComponent } from './types';

// Emulate the MUI4 icon type
type Mui4Icon = (props: {
  fontSize?: 'default' | 'inherit' | 'large' | 'medium' | 'small';
  otherProp?: string;
}) => JSX.Element;

// Emulate the MUI5 icon type
type Mui5Icon = (props: {
  fontSize?: 'inherit' | 'large' | 'medium' | 'small';
  otherProp?: string;
}) => JSX.Element;

// Emulate the MUI6 icon type
interface OverridableComponent<P> {
  <RootComponent extends ElementType>(
    props: {
      /**
       * The component used for the root node.
       * Either a string to use a HTML element or a component.
       */
      component: RootComponent;
    } & { stuff: number },
  ): JSX.Element | null;
  (props: P): JSX.Element | null;
}
type Mui6Icon = OverridableComponent<{
  fontSize?: 'inherit' | 'large' | 'medium' | 'small';
  otherProp?: string;
}>;

type NotAnIcon1 = (props: {
  fontSize?: 'foo';
  otherProp?: string;
}) => JSX.Element;

type NotAnIcon2 = (props: {
  fontSize?: number;
  otherProp?: string;
}) => JSX.Element;

describe('IconComponent', () => {
  // eslint-disable-next-line jest/expect-expect
  it('should be a component type', () => {
    // @ts-ignore
    let icon: IconComponent;
    icon = {} as Mui4Icon;
    icon = {} as Mui5Icon;
    icon = {} as Mui6Icon;
    // @ts-expect-error
    icon = {} as NotAnIcon1;
    // @ts-expect-error
    icon = {} as NotAnIcon2;
  });
});
