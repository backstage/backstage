/*
 * Copyright 2020 The Backstage Authors
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
import { cn } from '../../../lib/utils';

/** @public */
export type ClosedDropdownClassKey = 'icon';

const ClosedDropdown = () => {
  return (
    <svg
      className={cn(
        'absolute right-0.5 pointer-events-none text-muted-foreground',
        'h-6 w-6',
      )}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      <path
        d="M7.5 8L6 9.5L12.0703 15.5703L18.1406 9.5L16.6406 8L12.0703 12.5703L7.5 8Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default ClosedDropdown;
