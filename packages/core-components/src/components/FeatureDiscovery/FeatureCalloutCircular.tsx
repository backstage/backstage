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
import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

import { usePortal } from './lib/usePortal';
import { useShowCallout } from './lib/useShowCallout';

/** @public */
export type FeatureCalloutCircleClassKey =
  | '@keyframes pulsateSlightly'
  | '@keyframes pulsateAndFade'
  | 'featureWrapper'
  | 'backdrop'
  | 'dot'
  | 'pulseCircle'
  | 'text';

/**
 * Component-specific keyframe animations for the circular callout.
 * Rendered via an inline `<style>` tag within the portal to avoid
 * polluting global CSS and to keep animations scoped to this component.
 */
const keyframeStyles = `
  @keyframes pulsateSlightly {
    0% { transform: scale(1.0); }
    100% { transform: scale(1.1); }
  }
  @keyframes pulsateAndFade {
    0% { transform: scale(1.0); opacity: 0.9; }
    100% { transform: scale(1.5); opacity: 0; }
  }
`;

export type Props = {
  featureId: string;
  title: string;
  description: string;
};

type Placement = {
  dotLeft: number;
  dotTop: number;
  dotSize: number;
  borderWidth: number;
  textLeft: number;
  textTop: number;
  textWidth: number;
};

/**
 * One-time, round 'telescope' animation showing new feature.
 *
 * @public
 *
 */
export function FeatureCalloutCircular(props: PropsWithChildren<Props>) {
  const { featureId, title, description, children } = props;
  const { show, hide } = useShowCallout(featureId);
  const portalElement = usePortal('core.callout');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [placement, setPlacement] = useState<Placement | undefined>();

  const update = useCallback(() => {
    if (wrapperRef.current) {
      const wrapperBounds = wrapperRef.current.getBoundingClientRect();
      const longest = Math.max(wrapperBounds.width, wrapperBounds.height);

      const borderWidth = 800;
      const dotLeft =
        wrapperBounds.x - (longest - wrapperBounds.width) / 2 - borderWidth;
      const dotTop =
        wrapperBounds.y - (longest - wrapperBounds.height) / 2 - borderWidth;
      const dotSize = longest + 2 * borderWidth;

      const textWidth = 450;
      const textLeft = wrapperBounds.x + wrapperBounds.width / 2 - textWidth;
      const textTop =
        wrapperBounds.y - (longest - wrapperBounds.height) / 2 + longest + 20;

      setPlacement({
        dotLeft,
        dotTop,
        dotSize,
        borderWidth,
        textTop,
        textLeft,
        textWidth,
      });
    }
  }, []);

  useEffect(() => {
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update);
    };
  }, [update]);

  useLayoutEffect(update, [wrapperRef.current, update]);

  if (!show) {
    return <>{children}</>;
  }

  return (
    <>
      <div ref={wrapperRef} className="relative">
        {children}
      </div>
      {createPortal(
        <div
          className={cn('fixed inset-0 z-[2000] overflow-hidden')}
          onClick={hide}
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
              hide();
            }
          }}
          role="button"
          tabIndex={-1}
          aria-label="Dismiss feature callout"
        >
          {/* Scoped keyframe definitions for pulsate animations */}
          <style>{keyframeStyles}</style>
          <div
            className={cn(
              'absolute rounded-full bg-transparent',
              'border border-[rgba(103,146,180,0.98)]',
              'shadow-[0px_0px_0px_20000px_rgba(0,0,0,0.5)]',
              'z-[2001] origin-center',
            )}
            data-testid="dot"
            style={{
              left: placement?.dotLeft,
              top: placement?.dotTop,
              width: placement?.dotSize,
              height: placement?.dotSize,
              borderWidth: placement?.borderWidth,
              animation:
                'pulsateSlightly 1744ms 1.2s cubic-bezier(0.4, 0, 0.2, 1) alternate infinite',
            }}
            onClick={hide}
            onKeyDown={hide}
            role="button"
            tabIndex={0}
          >
            <div
              className="h-full w-full rounded-full bg-transparent border-2 border-white z-[2001] origin-center"
              style={{
                animation:
                  'pulsateAndFade 872ms 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite',
              }}
            />
          </div>
          <div
            className={cn('absolute text-white z-[2003]')}
            data-testid="text"
            style={{
              left: placement?.textLeft,
              top: placement?.textTop,
              width: placement?.textWidth,
            }}
          >
            <h2 className="mb-4 text-3xl font-bold tracking-tight">{title}</h2>
            {/* eslint-disable-next-line react/forbid-elements -- Semantic HTML replaces MUI Typography in shadcn/ui migration */}
            <p className="text-base leading-relaxed">{description}</p>
          </div>
        </div>,
        portalElement,
      )}
    </>
  );
}
