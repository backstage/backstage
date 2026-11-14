/*
 * Copyright 2022 The Backstage Authors
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

import { ButtonLink } from '@backstage/ui';
import { RiMailLine } from '@remixicon/react';
import { catalogReactTranslationRef } from '../../../translation';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';

/**
 * Email Card action link
 *
 * @private
 */
export const EmailCardAction = (props: { email: string }) => {
  const { t } = useTranslationRef(catalogReactTranslationRef);
  return (
    <ButtonLink
      variant="tertiary"
      size="small"
      iconStart={<RiMailLine />}
      href={t('entityPeekAheadPopover.emailCardAction.subTitle', {
        email: props.email,
      })}
    >
      {t('entityPeekAheadPopover.emailCardAction.title', {
        email: props.email,
      })}
    </ButtonLink>
  );
};
