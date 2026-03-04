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
  ShadcnDialog,
  ShadcnDialogContent,
  ShadcnDialogTitle,
  DialogHeader,
  DialogFooter,
  ShadcnTabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  ShadcnButton,
  cn,
} from '@backstage/core-components';
import { ComponentProps, useEffect, useState, useMemo } from 'react';
import { AncestryPage } from './components/AncestryPage';
import { ColocatedPage } from './components/ColocatedPage';
import { JsonPage } from './components/JsonPage';
import { OverviewPage } from './components/OverviewPage';
import { YamlPage } from './components/YamlPage';
import { catalogReactTranslationRef } from '../../translation';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';

type TabKey = 'overview' | 'ancestry' | 'colocated' | 'json' | 'yaml';

type TabNames = Record<
  NonNullable<ComponentProps<typeof InspectEntityDialog>['initialTab']>,
  string
>;

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
  const { t } = useTranslationRef(catalogReactTranslationRef);

  const tabNames: TabNames = useMemo(
    () => ({
      overview: t('inspectEntityDialog.tabNames.overview'),
      ancestry: t('inspectEntityDialog.tabNames.ancestry'),
      colocated: t('inspectEntityDialog.tabNames.colocated'),
      json: t('inspectEntityDialog.tabNames.json'),
      yaml: t('inspectEntityDialog.tabNames.yaml'),
    }),
    [t],
  );

  const tabs = Object.keys(tabNames) as TabKey[];

  const [activeTab, setActiveTab] = useState(
    getTabIndex(tabs, props.initialTab),
  );

  useEffect(() => {
    getTabIndex(tabs, props.initialTab);
  }, [props.open, props.initialTab, tabs]);

  if (!props.entity) {
    return null;
  }

  return (
    <ShadcnDialog
      open={props.open}
      onOpenChange={open => {
        if (!open) props.onClose();
      }}
    >
      <ShadcnDialogContent
        className={cn('max-w-screen-xl w-full h-[calc(100%-64px)]')}
      >
        <DialogHeader>
          <ShadcnDialogTitle id="entity-inspector-dialog-title">
            {t('inspectEntityDialog.title')}
          </ShadcnDialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-hidden border-t border-b border-border">
          <ShadcnTabs
            defaultValue={props.initialTab ?? 'overview'}
            value={tabs[activeTab]}
            onValueChange={value => {
              const idx = tabs.indexOf(value as TabKey);
              if (idx >= 0) {
                setActiveTab(idx);
                props.onSelect?.(value);
              }
            }}
            className={cn('flex grow w-full bg-card')}
            orientation="vertical"
          >
            <TabsList
              className={cn(
                'flex flex-col h-auto border-r border-border shrink-0 rounded-none bg-transparent',
              )}
            >
              {tabs.map(tab => (
                <TabsTrigger key={tab} value={tab}>
                  {tabNames[tab]}
                </TabsTrigger>
              ))}
            </TabsList>
            {tabs.map(tab => (
              <TabsContent
                key={tab}
                value={tab}
                className="grow overflow-x-auto mt-0"
              >
                <div className="px-3">
                  {tab === 'overview' && <OverviewPage entity={props.entity} />}
                  {tab === 'ancestry' && <AncestryPage entity={props.entity} />}
                  {tab === 'colocated' && (
                    <ColocatedPage entity={props.entity} />
                  )}
                  {tab === 'json' && <JsonPage entity={props.entity} />}
                  {tab === 'yaml' && <YamlPage entity={props.entity} />}
                </div>
              </TabsContent>
            ))}
          </ShadcnTabs>
        </div>
        <DialogFooter>
          <ShadcnButton onClick={props.onClose} variant="default">
            {t('inspectEntityDialog.closeButtonTitle')}
          </ShadcnButton>
        </DialogFooter>
      </ShadcnDialogContent>
    </ShadcnDialog>
  );
}

function getTabIndex(allTabs: string[], initialTab: TabKey | undefined) {
  return initialTab ? allTabs.indexOf(initialTab) : 0;
}
