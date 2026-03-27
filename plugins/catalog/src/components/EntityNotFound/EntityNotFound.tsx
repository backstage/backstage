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

import { ShadcnButton } from '@backstage/core-components';
import { Illo } from './Illo';
import { catalogTranslationRef } from '../../alpha/translation';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';

/**
 * Renders a fallback page when a catalog entity cannot be found.
 *
 * @remarks
 * Displays an illustration, a translated title and description, and a
 * primary-action link to the Backstage documentation. Layout uses Tailwind CSS
 * utility classes with mobile-first responsive breakpoints.
 *
 * Spacing is mapped from the former MUI theme.spacing scale (1 unit = 8 px):
 * - Container: 16 px padding (mobile) → 192 px top / 64 px left (desktop)
 * - Title bottom padding: 16 px
 * - Body bottom padding: 40 px (mobile) → 48 px (desktop)
 */
export function EntityNotFound() {
  const { t } = useTranslationRef(catalogTranslationRef);

  return (
    <div className="relative p-4 sm:p-0 sm:pt-48 sm:pl-16">
      <Illo />
      <div className="w-full sm:w-1/2">
        <h2 className="text-[2rem] font-light leading-[1.2] tracking-tight pb-4 sm:text-[3.75rem]">
          {t('entityNotFound.title')}
        </h2>
        <p className="text-base leading-normal pb-10 sm:pb-12">
          {t('entityNotFound.description')}
        </p>
        <ShadcnButton asChild>
          <a href="https://backstage.io/docs">
            {t('entityNotFound.docButtonTitle')}
          </a>
        </ShadcnButton>
      </div>
    </div>
  );
}
