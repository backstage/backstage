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
import { useCallback, useEffect, useState } from 'react';
import { RiDownloadLine } from '@remixicon/react';
import { useApiHolder } from '@backstage/core-plugin-api';
import { useTranslationRef, toastApiRef } from '@backstage/frontend-plugin-api';
import { catalogTranslationRef } from '../../alpha/translation';
import {
  Button,
  ButtonIcon,
  Checkbox,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Flex,
  Select,
  Text,
} from '@backstage/ui';
import { useStreamingExport } from './file-download';
import type { CatalogExportSettingsColumn } from './file-download/serializeEntities';
import { getColumnTitle } from './file-download/serializeEntities';
import type { CatalogExporter } from './file-download/useStreamingExport';

/**
 * Custom exporter configuration for a catalog export format.
 * @public
 */
export interface CatalogExporterConfig {
  /** The exporter function that generates the export content. */
  exporter: CatalogExporter;
  /** Optional display label shown in the format selector. Defaults to the format key in uppercase. */
  label?: string;
}

/**
 * Settings for configuring the catalog export functionality.
 *
 * @public
 */
export interface CatalogExportSettings {
  /**
   * When true, displays the export button in the catalog interface.
   * Defaults to false if not specified.
   */
  enabled?: boolean;

  /**
   * Custom columns to include in the export.
   * Each column specifies an entity field path and a display title.
   * If not specified, uses default columns: Name, Type, Owner, Description.
   */
  columns?: CatalogExportSettingsColumn[];

  /**
   * Map of custom export format handlers beyond the built-in CSV and JSON formats.
   * Key is the format name (e.g., 'xml', 'yaml'), value is the exporter configuration.
   * Custom formats will appear as options in the export dialog.
   */
  exporters?: Record<string, CatalogExporterConfig>;

  /**
   * When true, hides the built-in CSV and JSON export options from the dialog.
   * Useful when only custom exporters should be available.
   */
  disableBuiltinExporters?: boolean;

  /**
   * Callback function invoked when the export completes successfully.
   * Useful for showing notifications or performing post-export actions.
   */
  onSuccess?: () => void;

  /**
   * Callback function invoked when the export fails.
   * Receives an object containing the error for custom error handling.
   */
  onError?: (options: { error: Error }) => void;
}

/**
 * The available export formats for the catalog export.
 * Currently supports CSV and JSON.
 *
 * @public
 */
export enum CatalogExportType {
  CSV = 'csv',
  JSON = 'json',
}

/**
 * The available default export columns for the catalog export.
 * These can be overridden by providing custom columns in the export button options.
 *
 * @private
 */
const DEFAULT_EXPORT_COLUMNS = [
  { entityFilterKey: 'metadata.name', title: 'Name' },
  { entityFilterKey: 'spec.type', title: 'Type' },
  { entityFilterKey: 'spec.owner', title: 'Owner' },
  { entityFilterKey: 'metadata.description', title: 'Description' },
];

/**
 * A button that opens a dialog to export the current catalog selection.
 *
 * @param settings - Optional export configuration settings including columns, custom exporters, and callbacks
 * @public
 */
