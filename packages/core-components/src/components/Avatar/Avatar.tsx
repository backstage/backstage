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
import React, { CSSProperties } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import MaterialAvatar from '@material-ui/core/Avatar';
import { extractInitials, stringToColor } from './utils';

export type AvatarClassKey = 'avatar';

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      avatar: {
        width: '4rem',
        height: '4rem',
        color: '#fff',
        fontWeight: theme.typography.fontWeightBold,
        letterSpacing: '1px',
        textTransform: 'uppercase',
      },
    }),
  { name: 'BackstageAvatar' },
);

/**
 * Properties for {@link Avatar}
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
   */
  customStyles?: CSSProperties;
}

/**
 *  Component rendering an Avatar
 *
 *  @remarks
 *
 *  Based on https://v4.mui.com/components/avatars/#avatar with some styling adjustment and two-letter initials
 */
export function Avatar(props: AvatarProps) {
  const { displayName, picture, customStyles } = props;
  const classes = useStyles();
  return (
    <MaterialAvatar
      alt={displayName}
      src={picture}
      className={classes.avatar}
      style={{
        backgroundColor: stringToColor(displayName || picture || ''),
        ...customStyles,
      }}
    >
      {displayName && extractInitials(displayName)}
    </MaterialAvatar>
  );
}
