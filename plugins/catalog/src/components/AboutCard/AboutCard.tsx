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
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  makeStyles,
} from '@material-ui/core';
import React from 'react';
import {
  EditMetadataButton,
  RefreshButton,
  ViewInSourceButton,
  ViewInTechDocsButton,
} from './buttons';
import {
  DescriptionAboutField,
  DomainAboutField,
  LifecycleAboutField,
  LocationTargetsAboutField,
  OwnerAboutField,
  ParentComponentAboutField,
  SystemAboutField,
  TagsAboutField,
  TypeAboutField,
} from './fields';

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

/**
 * Props for {@link EntityAboutCard}.
 *
 * @public
 */
export interface AboutCardProps {
  variant?: InfoCardVariants;
  primaryButtons?: JSX.Element[];
  secondaryButtons?: JSX.Element[];
  fields?: JSX.Element[];
}

export const primaryButtons = [
  <ViewInSourceButton />,
  <ViewInTechDocsButton />,
];

export const secondaryButtons = [
  <RefreshActionButton />,
  <EditMetadataButton />,
];

export const fields = [
  <DescriptionAboutField />,
  <OwnerAboutField />,
  <DomainAboutField />,
  <SystemAboutField />,
  <ParentComponentAboutField />,
  <TypeAboutField />,
  <LifecycleAboutField />,
  <TagsAboutField />,
  <LocationTargetsAboutField />,
];

/**
 * Exported publicly via the EntityAboutCard
 */
export function AboutCard(props: AboutCardProps) {
  const { variant } = props;
  const classes = useStyles();

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
        action={props.secondaryButtons ?? secondaryButtons}
        subheader={
          <HeaderIconLinkRow>
            {props.primaryButtons ?? primaryButtons}
          </HeaderIconLinkRow>
        }
      />
      <Divider />
      <CardContent className={cardContentClass}>
        <Grid container>{props.fields ?? fields}</Grid>
      </CardContent>
    </Card>
  );
}
