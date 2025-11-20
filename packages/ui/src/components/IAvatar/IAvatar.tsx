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

import { forwardRef, useState, useEffect } from 'react';
import clsx from 'clsx';
import { IAvatarProps } from './types';
import { useStyles } from '../../hooks/useStyles';
import { IAvatarDefinition } from './definition';
import styles from './IAvatar.module.css';

/** @public */
export const IAvatar = forwardRef<HTMLDivElement, IAvatarProps>(
  (props, ref) => {
    const { classNames, dataAttributes, cleanedProps } = useStyles(
      IAvatarDefinition,
      {
        size: 'medium',
        purpose: 'informative',
        status: 'unavailable',

        ...props,
      },
    );

    const {
      className,
      src,
      name,
      purpose,
      status,
      isHoverCardEnabled,
      ...rest
    } = cleanedProps;
    const userId = (cleanedProps as any).userId as string | undefined;

    const [imageStatus, setImageStatus] = useState<
      'loading' | 'loaded' | 'error'
    >('loading');

    useEffect(() => {
      setImageStatus('loading');
      const img = new Image();
      img.onload = () => setImageStatus('loaded');
      img.onerror = () => setImageStatus('error');
      img.src = src;

      return () => {
        img.onload = null;
        img.onerror = null;
      };
    }, [src]);

    const initialsCount = ['x-small', 'small'].includes(cleanedProps.size)
      ? 1
      : 2;

    const initials = name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toLocaleUpperCase('en-US')
      .slice(0, initialsCount);
    // Map status to CSS module class names
    const statusClass =
      status === 'active'
        ? styles.statusActive
        : status === 'busy'
        ? styles.statusBusy
        : styles.statusUnavailable;

    return (
      <div
        ref={ref}
        role="img"
        aria-label={purpose === 'informative' ? name : undefined}
        aria-hidden={purpose === 'decoration' ? true : undefined}
        className={clsx(
          classNames.root,
          styles[classNames.root],
          className,
          statusClass,
          imageStatus === 'loaded' ? styles.hasImage : styles.hasFallback,
        )}
        {...dataAttributes}
        {...rest}
      >
        {imageStatus === 'loaded' ? (
          <img
            src={src}
            alt=""
            className={clsx(classNames.image, styles[classNames.image])}
          />
        ) : (
          <div
            aria-hidden="true"
            className={clsx(classNames.fallback, styles[classNames.fallback])}
          >
            {initials}
          </div>
        )}

        {/* status indicator dot */}
        <div
          aria-hidden="true"
          className={clsx(styles.statusIndicator, statusClass)}
        />

        {/* hover card - appears only when hovering the avatar root */}
        {isHoverCardEnabled && (
          <div
            className={clsx(styles.hoverCard, statusClass)}
            role="presentation"
          >
            <div className={styles.hoverCardName}>{name}</div>
            <div className={styles.hoverCardId}>{userId ?? ''}</div>
            <div className={styles.hoverCardDivider} />
            <div className={styles.hoverCardStatusRow}>
              <span
                className={clsx(styles.statusIndicator, statusClass)}
                aria-hidden="true"
              />
              <span className={styles.hoverCardStatusText}>{status}</span>
            </div>
          </div>
        )}
      </div>
    );
  },
);

IAvatar.displayName = 'IAvatar';
