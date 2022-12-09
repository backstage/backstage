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

import {
  HeaderIconLinkRow,
  InfoCardVariants,
} from '@backstage/core-components';
import { useEntity } from '@backstage/plugin-catalog-react';
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  makeStyles,
} from '@material-ui/core';
import React from 'react';
import { AboutContent } from './AboutContent';
import { EditMetadataButton } from './EditMetadataButton';
import { RefreshActionButton } from './RefreshActionButton';
import { ViewInSourceButton } from './ViewInSourceButton';
import { ViewInTechDocsButton } from './ViewInTechDocsButton';

const useStyles = makeStyles({
  gridItemCard: {
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100% - 10px)', // for pages without content header
    marginBottom: '10px',
  },
  fullHeightCard: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  gridItemCardContent: {
    flex: 1,
  },
  fullHeightCardContent: {
    flex: 1,
  },
});

const defaultHeaderActions = (
  <>
    <RefreshActionButton />
    <EditMetadataButton />
  </>
);

const defaultMainActions = (
  <>
    <ViewInSourceButton />
    <ViewInTechDocsButton />
  </>
);

/**
 * Props for {@link EntityAboutCard}.
 *
 * @public
 */
export interface AboutCardProps {
  variant?: InfoCardVariants;
  secondaryActions: React.ReactNode;
  mainActions: React.ReactNode;
}

/**
 * Exported publicly via the EntityAboutCard
 */
export function AboutCard(props: AboutCardProps) {
  const secondaryActions = props.secondaryActions ?? defaultHeaderActions;
  const mainActions = props.mainActions ?? defaultMainActions;

  const { variant } = props;
  const classes = useStyles();
  const { entity } = useEntity();

  let cardClass = '';
  if (variant === 'gridItem') {
    cardClass = classes.gridItemCard;
  } else if (variant === 'fullHeight') {
    cardClass = classes.fullHeightCard;
  }

  let cardContentClass = '';
  if (variant === 'gridItem') {
    cardContentClass = classes.gridItemCardContent;
  } else if (variant === 'fullHeight') {
    cardContentClass = classes.fullHeightCardContent;
  }

  return (
    <Card className={cardClass}>
      <CardHeader
        title="About"
        action={secondaryActions}
        subheader={<HeaderIconLinkRow>{mainActions}</HeaderIconLinkRow>}
      />
      <Divider />
      <CardContent className={cardContentClass}>
        <AboutContent entity={entity} />
      </CardContent>
    </Card>
  );
}
