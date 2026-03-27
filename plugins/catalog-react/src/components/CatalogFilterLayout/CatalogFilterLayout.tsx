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

import { ReactNode, useState } from 'react';
import { Filter } from 'lucide-react';
import {
  ShadcnButton as Button,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@backstage/core-components';
import { catalogReactTranslationRef } from '../../translation';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';

/**
 * Maps named breakpoints to Tailwind CSS responsive visibility classes.
 * Each entry provides class strings for mobile (visible below breakpoint)
 * and desktop (visible at/above breakpoint) containers.
 */
const breakpointClasses: Record<
  string,
  { mobileCol: string; desktopCol: string }
> = {
  xs: {
    mobileCol: 'hidden',
    desktopCol: 'col-span-2',
  },
  sm: {
    mobileCol: 'col-span-12 sm:hidden',
    desktopCol: 'hidden sm:col-span-2 sm:block',
  },
  md: {
    mobileCol: 'col-span-12 md:hidden',
    desktopCol: 'hidden md:col-span-2 md:block',
  },
  lg: {
    mobileCol: 'col-span-12 lg:hidden',
    desktopCol: 'hidden lg:col-span-2 lg:block',
  },
  xl: {
    mobileCol: 'col-span-12 xl:hidden',
    desktopCol: 'hidden xl:col-span-2 xl:block',
  },
};

/** @public */
export const Filters = (props: {
  children: ReactNode;
  options?: {
    drawerBreakpoint?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
    drawerAnchor?: 'left' | 'right' | 'top' | 'bottom';
  };
}) => {
  const [filterDrawerOpen, setFilterDrawerOpen] = useState<boolean>(false);
  const { t } = useTranslationRef(catalogReactTranslationRef);

  const bp =
    typeof props.options?.drawerBreakpoint === 'string'
      ? props.options.drawerBreakpoint
      : 'md';
  const responsive = breakpointClasses[bp] ?? breakpointClasses.md;

  return (
    <>
      {/* Mobile: Filter trigger button + Sheet overlay — visible below breakpoint */}
      <div className={responsive.mobileCol}>
        <Button
          variant="ghost"
          className="mt-2 ml-2"
          onClick={() => setFilterDrawerOpen(true)}
        >
          <Filter className="mr-2 h-4 w-4" />
          {t('catalogFilter.buttonTitle')}
        </Button>
        <Sheet open={filterDrawerOpen} onOpenChange={setFilterDrawerOpen}>
          <SheetContent side={props.options?.drawerAnchor ?? 'left'}>
            <SheetHeader>
              <SheetTitle>{t('catalogFilter.title')}</SheetTitle>
            </SheetHeader>
            <div className="p-4">{props.children}</div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop: Persistent filter sidebar — visible at/above breakpoint */}
      <div className={responsive.desktopCol}>{props.children}</div>
    </>
  );
};

/** @public */
export const Content = (props: { children: ReactNode }) => {
  return <div className="col-span-12 md:col-span-10">{props.children}</div>;
};

/** @public */
export const CatalogFilterLayout = (props: { children: ReactNode }) => {
  return (
    <div className="relative grid grid-cols-12 gap-4">{props.children}</div>
  );
};

CatalogFilterLayout.Filters = Filters;
CatalogFilterLayout.Content = Content;
