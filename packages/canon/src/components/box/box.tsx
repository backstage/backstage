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
import { createElement } from 'react';
import { sprinkles, Sprinkles } from './sprinkles.css';
import { base } from './box.css';

type HTMLProperties = Omit<
  React.AllHTMLAttributes<HTMLElement>,
  keyof Sprinkles
>;

type BoxProps = Sprinkles &
  HTMLProperties & {
    as?: keyof JSX.IntrinsicElements;
  };

export const Box = ({ as = 'div', className, style, ...props }: BoxProps) => {
  const sprinklesProps: Record<string, unknown> = {};
  const nativeProps: Record<string, unknown> = {};

  // Split props between sprinkles and native HTML props
  Object.entries(props).forEach(([key, value]) => {
    if (value === undefined) return;

    if (sprinkles.properties.has(key as keyof Sprinkles)) {
      sprinklesProps[key] = value;
    } else {
      nativeProps[key] = value;
    }
  });

  const sprinklesClassName = sprinkles(sprinklesProps);

  return createElement(as, {
    className: [base, sprinklesClassName, className].filter(Boolean).join(' '),
    style,
    ...nativeProps,
  });
};
