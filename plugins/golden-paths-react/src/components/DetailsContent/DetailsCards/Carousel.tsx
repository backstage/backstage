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
import { useEffect, useRef, useState } from 'react';
import { Box } from '@material-ui/core';
import ArrowButton from './ArrowButton';
import BubbleItem from './BubbleItem';
import CarouselCard from './CarouselCard';
import { GoldenPathEntityStepV1beta1 } from '@backstage/plugin-golden-paths-common';
import { useApi } from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import useAsync from 'react-use/lib/useAsync';
import { Entity } from '@backstage/catalog-model';
import { useCarouselStyles } from './DetailsCards.styles';

interface CarouselProps {
  items: GoldenPathEntityStepV1beta1[];
}

const SCROLL_AMOUNT = 220;

const Carousel = ({ items }: CarouselProps) => {
  const classes = useCarouselStyles();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const catalogApi = useApi(catalogApiRef);
  const { value: template } = useAsync(
    async (): Promise<Entity | undefined> => {
      if (!items || !items.length) return undefined;

      return await catalogApi.getEntityByRef(items[0].template);
    },
  );

  const scroll = (dir: 'left' | 'right') => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollLeft +=
      dir === 'left' ? -SCROLL_AMOUNT : SCROLL_AMOUNT;
  };

  const updateArrows = () => {
    const el = carouselRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
  };

  useEffect(() => {
    updateArrows();

    const el = carouselRef.current;
    if (!el) return undefined;

    el.addEventListener('scroll', updateArrows);
    window.addEventListener('resize', updateArrows);

    return () => {
      el.removeEventListener('scroll', updateArrows);
      window.removeEventListener('resize', updateArrows);
    };
  }, [items]);

  const templateHaveParameters = !(
    Array.isArray(template?.spec?.parameters) &&
    (template?.spec?.parameters?.length || 0) > 0
  );

  return (
    <Box className={classes.root}>
      {canScrollLeft && (
        <ArrowButton direction="left" onClick={() => scroll('left')} />
      )}

      {canScrollRight && (
        <ArrowButton direction="right" onClick={() => scroll('right')} />
      )}

      <div className={classes.carousel} ref={carouselRef}>
        <BubbleItem
          label="Providing common information"
          isFirst
          isDisabled={templateHaveParameters}
        />

        {items.map((it, idx) => {
          return (
            <CarouselCard
              key={idx}
              item={it}
              isLast={items.length - 1 === idx}
            />
          );
        })}
        <BubbleItem label="Completed" isCompleted />
      </div>
    </Box>
  );
};

export default Carousel;
