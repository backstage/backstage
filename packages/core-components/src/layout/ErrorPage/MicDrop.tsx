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

import { cn } from '../../lib/utils';
import MicDropSvgUrl from './mic-drop.svg';

export type MicDropClassKey = 'micDrop';

export const MicDrop = () => {
  return (
    <img
      src={MicDropSvgUrl}
      className={cn(
        'max-w-[60%]',
        'max-sm:max-w-[96%] max-sm:mt-20 max-sm:mx-auto max-sm:mb-8',
      )}
      alt="Girl dropping mic from her hands"
    />
  );
};
