'use client';

import { useCallback, useRef } from 'react';
import styles from './TokenPreview.module.css';

export type TokenPreviewKind =
  | 'color'
  | 'space'
  | 'radius'
  | 'font-size'
  | 'font-family'
  | 'font-weight'
  | 'animation'
  | 'shadow';

const READ_PROPERTY: Record<TokenPreviewKind, string> = {
  color: 'background-color',
  space: 'width',
  radius: 'border-top-left-radius',
  'font-size': 'font-size',
  'font-family': 'font-family',
  'font-weight': 'font-weight',
  animation: 'animation',
  shadow: 'box-shadow',
};

/**
 * A compact, live preview of a single Backstage UI token.
 *
 * The preview renders using the token's real CSS custom property, so it
 * reflects the currently selected theme and updates when the theme is toggled.
 * Hovering the preview resolves the token to its computed value and exposes it
 * as a native tooltip.
 */
export const TokenPreview = ({
  token,
  kind = 'color',
}: {
  token: string;
  kind?: TokenPreviewKind;
}) => {
  const ref = useRef<HTMLSpanElement>(null);

  const showValue = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const computed = getComputedStyle(el).getPropertyValue(READ_PROPERTY[kind]);
    const declared = getComputedStyle(el).getPropertyValue(token).trim();
    const value = computed?.trim() || declared;
    el.setAttribute('title', value ? `${token} → ${value}` : token);
  }, [kind, token]);

  const cssVar = `var(${token})`;

  if (kind === 'color') {
    return (
      <span className={styles.swatch} aria-hidden>
        <span
          ref={ref}
          className={styles.swatchColor}
          style={{ backgroundColor: cssVar }}
          onMouseEnter={showValue}
        />
      </span>
    );
  }

  if (kind === 'space') {
    return (
      <span className={styles.spaceTrack} aria-hidden>
        <span
          ref={ref}
          className={styles.spaceBar}
          style={{ width: cssVar }}
          onMouseEnter={showValue}
        />
      </span>
    );
  }

  if (kind === 'radius') {
    return (
      <span
        ref={ref}
        className={styles.radiusBox}
        style={{ borderRadius: cssVar }}
        onMouseEnter={showValue}
        aria-hidden
      />
    );
  }

  if (kind === 'shadow') {
    return (
      <span
        ref={ref}
        className={styles.shadowBox}
        style={{ boxShadow: cssVar }}
        onMouseEnter={showValue}
        aria-hidden
      />
    );
  }

  if (kind === 'animation') {
    return (
      <span
        ref={ref}
        className={styles.animationDot}
        style={{ animation: cssVar }}
        onMouseEnter={showValue}
        aria-hidden
      />
    );
  }

  // Typography previews: font-size, font-family, font-weight.
  const textStyle =
    kind === 'font-size'
      ? { fontSize: cssVar }
      : kind === 'font-family'
      ? { fontFamily: cssVar }
      : { fontWeight: cssVar };

  return (
    <span
      ref={ref}
      className={styles.text}
      style={textStyle}
      onMouseEnter={showValue}
      aria-hidden
    >
      Backstage UI
    </span>
  );
};
