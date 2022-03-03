/*
 * Copyright 2022 The Backstage Authors
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

import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core';
import { ItemCardHeader } from '@backstage/core-components';
import { BackstageTheme } from '@backstage/theme';

const useStyles = makeStyles<{}, { cardBackgroundImage: string }>(theme => ({
  header: {
    backgroundImage: ({ cardBackgroundImage }) => cardBackgroundImage,
  },
}));

/**
 * Props for the CardHeader component
 */
export interface CardHeaderProps {
  type?: string;
  title: string;
}

/**
 * The Card Header with the background for the TemplateCard.
 */
export const CardHeader = (props: CardHeaderProps) => {
  const { type = 'other', title } = props;
  const { getPageTheme } = useTheme<BackstageTheme>();
  const themeForType = getPageTheme({ themeId: type });
  const styles = useStyles({
    cardBackgroundImage: themeForType.backgroundImage,
  });

  return (
    <ItemCardHeader
      title={title}
      subtitle={type}
      classes={{ root: styles.header }}
    />
  );
};
