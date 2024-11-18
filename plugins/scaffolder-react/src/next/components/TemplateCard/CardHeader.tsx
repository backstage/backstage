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
import { Theme, makeStyles, useTheme } from '@material-ui/core/styles';
import { ItemCardHeader } from '@backstage/core-components';
import { TemplateEntityV1beta3 } from '@backstage/plugin-scaffolder-common';
import { FavoriteEntity } from '@backstage/plugin-catalog-react';

const useStyles = makeStyles<
  Theme,
  {
    cardFontColor: string;
    cardBackgroundImage: string;
  }
>(() => ({
  header: {
    backgroundImage: ({ cardBackgroundImage }) => cardBackgroundImage,
    color: ({ cardFontColor }) => cardFontColor,
  },
  subtitleWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
  },
}));

/**
 * Props for the CardHeader component
 * @alpha
 */
export interface CardHeaderProps {
  template: TemplateEntityV1beta3;
}

/**
 * The Card Header with the background for the TemplateCard.
 * @alpha
 */
export const CardHeader = (props: CardHeaderProps) => {
  const {
    template: {
      metadata: { title, name },
      spec: { type },
    },
  } = props;
  const { getPageTheme } = useTheme();
  const themeForType = getPageTheme({ themeId: type });

  const styles = useStyles({
    cardFontColor: themeForType.fontColor,
    cardBackgroundImage: themeForType.backgroundImage,
  });

  const SubtitleComponent = (
    <div className={styles.subtitleWrapper}>
      <div>{type}</div>
      <div>
        <FavoriteEntity entity={props.template} style={{ padding: 0 }} />
      </div>
    </div>
  );

  return (
    <ItemCardHeader
      title={title ?? name}
      subtitle={SubtitleComponent}
      classes={{ root: styles.header }}
    />
  );
};
