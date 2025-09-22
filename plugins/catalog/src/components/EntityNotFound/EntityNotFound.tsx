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

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Illo } from './Illo';
import { catalogTranslationRef } from '../../alpha/translation';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';

const useStyles = makeStyles(theme => ({
  container: {
    paddingTop: theme.spacing(24),
    paddingLeft: theme.spacing(8),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(2),
    },
  },
  title: {
    paddingBottom: theme.spacing(2),
    [theme.breakpoints.down('xs')]: {
      fontSize: 32,
    },
  },
  body: {
    paddingBottom: theme.spacing(6),
    [theme.breakpoints.down('xs')]: {
      paddingBottom: theme.spacing(5),
    },
  },
}));

export function EntityNotFound() {
  const classes = useStyles();
  const { t } = useTranslationRef(catalogTranslationRef);

  return (
    <Grid container spacing={0} className={classes.container}>
      <Illo />
      <Grid item xs={12} sm={6}>
        <Typography variant="h2" className={classes.title}>
          {t('entityNotFound.title')}
        </Typography>
        <Typography variant="body1" className={classes.body}>
          {t('entityNotFound.description')}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          href="https://backstage.io/docs"
        >
          {t('entityNotFound.docButtonTitle')}
        </Button>
      </Grid>
    </Grid>
  );
}
