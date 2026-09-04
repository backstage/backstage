/*
 * Copyright 2026 The Backstage Authors
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

import { forwardRef, SVGProps } from 'react';

export interface IconProps extends SVGProps<SVGSVGElement> {
  color?: string;
  size?: number | string;
}

/**
 * Creates a tree-shakeable SVG icon component compatible with @remixicon/react props.
 *
 * @internal
 */
export function createIcon(pathData: string, displayName: string) {
  const Icon = forwardRef<SVGSVGElement, IconProps>(
    ({ color = 'currentColor', size = 24, className, ...props }, ref) => (
      <svg
        ref={ref}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        fill={color}
        className={className ? `bui-icon ${className}` : 'bui-icon'}
        {...props}
      >
        <path d={pathData} />
      </svg>
    ),
  );
  Icon.displayName = displayName;
  return Icon;
}
