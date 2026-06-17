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

import { Entity } from '@backstage/catalog-model';
import {
  Dialog,
  DialogHeader,
  DialogBody,
  Tabs,
  TabList,
  Tab,
  TabPanel,
} from '@backstage/ui';
import { useMemo } from 'react';
import { AncestryPage } from './components/AncestryPage';
import { ColocatedPage } from './components/ColocatedPage';
import { JsonPage } from './components/JsonPage';
import { OverviewPage } from './components/OverviewPage';
import { YamlPage } from './components/YamlPage';
import { catalogReactTranslationRef } from '../../translation';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';

type TabKey = 'overview' | 'ancestry' | 'colocated' | 'json' | 'yaml';

const TAB_KEYS: TabKey[] = [
  'overview',
  'ancestry',
  'colocated',
  'json',
  'yaml',
];

function DialogContents(props: {
  entity: Entity;
  initialTab?: TabKey;
  onSelect?: (tab: string) => void;
}) {
  const { entity, initialTab, onSelect } = props;
  const { t } = useTranslationRef(catalogReactTranslationRef);

  const tabNames = useMemo(
    () => ({
      overview: t('inspectEntityDialog.tabNames.overview'),
      ancestry: t('inspectEntityDialog.tabNames.ancestry'),
      colocated: t('inspectEntityDialog.tabNames.colocated'),
      json: t('inspectEntityDialog.tabNames.json'),
      yaml: t('inspectEntityDialog.tabNames.yaml'),
    }),
    [t],
  );

  const tabContent: Record<TabKey, JSX.Element> = {
    overview: <OverviewPage entity={entity} />,
    ancestry: <AncestryPage entity={entity} />,
    colocated: <ColocatedPage entity={entity} />,
    json: <JsonPage entity={entity} />,
    yaml: <YamlPage entity={entity} />,
  };

  return (
    <>
      <DialogHeader>{t('inspectEntityDialog.title')}</DialogHeader>
      <DialogBody>
        <Tabs
          defaultSelectedKey={initialTab || 'overview'}
          onSelectionChange={key => onSelect?.(key as string)}
        >
          <TabList aria-label={t('inspectEntityDialog.tabsAriaLabel')}>
            {TAB_KEYS.map(tab => (
              <Tab key={tab} id={tab}>
                {tabNames[tab]}
              </Tab>
            ))}
          </TabList>
          {TAB_KEYS.map(tab => (
            <TabPanel key={tab} id={tab}>
              {tabContent[tab]}
            </TabPanel>
          ))}
        </Tabs>
      </DialogBody>
    </>
  );
}

/**
 * A dialog that lets users inspect the low level details of their entities.
 *
 * @public
 */
export function InspectEntityDialog(props: {
  open: boolean;
  entity: Entity;
  initialTab?: 'overview' | 'ancestry' | 'colocated' | 'json' | 'yaml';
  onClose: () => void;
  onSelect?: (tab: string) => void;
}) {
  const { open, entity, initialTab, onClose, onSelect } = props;

  if (!entity) {
    return null;
  }

  return (
    <Dialog
      isOpen={open}
      onOpenChange={isOpen => !isOpen && onClose()}
      width="940px"
      height="100vh"
    >
      {open && (
        <DialogContents
          entity={entity}
          initialTab={initialTab}
          onSelect={onSelect}
        />
      )}
    </Dialog>
  );
}
