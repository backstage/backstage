/*
 * Copyright 2025 The Backstage Authors
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

import { useId } from 'react-aria';
import { Text } from '../Text';
import { ButtonIcon } from '../ButtonIcon';
import { Select } from '../Select';
import type { TablePaginationProps, PageSizeOption } from './types';
import { useDefinition } from '../../hooks/useDefinition';
import { TablePaginationDefinition } from './definition';
import { RiArrowLeftSLine, RiArrowRightSLine } from '@remixicon/react';
import { useMemo } from 'react';

function getOptionValue(option: number | PageSizeOption): number {
  return typeof option === 'number' ? option : option.value;
}

function isNumberArray(
  options: number[] | PageSizeOption[],
): options is number[] {
  return options.length > 0 && typeof options[0] === 'number';
}

function normalizePageSizeOptions(
  options: number[] | PageSizeOption[],
): PageSizeOption[] {
  if (isNumberArray(options)) {
    return options.map(value => ({
      label: `Show ${value} results`,
      value,
    }));
  }
  return options;
}

/**
 * Pagination controls for Table components with page navigation and size selection.
 *
 * @public
 */
export function TablePagination(props: TablePaginationProps) {
  const { ownProps } = useDefinition(TablePaginationDefinition, props);
  const {
    classes,
    pageSize,
    pageSizeOptions,
    offset,
    totalCount,
    hasNextPage,
    hasPreviousPage,
    onNextPage,
    onPreviousPage,
    onPageSizeChange,
    showPageSizeOptions,
    getLabel,
  } = ownProps;

  const labelId = useId();
  const normalizedOptions = useMemo(
    () => normalizePageSizeOptions(pageSizeOptions),
    [pageSizeOptions],
  );

  const effectivePageSize = useMemo(() => {
    const isValid = pageSizeOptions.some(
      opt => getOptionValue(opt) === pageSize,
    );
    if (isValid) {
      return pageSize;
    }
    const firstValue = getOptionValue(pageSizeOptions[0]);
    console.warn(
      `TablePagination: pageSize ${pageSize} is not in pageSizeOptions, using ${firstValue} instead`,
    );
    return firstValue;
  }, [pageSize, pageSizeOptions]);

  const hasItems = totalCount !== undefined && totalCount !== 0;

  let label = `${totalCount} items`;
  if (getLabel) {
    label = getLabel({ pageSize: effectivePageSize, offset, totalCount });
  } else if (offset !== undefined) {
    const fromCount = offset + 1;
    const toCount = Math.min(offset + effectivePageSize, totalCount ?? 0);
    label = `${fromCount} - ${toCount} of ${totalCount}`;
  }

  return (
    <div className={classes.root}>
      <div className={classes.left}>
        {showPageSizeOptions && (
          <Select
            name="pageSize"
            size="small"
            aria-label="Select table page size"
            options={normalizedOptions.map(opt => ({
              label: opt.label,
              value: String(opt.value),
            }))}
            defaultValue={effectivePageSize.toString()}
            onChange={value => {
              const newPageSize = Number(value);
              onPageSizeChange?.(newPageSize);
            }}
            className={classes.select}
          />
        )}
      </div>
      <div className={classes.right}>
        {hasItems && (
          <Text as="p" variant="body-medium" id={labelId}>
            {label}
          </Text>
        )}
        <ButtonIcon
          variant="secondary"
          size="small"
          onClick={onPreviousPage}
          isDisabled={!hasPreviousPage}
          icon={<RiArrowLeftSLine />}
          aria-label="Previous table page"
          aria-describedby={hasItems ? labelId : undefined}
        />
        <ButtonIcon
          variant="secondary"
          size="small"
          onClick={onNextPage}
          isDisabled={!hasNextPage}
          icon={<RiArrowRightSLine />}
          aria-label="Next table page"
          aria-describedby={hasItems ? labelId : undefined}
        />
      </div>
    </div>
  );
}
