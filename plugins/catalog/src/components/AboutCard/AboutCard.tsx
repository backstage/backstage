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

import {
  Entity,
  ENTITY_DEFAULT_NAMESPACE,
  RELATION_PROVIDES_API,
} from '@backstage/catalog-model';
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  makeStyles,
} from '@material-ui/core';
import ExtensionIcon from '@material-ui/icons/Extension';
import DocsIcon from '@material-ui/icons/Description';
import EditIcon from '@material-ui/icons/Edit';
import GitHubIcon from '@material-ui/icons/GitHub';
import React from 'react';
import { findLocationForEntityMeta } from '../../data/utils';
import { createEditLink, determineUrlType } from '../createEditLink';
import { HeaderIconLinkRow } from '@backstage/core';
import { AboutContent } from './AboutContent';

const useStyles = makeStyles({
  gridItemCard: {
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100% - 10px)', // for pages without content header
    marginBottom: '10px',
  },
  gridItemCardContent: {
    flex: 1,
  },
});

const iconMap: Record<string, React.ReactNode> = {
  github: <GitHubIcon />,
};

type CodeLinkInfo = {
  icon?: React.ReactNode;
  edithref?: string;
  href?: string;
};

function getCodeLinkInfo(entity: Entity): CodeLinkInfo {
  const location = findLocationForEntityMeta(entity?.metadata);
  if (location) {
    const type =
      location.type === 'url'
        ? determineUrlType(location.target)
        : location.type;
    return {
      icon: iconMap[type],
      edithref: createEditLink(location),
      href: location.target,
    };
  }
  return {};
}

type AboutCardProps = {
  entity: Entity;
  variant?: string;
};

export function AboutCard({ entity, variant }: AboutCardProps) {
  const classes = useStyles();
  const codeLink = getCodeLinkInfo(entity);
  // TODO: Also support RELATION_CONSUMES_API here
  const hasApis = entity.relations?.some(r => r.type === RELATION_PROVIDES_API);
  const viewInSource = {
    label: 'View Source',
    ...codeLink,
  };
  const viewInTechDocs = {
    label: 'View TechDocs',
    disabled: !entity.metadata.annotations?.['backstage.io/techdocs-ref'],
    icon: <DocsIcon />,
    href: `/docs/${entity.metadata.namespace || ENTITY_DEFAULT_NAMESPACE}/${
      entity.kind
    }/${entity.metadata.name}`,
  };
  const viewApi = {
    title: hasApis ? '' : 'No APIs available',
    label: 'View API',
    disabled: !hasApis,
    icon: <ExtensionIcon />,
    href: 'api',
  };

  return (
    <Card className={variant === 'gridItem' ? classes.gridItemCard : ''}>
      <CardHeader
        title="About"
        action={
          <IconButton
            aria-label="Edit"
            title="Edit Metadata"
            onClick={() => {
              window.open(codeLink.edithref || '#', '_blank');
            }}
          >
            <EditIcon />
          </IconButton>
        }
        subheader={
          <HeaderIconLinkRow links={[viewInSource, viewInTechDocs, viewApi]} />
        }
      />
      <Divider />
      <CardContent
        className={variant === 'gridItem' ? classes.gridItemCardContent : ''}
      >
        <AboutContent entity={entity} />
      </CardContent>
    </Card>
  );
}
