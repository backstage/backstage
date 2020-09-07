/*
 * Copyright 2020 Spotify AB
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
import {
  Grid,
  Typography,
  makeStyles,
  Chip,
  IconButton,
  Card,
  CardContent,
  CardHeader,
  Divider,
} from '@material-ui/core';
import { Entity } from '@backstage/catalog-model';

import GitHubIcon from '@material-ui/icons/GitHub';
import { IconLinkVertical } from './IconLinkVertical';
import EditIcon from '@material-ui/icons/Edit';
import DocsIcon from '@material-ui/icons/Description';

const useStyles = makeStyles(theme => ({
  links: {
    margin: theme.spacing(2, 0),
    display: 'grid',
    gridAutoFlow: 'column',
    gridAutoColumns: 'min-content',
    gridGap: theme.spacing(3),
  },
  label: {
    color: theme.palette.text.secondary,
    textTransform: 'uppercase',
    fontSize: '10px',
    fontWeight: 'bold',
    letterSpacing: 0.5,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  value: {
    fontWeight: 'bold',
    overflow: 'hidden',
    lineHeight: '24px',
    wordBreak: 'break-word',
  },
  description: {
    wordBreak: 'break-word',
  },
}));

const iconMap: Record<string, React.ReactNode> = {
  github: <GitHubIcon />,
};

type CodeLinkInfo = { icon?: React.ReactNode; href?: string };

function getCodeLinkInfo(entity: Entity): CodeLinkInfo {
  const location =
    entity?.metadata?.annotations?.['backstage.io/managed-by-location'];

  if (location) {
    // split by first `:`
    // e.g. "github:https://github.com/spotify/backstage/blob/master/software.yaml"
    const [type, target] = location.split(/:(.+)/);

    return { icon: iconMap[type], href: target };
  }
  return {};
}

type AboutCardProps = {
  entity: Entity;
};

export function AboutCard({ entity }: AboutCardProps) {
  const classes = useStyles();
  const codeLink = getCodeLinkInfo(entity);

  return (
    <Card>
      <CardHeader
        title="About"
        action={
          <IconButton href={codeLink.href || '#'} aria-label="Edit">
            <EditIcon />
          </IconButton>
        }
        subheader={
          <nav className={classes.links}>
            <IconLinkVertical label="View Source" {...codeLink} />
            <IconLinkVertical
              label="View Techdocs"
              icon={<DocsIcon />}
              href={`/docs/${entity.kind}:${entity.metadata.namespace ?? ''}:${
                entity.metadata.name
              }`}
            />
          </nav>
        }
      />
      <Divider />
      <CardContent>
        <Grid container>
          <AboutField label="Description" gridSizes={{ xs: 12 }}>
            <Typography
              variant="body2"
              paragraph
              className={classes.description}
            >
              {entity?.metadata?.description || 'No description'}
            </Typography>
          </AboutField>
          <AboutField
            label="Owner"
            value={entity?.spec?.owner as string}
            gridSizes={{ xs: 12, sm: 6, lg: 4 }}
          />
          <AboutField
            label="Type"
            value={entity?.spec?.type as string}
            gridSizes={{ xs: 12, sm: 6, lg: 4 }}
          />
          <AboutField
            label="Lifecycle"
            value={entity?.spec?.lifecycle as string}
            gridSizes={{ xs: 12, sm: 6, lg: 4 }}
          />
          <AboutField
            label="Tags"
            value="No Tags"
            gridSizes={{ xs: 12, sm: 6, lg: 4 }}
          >
            {(entity?.metadata?.tags || []).map(t => (
              <Chip key={t} size="small" label={t} />
            ))}
          </AboutField>
        </Grid>
      </CardContent>
    </Card>
  );
}

function AboutField({
  label,
  value,
  gridSizes,
  children,
}: {
  label: string;
  value?: string;
  gridSizes?: Record<string, number>;
  children?: React.ReactNode;
}) {
  const classes = useStyles();

  // Content is either children or a string prop `value`
  const content = React.Children.count(children) ? (
    children
  ) : (
    <Typography variant="body2" className={classes.value}>
      {value || `unknown`}
    </Typography>
  );
  return (
    <Grid item {...gridSizes}>
      <Typography variant="subtitle2" className={classes.label}>
        {label}
      </Typography>
      {content}
    </Grid>
  );
}
