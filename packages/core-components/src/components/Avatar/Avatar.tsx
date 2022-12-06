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
import MaterialAvatar from '@material-ui/core/Avatar';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React, { CSSProperties } from 'react';

import { extractInitials, stringToColor } from './utils';

/** @public */
export type AvatarClassKey = 'avatar';

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      avatar: {
        width: '4rem',
        height: '4rem',
        color: '#fff',
      },
      avatarText: {
        fontWeight: theme.typography.fontWeightBold,
        letterSpacing: '1px',
        textTransform: 'uppercase',
      },
    }),
  { name: 'BackstageAvatar' },
);

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
   */
  customStyles?: CSSProperties;
}

/**
 *  Component rendering an Avatar
 *
 * @public
 * @remarks
 *
 * Based on https://v4.mui.com/components/avatars/#avatar with some styling adjustment and two-letter initials
 */
export function Avatar(props: AvatarProps) {
  const { displayName, picture, customStyles } = props;
  const classes = useStyles();
  let styles = { ...customStyles };
  const fontStyles = {
    fontFamily: styles.fontFamily,
    fontSize: styles.fontSize,
    fontWeight: styles.fontWeight,
  };
  // We only calculate the background color if there's not an avatar
  // picture. If there is a picture, it might have a transparent
  // background and we don't know whether the calculated background
  // color will clash.
  if (!picture) {
    styles = {
      backgroundColor: stringToColor(displayName || ''),
      ...customStyles,
    };
  }
  return (
    <MaterialAvatar
      alt={displayName}
      src={picture}
      className={classes.avatar}
      style={styles}
    >
      {displayName && (
        <Typography
          variant="h6"
          component="span"
          className={classes.avatarText}
          style={fontStyles}
        >
          {extractInitials(displayName)}
        </Typography>
      )}
    </MaterialAvatar>
  );
}
