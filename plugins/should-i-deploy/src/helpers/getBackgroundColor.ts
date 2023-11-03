/*
 * Copyright 2023 The Backstage Authors
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
export const getBackegroundColor = (day: number) => {
  const red = 'Red';
  const green = 'MediumSpringGreen';
  const orange = 'LightSalmon';
  const white = 'White';
  switch (day) {
    case 1:
      return green;
    case 2:
      return green;
    case 3:
      return green;
    case 4:
      return orange;
    case 5:
      return red;
    case 6:
      return red;
    case 0:
      return red;
    default:
      return white;
  }
};
