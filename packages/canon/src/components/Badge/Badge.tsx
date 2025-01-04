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
import { BadgeProps } from './types';
import { useCanon } from '../../contexts/canon';

/** @public */
export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  (props: BadgeProps, ref) => {
    const { size = 'medium', color, outline, children } = props;

    const { getResponsiveValue } = useCanon();

    const responsiveSize = getResponsiveValue(size);

    return (
      <div
        {...props}
        ref={ref}
        className={[
          'cn-badge',
          `cn-badge-${responsiveSize}`,
          color ? `cn-badge-color-${color}` : '',
        ]
          .filter(Boolean)
          .join(' ')}
        data-outline={outline}
      >
        {children}
      </div>
    );
  },
);

export default Badge;
