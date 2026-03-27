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
import { CSSProperties } from 'react';

import { ShadcnAvatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { cn } from '../../lib/utils';
import { extractInitials, stringToColor } from './utils';

/** @public */
export type AvatarClassKey = 'avatar';

/**
 * Properties for {@link Avatar}.
 *
 * @public
 */
export interface AvatarProps {
  /**
   * A display name, which will be used to generate initials as a fallback in case a picture is not provided.
   */
  displayName?: string;
  /**
   * URL to avatar image source
   */
  picture?: string;
  /**
   * Custom styles applied to avatar
   * @deprecated - use the classes property instead
   */
  customStyles?: CSSProperties;

  /**
   * Custom styles applied to avatar
   */
  classes?: { [key in 'avatar' | 'avatarText']?: string };
}

/**
 *  Component rendering an Avatar
 *
 * @public
 * @remarks
 *
 * Renders a circular avatar with image support and initials fallback.
 * Uses Radix Avatar primitives via shadcn/ui for accessible image loading with fallback.
 */
export function Avatar(props: AvatarProps) {
  const { displayName, picture, customStyles } = props;
  const styles = { ...customStyles };

  // Calculate deterministic background color from display name when no picture.
  // If there is a picture, it might have a transparent background and we don't
  // know whether the calculated background color will clash.
  const backgroundColor = !picture
    ? stringToColor(displayName || '')
    : undefined;

  return (
    <ShadcnAvatar
      className={cn('h-16 w-16 text-white', props.classes?.avatar)}
      style={{
        ...styles,
        ...(backgroundColor ? { backgroundColor } : {}),
      }}
    >
      {picture && <AvatarImage src={picture} alt={displayName} />}
      {displayName && (
        <AvatarFallback
          className={cn(
            'flex h-full w-full items-center justify-center rounded-full font-bold uppercase tracking-wider',
            props.classes?.avatarText,
          )}
          style={{
            ...(backgroundColor ? { backgroundColor } : {}),
            fontFamily: styles.fontFamily,
            fontSize: styles.fontSize,
            fontWeight: styles.fontWeight,
          }}
        >
          {extractInitials(displayName)}
        </AvatarFallback>
      )}
      {!displayName && !picture && (
        <AvatarFallback className="flex h-full w-full items-center justify-center rounded-full bg-muted" />
      )}
    </ShadcnAvatar>
  );
}
