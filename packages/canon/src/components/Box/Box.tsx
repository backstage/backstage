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
import { boxSprinkles } from './sprinkles.css';
import { base } from './box.css';
import { BoxProps } from './types';

// /**
//  * Properties for {@link Box}
//  *
//  * @public
//  */
// export type BoxProps = Parameters<typeof boxSprinkles>[0] &
//   Omit<
//     React.AllHTMLAttributes<HTMLElement>,
//     keyof Parameters<typeof boxSprinkles>[0]
//   > & {
//     as?: keyof JSX.IntrinsicElements;
//   };

/** @public */
export const Box = (props: BoxProps) => {
  const { as = 'div', className, style, ...rest } = props;
  const boxSprinklesProps: Record<string, unknown> = {};
  const nativeProps: Record<string, unknown> = {};

  // Split props between sprinkles and native HTML props
  Object.entries(rest).forEach(([key, value]) => {
    if (value === undefined) return;

    if (
      boxSprinkles.properties.has(
        key as keyof Parameters<typeof boxSprinkles>[0],
      )
    ) {
      boxSprinklesProps[key] = value;
    } else {
      nativeProps[key] = value;
    }
  });

  const sprinklesClassName = boxSprinkles(boxSprinklesProps);

  return createElement(as, {
    className: [base, sprinklesClassName, className].filter(Boolean).join(' '),
    style,
    ...nativeProps,
  });
};
