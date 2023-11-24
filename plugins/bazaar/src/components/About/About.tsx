/*
 * Copyright 2021 The Backstage Authors
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
import { Grid, Typography, makeStyles } from '@material-ui/core';
import { InfoCard } from '@backstage/core-components';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { bazaarTranslationRef } from '../../translations';

const useStyles = makeStyles({
  subheader: {
    fontWeight: 'bold',
  },
});

export const About = () => {
  const classes = useStyles();
  const { t } = useTranslationRef(bazaarTranslationRef);
  return (
    <Grid container spacing={4}>
      <Grid item xs={5}>
        <InfoCard title={t('about_title')}>
          <Typography className={classes.subheader} variant="body1">
            {t('about_subheader_1')}
          </Typography>
          <Typography paragraph>{t('about_paragraph_1')}</Typography>
          <Typography className={classes.subheader} variant="body1">
            {t('about_subheader_2')}
          </Typography>
          <Typography paragraph>{t('about_paragraph_2')}</Typography>
          <Typography className={classes.subheader} variant="body1">
            {t('about_subheader_3')}
          </Typography>
          <Typography paragraph>{t('about_paragraph_3')}</Typography>
        </InfoCard>
      </Grid>
    </Grid>
  );
};
