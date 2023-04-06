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

import {
  Box,
  Chip,
  Tooltip,
  Typography,
  makeStyles,
  Grid,
  useTheme,
} from '@material-ui/core';
import { InfoCard, Progress } from '@backstage/core-components';
import Alert from '@material-ui/lab/Alert';
import { DateTime } from 'luxon';
import React from 'react';
import slugify from 'slugify';
import { useEntity } from '@backstage/plugin-catalog-react';
import { useLanguages } from '../../hooks';

const useStyles = makeStyles(theme => ({
  infoCard: {
    marginBottom: theme.spacing(3),
  },
  barContainer: {
    height: theme.spacing(2),
    marginBottom: theme.spacing(3),
    borderRadius: '4px',
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    position: 'relative',
  },
  languageDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    marginRight: theme.spacing(1),
    display: 'inline-block',
  },
  label: {
    color: 'inherit',
  },
}));

export const LinguistCard = () => {
  const classes = useStyles();
  const theme = useTheme();
  const { entity } = useEntity();
  const { items, loading, error } = useLanguages(entity);
  let barWidth = 0;

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  if (items && items.languageCount === 0 && items.totalBytes === 0) {
    return (
      <InfoCard title="Languages" className={classes.infoCard}>
        <Grid container spacing={3}>
          <Box p={2}>
            <Typography>
              There is currently no language data for this entity.
            </Typography>
          </Box>
        </Grid>
      </InfoCard>
    );
  }

  const breakdown = items?.breakdown.sort((a, b) =>
    a.percentage < b.percentage ? 1 : -1,
  );
  const processedDate = items?.processedDate;

  return breakdown && processedDate ? (
    <InfoCard title="Languages" className={classes.infoCard}>
      <Box className={classes.barContainer}>
        {breakdown.map((language, index: number) => {
          barWidth = barWidth + language.percentage;
          return (
            <Tooltip
              title={language.name}
              placement="bottom-end"
              key={slugify(language.name, { lower: true })}
            >
              <Box
                className={classes.bar}
                key={slugify(language.name, { lower: true })}
                style={{
                  marginTop: index === 0 ? '0' : `-16px`,
                  zIndex: Object.keys(breakdown).length - index,
                  backgroundColor:
                    language.color?.toString() ||
                    theme.palette.background.default,
                  width: `${barWidth}%`,
                }}
              />
            </Tooltip>
          );
        })}
      </Box>
      <Tooltip
        title={`Generated ${DateTime.fromISO(processedDate).toRelative()}`}
      >
        <Box>
          {breakdown.map(languages => (
            <Chip
              classes={{
                label: classes.label,
              }}
              label={
                <Box>
                  <Box
                    component="span"
                    className={classes.languageDot}
                    style={{
                      backgroundColor:
                        languages?.color?.toString() ||
                        theme.palette.background.default,
                    }}
                  />
                  {languages.name} - {languages.percentage}%
                </Box>
              }
              variant="outlined"
              key={slugify(languages.name, { lower: true })}
            />
          ))}
        </Box>
      </Tooltip>
    </InfoCard>
  ) : (
    <></>
  );
};
