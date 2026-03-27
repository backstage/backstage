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
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  MutableRefObject,
  useState,
  useLayoutEffect,
  useRef,
  PropsWithChildren,
} from 'react';

/**
 * Generates CSS gradient stops that fade from the page background to transparent.
 *
 * @remarks
 * Uses CSS `color-mix()` with `var(--background)` custom property so the gradient
 * automatically adapts to light and dark themes with zero JavaScript runtime for
 * theme detection. The stop percentages are preserved from the original easing
 * gradient (generated via https://larsenwork.com/easing-gradients/).
 */
const generateGradientStops = () => {
  return `
    var(--background) 0%,
    color-mix(in srgb, var(--background) 98.7%, transparent) 8.1%,
    color-mix(in srgb, var(--background) 95.1%, transparent) 15.5%,
    color-mix(in srgb, var(--background) 89.6%, transparent) 22.5%,
    color-mix(in srgb, var(--background) 82.5%, transparent) 29%,
    color-mix(in srgb, var(--background) 74.1%, transparent) 35.3%,
    color-mix(in srgb, var(--background) 64.8%, transparent) 41.2%,
    color-mix(in srgb, var(--background) 55%, transparent) 47.1%,
    color-mix(in srgb, var(--background) 45%, transparent) 52.9%,
    color-mix(in srgb, var(--background) 35.2%, transparent) 58.8%,
    color-mix(in srgb, var(--background) 25.9%, transparent) 64.7%,
    color-mix(in srgb, var(--background) 17.5%, transparent) 71%,
    color-mix(in srgb, var(--background) 10.4%, transparent) 77.5%,
    color-mix(in srgb, var(--background) 4.9%, transparent) 84.5%,
    color-mix(in srgb, var(--background) 1.3%, transparent) 91.9%,
    transparent 100%
  `;
};

const fadeSize = 100;
const fadePadding = 10;

type Props = {
  scrollStep?: number;
  scrollSpeed?: number; // lower is faster
  minScrollDistance?: number; // limits how small steps the scroll can take in px
};

/** @public */
export type HorizontalScrollGridClassKey =
  | 'root'
  | 'container'
  | 'fade'
  | 'fadeLeft'
  | 'fadeRight'
  | 'fadeHidden'
  | 'button'
  | 'buttonLeft'
  | 'buttonRight';

// Returns scroll distance from left and right
function useScrollDistance(
  ref: MutableRefObject<HTMLElement | undefined>,
): [number, number] {
  const [[scrollLeft, scrollRight], setScroll] = useState<[number, number]>([
    0, 0,
  ]);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) {
      setScroll([0, 0]);
      return;
    }

    const handleUpdate = () => {
      const left = el.scrollLeft;
      const right = el.scrollWidth - el.offsetWidth - el.scrollLeft;
      setScroll([left, right]);
    };

    handleUpdate();

    el.addEventListener('scroll', handleUpdate);
    window.addEventListener('resize', handleUpdate);
    // TODO(freben): Remove this eslint exception later
    // It's here because @types/react-router-dom v5 pulls in @types/react that have the wrong signature
    // eslint-disable-next-line consistent-return
    return () => {
      el.removeEventListener('scroll', handleUpdate);
      window.removeEventListener('resize', handleUpdate);
    };
  }, [ref]);

  return [scrollLeft, scrollRight];
}

// Used to animate scrolling. Returns a single setScrollTarget function, when called with e.g. 200,
// the element pointer to by the ref will be scrolled 200px forwards over time.
function useSmoothScroll(
  ref: MutableRefObject<HTMLElement | undefined>,
  speed: number,
  minDistance: number,
) {
  const [scrollTarget, setScrollTarget] = useState<number>(0);

  useLayoutEffect(() => {
    if (scrollTarget === 0) {
      return;
    }

    const startTime = window.performance.now();
    const id = requestAnimationFrame(frameTime => {
      if (!ref.current) {
        return;
      }
      const frameDuration = frameTime - startTime;
      const scrollDistance = (Math.abs(scrollTarget) * frameDuration) / speed;
      const cappedScrollDistance = Math.max(minDistance, scrollDistance);
      const scrollAmount = cappedScrollDistance * Math.sign(scrollTarget);

      ref.current.scrollBy({ left: scrollAmount });

      const newScrollTarget = scrollTarget - scrollAmount;
      if (Math.sign(scrollTarget) !== Math.sign(newScrollTarget)) {
        setScrollTarget(0);
      } else {
        setScrollTarget(newScrollTarget);
      }
    });

    // TODO(freben): Remove this eslint exception later
    // It's here because @types/react-router-dom v5 pulls in @types/react that have the wrong signature
    // eslint-disable-next-line consistent-return
    return () => cancelAnimationFrame(id);
  }, [ref, scrollTarget, speed, minDistance]);

  return setScrollTarget;
}

/**
 * Horizontal scrollable component with arrows to navigate
 *
 * @public
 *
 */
export function HorizontalScrollGrid(props: PropsWithChildren<Props>) {
  const {
    scrollStep = 100,
    scrollSpeed = 50,
    minScrollDistance = 5,
    children,
    ...otherProps
  } = props;
  const ref = useRef<HTMLElement>();

  const [scrollLeft, scrollRight] = useScrollDistance(ref);
  const setScrollTarget = useSmoothScroll(ref, scrollSpeed, minScrollDistance);

  const handleScrollClick = (forwards: boolean) => {
    const el = ref.current;
    if (!el) {
      return;
    }
    setScrollTarget(forwards ? scrollStep : -scrollStep);
  };

  // Fade gradient backgrounds using CSS custom property for theme-aware colors.
  // var(--background) resolves to the correct color in both light and dark modes.
  const fadeLeftStyle = {
    width: fadeSize,
    height: `calc(100% + ${fadePadding}px)`,
    background: `linear-gradient(90deg, ${generateGradientStops()})`,
  };

  const fadeRightStyle = {
    width: fadeSize,
    height: `calc(100% + ${fadePadding}px)`,
    background: `linear-gradient(270deg, ${generateGradientStops()})`,
  };

  return (
    <div
      {...otherProps}
      className={cn('relative flex flex-row flex-nowrap items-center')}
    >
      <div
        className={cn(
          'overflow-auto flex flex-row flex-nowrap',
          '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        )}
        ref={ref as any}
      >
        {children}
      </div>
      <div
        className={cn(
          'absolute pointer-events-none transition-opacity duration-300 left-[-10px]',
          scrollLeft === 0 && 'opacity-0',
        )}
        style={fadeLeftStyle}
      />
      <div
        className={cn(
          'absolute pointer-events-none transition-opacity duration-300 right-[-10px]',
          scrollRight === 0 && 'opacity-0',
        )}
        style={fadeRightStyle}
      />
      {scrollLeft > 0 && (
        <Button
          variant="ghost"
          size="icon"
          title="Scroll Left"
          onClick={() => handleScrollClick(false)}
          className={cn('absolute -left-4')}
        >
          <ChevronLeft />
        </Button>
      )}
      {scrollRight > 0 && (
        <Button
          variant="ghost"
          size="icon"
          title="Scroll Right"
          onClick={() => handleScrollClick(true)}
          className={cn('absolute -right-4')}
        >
          <ChevronRight />
        </Button>
      )}
    </div>
  );
}