export const CatalogExportButton = ({
  settings,
  iconOnly = false,
}: {
  settings?: CatalogExportSettings;
  iconOnly?: boolean;
}) => {
  const { t } = useTranslationRef(catalogTranslationRef);
  const { exportStream, loading, error } = useStreamingExport();
  const [open, setOpen] = useState(false);
  const exporters = settings?.exporters;
  const disableBuiltinExporters = settings?.disableBuiltinExporters;
  const onSuccess = settings?.onSuccess;
  const onError = settings?.onError;
  const apis = useApiHolder();
  const toastApi = apis.get(toastApiRef)!;
  const [isExporting, setIsExporting] = useState(false);

  const effectiveColumns = settings?.columns ?? DEFAULT_EXPORT_COLUMNS;

  const allExportOptions = [
    ...(disableBuiltinExporters
      ? []
      : Object.values(CatalogExportType).map(format => ({
          value: format,
          label: format.toUpperCase(),
        }))),
    ...Object.entries(exporters ?? {}).map(([key, exporter]) => ({
      value: key,
      label: exporter.label ?? key.toUpperCase(),
    })),
  ];

  const [exportFormat, setExportFormat] = useState<string>(
    allExportOptions[0]?.value ?? '',
  );
  const [selectedColumnTitles, setSelectedColumnTitles] = useState<Set<string>>(
    () => new Set(effectiveColumns.map(c => getColumnTitle(c))),
  );
  const selectedColumns = effectiveColumns.filter(c =>
    selectedColumnTitles.has(getColumnTitle(c)),
  );

  const handleOpenDialog = () => {
    setSelectedColumnTitles(
      new Set(effectiveColumns.map(c => getColumnTitle(c))),
    );
    setOpen(true);
  };

  const toggleColumn = (title: string) => {
    setSelectedColumnTitles(prev => {
      const next = new Set(prev);
      if (next.has(title)) {
        next.delete(title);
      } else {
        next.add(title);
      }
      return next;
    });
  };

  useEffect(() => {
    if (isExporting && !loading) {
      if (error) {
        if (onError) {
          onError({ error });
        } else {
          toastApi.post({
            title: t('catalogExportButton.errorMessage', {
              errorMessage: error.message,
            }),
            status: 'danger',
          });
        }
      } else {
        if (onSuccess) {
          onSuccess();
        } else {
          toastApi.post({
            title: t('catalogExportButton.successMessage'),
            status: 'success',
          });
        }
      }
      setOpen(false);
      setIsExporting(false);
    }
  }, [isExporting, loading, error, toastApi, onSuccess, onError, t]);

  const handleExport = useCallback(async () => {
    setIsExporting(true);
    const exporterFn = exporters?.[exportFormat];
    await exportStream({
      exportFormat,
      filename: `catalog-export.${exportFormat}`,
      columns: selectedColumns,
      exporter: exporterFn?.exporter,
    });
  }, [exportFormat, exportStream, selectedColumns, exporters]);

  return (
    <>
      {iconOnly ? (
        <ButtonIcon
          variant="secondary"
          icon={<RiDownloadLine />}
          aria-label={t('catalogExportButton.triggerButtonTitle')}
          onPress={handleOpenDialog}
        />
      ) : (
        <Button
          variant="secondary"
          iconStart={<RiDownloadLine />}
          onPress={handleOpenDialog}
        >
          {t('catalogExportButton.triggerButtonTitle')}
        </Button>
      )}

      <Dialog isOpen={open} onOpenChange={isOpen => !isOpen && setOpen(false)}>
        <DialogHeader>{t('catalogExportButton.dialogTitle')}</DialogHeader>
        <DialogBody>
          <Flex direction="column" gap="4">
            <Select
              data-testid="format-select"
              label={t('catalogExportButton.formatLabel')}
              options={allExportOptions}
              value={exportFormat}
              onChange={key => setExportFormat(key as string)}
            />
            <Flex direction="column" gap="1">
              <Text variant="body-small" weight="bold">
                {t('catalogExportButton.columnsLabel')}
              </Text>
              {effectiveColumns.map(col => (
                <Checkbox
                  key={col.entityFilterKey}
                  isSelected={selectedColumnTitles.has(getColumnTitle(col))}
                  onChange={() => toggleColumn(getColumnTitle(col))}
                >
                  {getColumnTitle(col)}
                </Checkbox>
              ))}
            </Flex>
          </Flex>
        </DialogBody>
        <DialogFooter>
          <Button variant="secondary" onPress={() => setOpen(false)}>
            {t('catalogExportButton.cancelButtonTitle')}
          </Button>
          <Button
            variant="primary"
            onPress={() => handleExport()}
            isDisabled={
              !exportFormat || loading || selectedColumns.length === 0
            }
            loading={loading}
          >
            {loading
              ? t('catalogExportButton.exportingButtonTitle')
              : t('catalogExportButton.confirmButtonTitle')}
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};
