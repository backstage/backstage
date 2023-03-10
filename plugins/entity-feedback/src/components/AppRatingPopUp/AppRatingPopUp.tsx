/*
 * Copyright 2023 The Backstage Authors
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

import { createStyles, makeStyles, Theme } from '@material-ui/core';
import {
  AppRatingButton,
  AppRatingButtonProps,
} from '../AppRatingButton/AppRatingButton';
import React, { CSSProperties } from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    popup: {
      position: 'fixed',
      zIndex: 1000,
      bottom: theme.spacing(2),
      right: theme.spacing(2),
      padding: theme.spacing(2),
      backgroundColor: theme.palette.background.paper,
      '&:empty': {
        display: 'none',
      },
    },
  }),
);

/**
 * @public
 */
export type AppRatingPopupProps = AppRatingButtonProps & {
  style?: CSSProperties | undefined;
  /**
   * Change of the pop showing up, optional
   */
  chance?: number;
};

/**
 * @public
 */
export const AppRatingPopUp = (props: AppRatingPopupProps) => {
  const styles = useStyles();
  const { style, chance } = props;
  if (chance) {
    const rnd = Math.random() * 100;
    if (rnd > chance) {
      return null;
    }
  }

  return (
    <div className={styles.popup} style={style}>
      <AppRatingButton {...props} />
    </div>
  );
};
