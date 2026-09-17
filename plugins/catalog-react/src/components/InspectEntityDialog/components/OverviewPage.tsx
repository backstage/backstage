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

import { AlphaEntity } from '@backstage/catalog-model/alpha';
import { Link } from '@backstage/core-components';
import {
  Text,
  Box,
  Flex,
  Card,
  CardHeader,
  CardBody,
  TagGroup,
  Tag,
  ButtonIcon,
  ButtonLink,
  VisuallyHidden,
} from '@backstage/ui';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { RiFileCopyLine, RiCheckLine, RiQuestionLine } from '@remixicon/react';
import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { EntityRefLink } from '../../EntityRefLink';
import { ListSection, ListItemRow } from './common';
import { stringifyEntityRef } from '@backstage/catalog-model';
import { catalogReactTranslationRef } from '../../../translation';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';

const useStyles = makeStyles({
  headingWithIcon: {
    display: 'flex',
    alignItems: 'center',
  },
  definitionList: {
    margin: 0,
    padding: 0,
  },
  definitionItem: {
    display: 'flex',
    alignItems: 'flex-start',
    marginTop: 'var(--bui-space-4)',
    paddingLeft: 'var(--bui-space-4)',
    fontFamily: 'monospace',
    fontSize: 'var(--bui-font-size-3)',
    '&:first-child': {
      marginTop: 0,
    },
  },
  definitionContent: {
    flex: 1,
    minWidth: 0,
  },
  definitionKey: {
    fontWeight: 'bold',
  },
  definitionValue: {
    margin: 0,
    marginTop: 'var(--bui-space-1)',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  copyAction: {
    marginLeft: 'var(--bui-space-2)',
    flexShrink: 0,
  },
  relationGroup: {
    '& + &': {
      marginTop: 'var(--bui-space-4)',
    },
  },
  monospace: {
    fontFamily: 'monospace',
  },
  sectionHeading: {
    marginTop: 'var(--bui-space-3)',
  },
  metadataList: {
    marginTop: 'var(--bui-space-2)',
  },
  relationList: {
    marginTop: 'var(--bui-space-2)',
  },
  tagGroup: {
    marginTop: 'var(--bui-space-3)',
    paddingLeft: 'var(--bui-space-4)',
  },
});

// Extracts a link from a value, if possible
function findLink(value: string): string | undefined {
  if (value.match(/^url:https?:\/\//)) {
    return value.slice('url:'.length);
  }
  if (value.match(/^https?:\/\//)) {
    return value;
  }
  return undefined;
}

function entriesToItems(entries: [string, string][]) {
  return entries.map(([key, value]) => {
    const link = findLink(value);
    return {
      key,
      value: link ? <Link to={link}>{value}</Link> : value,
    };
  });
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const { t } = useTranslationRef(catalogReactTranslationRef);
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const handlePress = async () => {
    try {
      await window.navigator.clipboard.writeText(text);
      setCopied(true);
      timerRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access denied or unavailable
    }
  };

  return (
    <>
      <ButtonIcon
        icon={copied ? <RiCheckLine /> : <RiFileCopyLine />}
        aria-label={t('inspectEntityDialog.overviewPage.copyAriaLabel', {
          label,
        })}
        variant="tertiary"
        size="small"
        onPress={handlePress}
      />
      <VisuallyHidden role="status">
        {copied ? t('inspectEntityDialog.overviewPage.copiedStatus') : ''}
      </VisuallyHidden>
    </>
  );
}

function HelpIcon(props: { to: string }) {
  const { t } = useTranslationRef(catalogReactTranslationRef);
  return (
    <ButtonLink
      href={props.to}
      target="_blank"
      rel="noopener noreferrer"
      variant="tertiary"
      size="small"
      iconStart={<RiQuestionLine />}
      aria-label={t('inspectEntityDialog.overviewPage.helpLinkAriaLabel')}
    />
  );
}

function Container(props: {
  title: ReactNode;
  helpLink?: string;
  children: ReactNode;
}) {
  const classes = useStyles();
  return (
    <Card>
      <CardHeader>
        <Text
          variant="title-x-small"
          as="h3"
          className={props.helpLink ? classes.headingWithIcon : undefined}
        >
          {props.title}
          {props.helpLink && <HelpIcon to={props.helpLink} />}
        </Text>
      </CardHeader>
      <CardBody>{props.children}</CardBody>
    </Card>
  );
}

function ListSubheader(props: { children: ReactNode; className?: string }) {
  const classes = useStyles();
  return (
    <Text
      variant="body-large"
      as="h4"
      className={classNames(classes.headingWithIcon, props.className)}
    >
      {props.children}
    </Text>
  );
}

function KeyValueList(props: {
  items: { key: string; value: ReactNode; copyable?: boolean }[];
  className?: string;
  'aria-label'?: string;
}) {
  const classes = useStyles();
  return (
    <dl
      className={classNames(classes.definitionList, props.className)}
      aria-label={props['aria-label']}
    >
      {props.items.map(item => (
        <div key={item.key} className={classes.definitionItem}>
          <div className={classes.definitionContent}>
            <dt className={classes.definitionKey}>{item.key}</dt>
            <dd className={classes.definitionValue}>{item.value}</dd>
          </div>
          {item.copyable && typeof item.value === 'string' && (
            <div className={classes.copyAction}>
              <CopyButton text={item.value} label={item.key} />
            </div>
          )}
        </div>
      ))}
    </dl>
  );
}

export function OverviewPage(props: { entity: AlphaEntity }) {
  const classes = useStyles();
  const {
    apiVersion,
    kind,
    metadata,
    spec,
    relations = [],
    status = {},
  } = props.entity;

  const groupedRelations = groupBy(
    sortBy(relations, r => r.targetRef),
    'type',
  );
  const { t } = useTranslationRef(catalogReactTranslationRef);

  const entityRef = stringifyEntityRef(props.entity);
  return (
    <Flex direction="column" gap="4">
      <Container title={t('inspectEntityDialog.overviewPage.identity.title')}>
        <KeyValueList
          aria-label={t('inspectEntityDialog.overviewPage.identity.title')}
          items={[
            { key: 'apiVersion', value: apiVersion },
            { key: 'kind', value: kind },
            ...(spec?.type
              ? [{ key: 'spec.type', value: spec.type.toString() }]
              : []),
            ...(metadata.uid
              ? [{ key: 'uid', value: metadata.uid, copyable: true }]
              : []),
            ...(metadata.etag
              ? [{ key: 'etag', value: metadata.etag, copyable: true }]
              : []),
            { key: 'entityRef', value: entityRef, copyable: true },
          ]}
        />
      </Container>

      <Container title={t('inspectEntityDialog.overviewPage.metadata.title')}>
        {!!Object.keys(metadata.annotations || {}).length && (
          <>
            <ListSubheader>
              {t('inspectEntityDialog.overviewPage.annotations')}
              <HelpIcon to="https://backstage.io/docs/features/software-catalog/well-known-annotations" />
            </ListSubheader>
            <KeyValueList
              items={entriesToItems(Object.entries(metadata.annotations!))}
              aria-label={t('inspectEntityDialog.overviewPage.annotations')}
              className={classes.metadataList}
            />
          </>
        )}
        {!!Object.keys(metadata.labels || {}).length && (
          <>
            <ListSubheader className={classes.sectionHeading}>
              {t('inspectEntityDialog.overviewPage.labels')}
            </ListSubheader>
            <KeyValueList
              items={entriesToItems(Object.entries(metadata.labels!))}
              aria-label={t('inspectEntityDialog.overviewPage.labels')}
              className={classes.metadataList}
            />
          </>
        )}
        {!!metadata.tags?.length && (
          <>
            <ListSubheader className={classes.sectionHeading}>
              {t('inspectEntityDialog.overviewPage.tags')}
            </ListSubheader>
            <TagGroup
              aria-label={t('inspectEntityDialog.overviewPage.tags')}
              className={classes.tagGroup}
            >
              {metadata.tags.map(tag => (
                <Tag key={tag} id={tag}>
                  {tag}
                </Tag>
              ))}
            </TagGroup>
          </>
        )}
      </Container>

      {!!relations.length && (
        <Container
          title={t('inspectEntityDialog.overviewPage.relation.title')}
          helpLink="https://backstage.io/docs/features/software-catalog/well-known-relations"
        >
          {Object.entries(groupedRelations).map(([type, groupRelations]) => (
            <div key={type} className={classes.relationGroup}>
              <ListSubheader className={classes.monospace}>
                {type}
              </ListSubheader>
              <ListSection aria-label={type} className={classes.relationList}>
                {groupRelations.map(group => (
                  <ListItemRow key={group.targetRef}>
                    <EntityRefLink entityRef={group.targetRef} />
                  </ListItemRow>
                ))}
              </ListSection>
            </div>
          ))}
        </Container>
      )}

      {!!status.items?.length && (
        <Container
          title={t('inspectEntityDialog.overviewPage.status.title')}
          helpLink="https://backstage.io/docs/features/software-catalog/well-known-statuses"
        >
          {status.items.map((item, index) => (
            <div key={index}>
              <Text>
                {item.level}: {item.type}
              </Text>
              <Box ml="4">{item.message}</Box>
            </div>
          ))}
        </Container>
      )}
    </Flex>
  );
}
