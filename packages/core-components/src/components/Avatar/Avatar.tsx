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
import { makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React, { CSSProperties } from 'react';

import { extractInitials, stringToColor } from './utils';
import classNames from 'classnames';

/** @public */
export type AvatarClassKey = 'avatar';

const useStyles = makeStyles(
  (theme: Theme) => ({
    avatar: {
      width: '4rem',
      height: '4rem',
      color: theme.palette.common.white,
      backgroundColor: (props: { backgroundColor?: string }) =>
        props.backgroundColor,
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
 * Based on https://v4.mui.com/components/avatars/#avatar with some styling adjustment and two-letter initials
 */
export function Avatar(props: AvatarProps) {
  const { displayName, picture, customStyles } = props;
  const styles = { ...customStyles };

  // TODO: Remove this with the customStyles deprecation
  const fontStyles = {
    fontFamily: styles.fontFamily,
    fontSize: styles.fontSize,
    fontWeight: styles.fontWeight,
  };

  // We only calculate the background color if there's not an avatar
  // picture. If there is a picture, it might have a transparent
  // background and we don't know whether the calculated background
  // color will clash.
  const classes = useStyles(
    !picture ? { backgroundColor: stringToColor(displayName || '') } : {},
  );

  const avatarClassNames = classNames(props.classes?.avatar, classes.avatar);
  const avatarTextClassNames = classNames(
    props.classes?.avatarText,
    classes.avatarText,
  );

  return (
    <MaterialAvatar
      alt={displayName}
      src={picture}
      className={avatarClassNames}
      style={styles}
    >
      {displayName && (
        <Typography
          variant="h6"
          component="span"
          className={avatarTextClassNames}
          style={fontStyles}
        >
          {extractInitials(displayName)}
        </Typography>
      )}
    </MaterialAvatar>
  );
}
