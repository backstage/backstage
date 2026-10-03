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

import { useTranslationRef } from '@backstage/frontend-plugin-api';
import { ButtonIcon } from '@backstage/ui';
import { RiArrowLeftSLine, RiArrowRightSLine } from '@remixicon/react';
import { scaffolderTranslationRef } from '../../../translation';
import styles from './ScrollControls.module.css';

function cardStep(track: HTMLElement) {
  const firstCard = track.children[0] as HTMLElement;
  const secondCard = track.children[1] as HTMLElement | undefined;
  return secondCard
    ? secondCard.offsetLeft - firstCard.offsetLeft
    : firstCard.offsetWidth;
}

export function ScrollControls({
  track,
  canScrollPrevious,
  canScrollNext,
}: {
  track: HTMLElement;
  canScrollPrevious: boolean;
  canScrollNext: boolean;
}) {
  const { t } = useTranslationRef(scaffolderTranslationRef);

  const scroll = (direction: -1 | 1) => {
    track.scrollBy({
      left: direction * cardStep(track),
      behavior: 'smooth',
    });
  };

  return (
    <>
      {canScrollPrevious && (
        <ButtonIcon
          className={`${styles.control} ${styles.previous}`}
          aria-label={t('featuredTemplatesWidget.scrollPreviousButtonTitle')}
          variant="primary"
          icon={<RiArrowLeftSLine />}
          onPress={() => scroll(-1)}
        />
      )}
      {canScrollNext && (
        <ButtonIcon
          className={`${styles.control} ${styles.next}`}
          aria-label={t('featuredTemplatesWidget.scrollNextButtonTitle')}
          variant="primary"
          icon={<RiArrowRightSLine />}
          onPress={() => scroll(1)}
        />
      )}
    </>
  );
}
