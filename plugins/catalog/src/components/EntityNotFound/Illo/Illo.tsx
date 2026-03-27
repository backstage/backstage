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

import IlloSvgUrl from './illo.svg';

export function Illo() {
  return (
    <img
      src={IlloSvgUrl}
      className="relative max-w-[96%] mt-20 mx-auto mb-8 sm:absolute sm:max-w-[60%] sm:top-[100px] sm:right-[20px] sm:mt-0 sm:mx-0 sm:mb-0"
      alt="Illustration on entity not found page"
    />
  );
}
