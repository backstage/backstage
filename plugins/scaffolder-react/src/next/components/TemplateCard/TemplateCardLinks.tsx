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

import { IconComponent, useApp } from '@backstage/core-plugin-api';
import { TemplateEntityV1beta3 } from '@backstage/plugin-scaffolder-common';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import { makeStyles, Theme } from '@material-ui/core/styles';
import LanguageIcon from '@material-ui/icons/Language';
import React from 'react';
import { CardLink } from './CardLink';

const useStyles = makeStyles<Theme>({});

/**
 * The Props for the {@link TemplateCardLinks} component
 * @alpha
 */
export interface TemplateCardLinksProps {
  template: TemplateEntityV1beta3;
  additionalLinks?: {
    icon: IconComponent;
    text: string;
    url: string;
  }[];
}
export const TemplateCardLinks = ({
  template,
  additionalLinks,
}: TemplateCardLinksProps) => {
  const styles = useStyles();
  const app = useApp();
  const iconResolver = (key?: string): IconComponent =>
    key ? app.getSystemIcon(key) ?? LanguageIcon : LanguageIcon;
  return (
    <>
      <Grid item xs={12}>
        <Divider data-testid="template-card-separator--links" />
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={2} data-testid="template-card-links">
          {additionalLinks?.map(({ icon, text, url }, index) => (
            <Grid
              className={styles.linkText}
              item
              xs={6}
              key={index}
              data-testid="template-card-links--item"
            >
              <CardLink icon={icon} text={text} url={url} />
            </Grid>
          ))}
          {template.metadata.links?.map(({ url, icon, title }, index) => (
            <Grid
              className={styles.linkText}
              item
              xs={6}
              key={index}
              data-testid="template-card-links--metalink"
            >
              <CardLink
                icon={iconResolver(icon)}
                text={title || url}
                url={url}
              />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </>
  );
};
