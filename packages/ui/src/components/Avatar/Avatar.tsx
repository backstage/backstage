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
import { AvatarProps } from './types';
import { useStyles } from '../../hooks/useStyles';
import { AvatarDefinition } from './definition';
import styles from './Avatar.module.css';

/** @public */
export const Avatar = forwardRef<HTMLDivElement, AvatarProps>((props, ref) => {
  const { classNames, dataAttributes, cleanedProps } = useStyles(
    AvatarDefinition,
    {
      size: 'medium',
      purpose: 'informative',
      ...props,
    },
  );

  const { className, src, name, purpose, ...rest } = cleanedProps;

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

  return (
    <div
      ref={ref}
      role="img"
      aria-label={purpose === 'informative' ? name : undefined}
      aria-hidden={purpose === 'decoration' ? true : undefined}
      className={clsx(classNames.root, styles[classNames.root], className)}
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
    </div>
  );
});

Avatar.displayName = 'Avatar';
