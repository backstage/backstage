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
import { Link } from '@backstage/core-components';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { ContentModal } from './ContentModal';
import { useStyles } from './styles';

/**
 * Props customizing the <QuickStartCard/> component.
 *
 * @public
 */
export type QuickStartCardProps = {
  /** The modal link title */
  modalTitle?: string | React.JSX.Element;
  /** The link to docs title */
  docsLinkTitle?: string;
  /** The link to docs */
  docsLink?: string;
  /** The video to play on the card */
  video?: React.JSX.Element;
  /** A quickstart image to display on the card */
  image: React.JSX.Element;
  /** The card description*/
  cardDescription?: string;
  /** A component used to download a quickStart image*/
  downloadImage?: React.JSX.Element;
};

/**
 * A component to display Quick Start info on the homepage.
 *
 * @public
 */
export const Content = (props: QuickStartCardProps): JSX.Element => {
  const styles = useStyles();
  return (
    <>
      <ContentModal
        modalContent={props.image}
        linkContent={props.modalTitle || 'Onboarding'}
      />
      <Typography variant="body1" paragraph>
        {props.cardDescription || 'Get started with Backstage'}
      </Typography>
      <ContentModal modalContent={props.image} linkContent={props.image} />
      <Grid
        container
        alignItems="center"
        className={styles.contentActionContainer}
      >
        {props.downloadImage && <Grid item>{props.downloadImage}</Grid>}
        <Grid item>
          <Link
            to={props.docsLink || 'https://backstage.io/docs/getting-started/'}
            data-testid="quick-start-link-to-docs"
            underline="none"
            variant="h6"
            className={styles.link}
          >
            {props.docsLinkTitle || 'Learn more'}
          </Link>
        </Grid>
      </Grid>
      {props.video && props.video}
    </>
  );
};
