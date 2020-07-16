/*
 * Copyright 2020 Spotify AB
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
import circle1 from './circle-1.svg';
import circle2 from './circle-2.svg';
import triangle1 from './triangle-1.svg';
import triangle2 from './triangle-2.svg';
import triangle3 from './triangle-3.svg';
import rectangle1 from './rectangle-1.svg';
import rectangle2 from './rectangle-2.svg';

export const shapes = {
  circle1: {
    backgroundImage: `url(${circle1})`,
    width: '100%',
    backgroundPosition: '100px 60%',
  },
  circle2: {
    backgroundImage: `url(${circle2})`,
    width: '100%',
    backgroundPosition: '100px 58%',
  },
  rectangle1: {
    backgroundImage: `url(${rectangle1})`,
    width: '100%',
    backgroundPosition: '100px 60%',
  },
  rectangle2: {
    backgroundImage: `url(${rectangle2})`,
    width: '100%',
    backgroundPosition: '30px 35%',
  },
  triangle1: {
    backgroundImage: `url(${triangle1})`,
    width: 'calc(500px + 30%)',
    backgroundPosition: '100px calc(50px + 45%)',
  },
  triangle2: {
    backgroundImage: `url(${triangle2})`,
    width: '100%',
    backgroundPosition: '100px 38%',
  },
  triangle3: {
    backgroundImage: `url(${triangle3})`,
    width: '100%',
    backgroundPosition: '100px 76%',
  },
};
