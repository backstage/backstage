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

import { Children, ReactNode, useState } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '../../components/ui/breadcrumb';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '../../components/ui/popover';
import { cn } from '../../lib/utils';

/**
 * Props for the Backstage Breadcrumbs component.
 *
 * @public
 */
export interface BackstageBreadcrumbsProps {
  /** Custom CSS class name applied to the breadcrumb nav container */
  className?: string;
  /** Breadcrumb child elements (Links and current page indicators) */
  children?: ReactNode;
}

/**
 * Class key type preserved for backward compatibility with theme override
 * consumers that referenced the MUI withStyles ClickableText component.
 *
 * @public
 */
export type BreadcrumbsClickableTextClassKey = 'root';

/**
 * Class key type preserved for backward compatibility with theme override
 * consumers that referenced the MUI withStyles StyledBox component.
 *
 * @public
 */
export type BreadcrumbsStyledBoxClassKey = 'root';

/**
 * Class key type preserved for backward compatibility with theme override
 * consumers that referenced the MUI withStyles BreadcrumbsCurrentPage component.
 *
 * @public
 */
export type BreadcrumbsCurrentPageClassKey = 'root';

/**
 * Breadcrumbs component to show navigation hierarchical structure.
 *
 * @remarks
 * Renders an accessible breadcrumb trail using shadcn/ui Breadcrumb
 * primitives built on Radix UI. When more than three breadcrumb items
 * are provided, intermediate items are collapsed behind an ellipsis
 * trigger that opens a Radix Popover listing the hidden items.
 *
 * The component preserves the first page, second page, and current
 * page while collapsing all intermediate pages into the overflow
 * popover.
 *
 * @public
 */
export function Breadcrumbs(props: BackstageBreadcrumbsProps) {
  const { children, className } = props;
  const [popoverOpen, setPopoverOpen] = useState(false);

  const childrenArray = Children.toArray(children);

  const [firstPage, secondPage, ...expandablePages] = childrenArray;
  const currentPage = expandablePages.length
    ? expandablePages.pop()
    : childrenArray[childrenArray.length - 1];
  const hasHiddenBreadcrumbs = childrenArray.length > 3;

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {childrenArray.length > 1 && (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <span className={cn('underline text-inherit')}>
                  {firstPage}
                </span>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        )}
        {childrenArray.length > 2 && (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <span className={cn('underline text-inherit')}>
                  {secondPage}
                </span>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        )}
        {hasHiddenBreadcrumbs && (
          <>
            <BreadcrumbItem>
              <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger asChild>
                  <button
                    className={cn(
                      'underline cursor-pointer text-current hover:text-foreground/80',
                    )}
                    type="button"
                  >
                    ...
                  </button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-auto p-1">
                  <div className="flex flex-col">
                    {expandablePages.map((pageLink, index) => (
                      <div
                        key={index}
                        className={cn(
                          'px-3 py-1.5 underline text-inherit cursor-pointer hover:bg-accent rounded-sm',
                        )}
                      >
                        {pageLink}
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        )}
        <BreadcrumbItem>
          <span className={cn('italic')}>{currentPage}</span>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
