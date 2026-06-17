/*
 * Copyright 2025 The Backstage Authors
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

export interface DataProps {
  name: string;
  profilePicture?: string;
  link?: string;
  description?: string;
}

export const data: DataProps[] = [
  {
    name: 'John Lennon',
    profilePicture:
      'https://upload.wikimedia.org/wikipedia/commons/8/85/John_Lennon_1969_%28cropped%29.jpg',
  },
  {
    name: 'Paul McCartney',
    profilePicture:
      'https://d2kdkfqxnvpuu9.cloudfront.net/images/giant/51895.jpg?1341834484',
  },
  {
    name: 'Paul McCartney (Broken image link - fallback instead)',
    profilePicture:
      'https://d2kdkfqxnvpuu9.clont.net/images/giant/51895.jpg?1341834484',
  },
  {
    name: 'George Harrison (with link)',
    profilePicture:
      'https://www.who2.com/wp-content/uploads/2015/10/georgeharrison-6-scaled.jpg',
    link: 'https://en.wikipedia.org/wiki/George_Harrison',
  },
  {
    name: 'Ringo Starr (with description)',
    profilePicture:
      'https://ntvb.tmsimg.com/assets/assets/1686_v9_bb.jpg?w=360&h=480',
    description: 'Ringo Starr is a drummer and singer.',
  },
  {
    name: 'Ringo Starr (with everything)',
    profilePicture:
      'https://ntvb.tmsimg.com/assets/assets/1686_v9_bb.jpg?w=360&h=480',
    description: 'Ringo Starr is a drummer and singer.',
    link: 'https://en.wikipedia.org/wiki/George_Harrison',
  },
];
