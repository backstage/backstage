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

import missingAnnotation from './assets/missingAnnotation.svg';
import noInformation from './assets/noInformation.svg';
import createComponent from './assets/createComponent.svg';
import noBuild from './assets/noBuild.svg';
import { cn } from '../../lib/utils';

type Props = {
  missing: 'field' | 'info' | 'content' | 'data';
};

/** @public */
export type EmptyStateImageClassKey = 'generalImg';

const generalImgClasses = cn(
  'w-[95%] z-[2] relative left-1/2 top-1/2',
  '-translate-x-1/2 translate-y-[15%]',
);

/** @public */
export const EmptyStateImage = ({ missing }: Props) => {
  switch (missing) {
    case 'field':
      return (
        <img
          src={missingAnnotation}
          className={generalImgClasses}
          alt="annotation is missing"
        />
      );
    case 'info':
      return (
        <img
          src={noInformation}
          alt="no Information"
          className={generalImgClasses}
        />
      );
    case 'content':
      return (
        <img
          src={createComponent}
          alt="create Component"
          className={generalImgClasses}
        />
      );
    case 'data':
      return <img src={noBuild} alt="no Build" className={generalImgClasses} />;
    default:
      return null;
  }
};
