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
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React, { PropsWithChildren, ReactNode } from 'react';
import { Helmet } from 'react-helmet';

/**
 * TODO: favoriteable capability
 */

/** @public */
export type ContentHeaderClassKey =
  | 'container'
  | 'leftItemsBox'
  | 'rightItemsBox'
  | 'description'
  | 'title';

const useStyles = (props: ContentHeaderProps) =>
  makeStyles(
    theme => ({
      container: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: theme.spacing(2),
        textAlign: props.textAlign,
      },
      leftItemsBox: {
        flex: '1 1 auto',
        minWidth: 0,
        overflow: 'visible',
      },
      rightItemsBox: {
        flex: '0 1 auto',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        marginLeft: theme.spacing(1),
        minWidth: 0,
        overflow: 'visible',
      },
      description: {},
      title: {
        display: 'inline-flex',
        marginBottom: 0,
      },
    }),
    { name: 'BackstageContentHeader' },
  );

type ContentHeaderTitleProps = {
  title?: string;
  className?: string;
};

const ContentHeaderTitle = ({ title, className }: ContentHeaderTitleProps) => (
  <Typography
    variant="h4"
    component="h2"
    className={className}
    data-testid="header-title"
  >
    {title}
  </Typography>
);

type ContentHeaderDescriptionProps = {
  description?: string;
  className?: string;
};

const ContentHeaderDescription = ({
  description,
  className,
}: ContentHeaderDescriptionProps) =>
  description ? (
    <Typography
      variant="body2"
      className={className}
      data-testid="header-description"
    >
      {description}
    </Typography>
  ) : null;

type ContentHeaderProps = {
  title?: ContentHeaderTitleProps['title'];
  titleComponent?: ReactNode;
  description?: ContentHeaderDescriptionProps['description'];
  descriptionComponent?: ReactNode;
  textAlign?: 'left' | 'right' | 'center';
};

/**
 *  A header at the top inside a {@link Content}.
 *
 * @public
 *
 */

export function ContentHeader(props: PropsWithChildren<ContentHeaderProps>) {
  const {
    description,
    title,
    titleComponent: TitleComponent = undefined,
    children,
    descriptionComponent: DescriptionComponent = undefined,
    textAlign = 'left',
  } = props;
  const classes = useStyles({ textAlign })();

  const renderedTitle = TitleComponent ? (
    TitleComponent
  ) : (
    <ContentHeaderTitle title={title} className={classes.title} />
  );

  const renderedDescription = DescriptionComponent ? (
    DescriptionComponent
  ) : (
    <ContentHeaderDescription
      description={description}
      className={classes.description}
    />
  );

  return (
    <>
      <Helmet title={title} />
      <Box className={classes.container}>
        <Box className={classes.leftItemsBox}>
          {renderedTitle}
          {renderedDescription}
        </Box>
        <Box className={classes.rightItemsBox}>{children}</Box>
      </Box>
    </>
  );
}
