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
import Button from '@material-ui/core/Button';
import type { ButtonProps } from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Box from '@material-ui/core/Box';
import GetAppIcon from '@material-ui/icons/GetApp';
import CircularProgress from '@material-ui/core/CircularProgress';
import { alertApiRef, useApi } from '@backstage/core-plugin-api';
import { useStreamingExport } from './file-download';
import type { ExportColumn } from './file-download/serializeEntities';
import type { StreamingExportOptions } from './file-download/useStreamingExport';

/**
 * Custom exporter function type for export formats.
 * @public
 */
export type CustomExporter = StreamingExportOptions['customExporter'];

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
  enableExport?: boolean;

  /**
   * Custom columns to include in the export.
   * Each column specifies an entity field path and a display title.
   * If not specified, uses default columns: Name, Type, Owner, Description.
   */
  columns?: ExportColumn[];

  /**
   * Map of custom export format handlers beyond the built-in CSV and JSON formats.
   * Key is the format name (e.g., 'xml', 'yaml'), value is the async exporter function.
   * Custom formats will appear as options in the export dialog.
   */
  customExporters?: Record<string, CustomExporter>;

  /**
   * Callback function invoked when the export completes successfully.
   * Useful for showing notifications or performing post-export actions.
   */
  onSuccess?: () => void;

  /**
   * Callback function invoked when the export fails.
   * Receives the error object for custom error handling.
   */
  onError?: (error: Error) => void;

  /**
   * Material-UI Button props to customize the export button's appearance and behavior.
   * Allows control over styling, size, variant, and other button properties.
   */
  buttonProps?: ButtonProps;
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
}: {
  settings?: CatalogExportSettings;
}) => {
  const { exportStream, loading, error } = useStreamingExport();
  const [open, setOpen] = useState(false);
  const columns = settings?.columns;
  const customExporters = settings?.customExporters;
  const onSuccess = settings?.onSuccess;
  const onError = settings?.onError;
  const buttonProps = settings?.buttonProps;
  const [exportFormat, setExportFormat] = useState<string>(
    CatalogExportType.CSV,
  );
  const alertApi = useApi(alertApiRef);
  const [isExporting, setIsExporting] = useState(false);

  const allExportTypes = [
    ...Object.values(CatalogExportType),
    ...Object.keys(customExporters ?? {}),
  ];

  useEffect(() => {
    if (isExporting && !loading) {
      if (error) {
        const errorMessage = `Failed to export catalog: ${error.message}`;
        if (onError) {
          onError(error);
        } else {
          alertApi.post({
            message: errorMessage,
            severity: 'error',
          });
        }
      } else {
        const successMessage = 'Catalog exported successfully';
        if (onSuccess) {
          onSuccess();
        } else {
          alertApi.post({
            message: successMessage,
            severity: 'success',
          });
        }
      }
      setOpen(false);
      setIsExporting(false);
    }
  }, [isExporting, loading, error, alertApi, onSuccess, onError]);

  const handleExport = useCallback(async () => {
    setIsExporting(true);

    // Get custom exporter if this is a custom export type
    const customExporter = customExporters?.[exportFormat];
    await exportStream({
      exportFormat,
      filename: `catalog-export.${exportFormat}`,
      columns: columns ?? DEFAULT_EXPORT_COLUMNS,
      customExporter,
    });
  }, [exportFormat, exportStream, columns, customExporters]);

  return (
    <>
      <Button
        {...buttonProps}
        variant={buttonProps?.variant ?? 'contained'}
        color={buttonProps?.color ?? 'primary'}
        onClick={buttonProps?.onClick ?? (() => setOpen(true))}
        endIcon={buttonProps?.endIcon ?? <GetAppIcon />}
      >
        {buttonProps?.children ?? 'Export selection'}
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Export catalog selection</DialogTitle>
        <DialogContent>
          <Box
            style={{ paddingTop: 8, display: 'flex', flexDirection: 'column' }}
          >
            <FormControl fullWidth>
              <InputLabel id="format-select-label">Format</InputLabel>
              <Select
                data-testid="format-select"
                labelId="format-select-label"
                id="format-select"
                value={exportFormat}
                onChange={e => setExportFormat(e.target.value as string)}
              >
                {allExportTypes.map(format => (
                  <MenuItem
                    key={format}
                    value={format}
                    data-testid={`format-${format}`}
                  >
                    {format.toUpperCase()}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleExport()}
            disabled={!exportFormat || loading}
            startIcon={loading ? <CircularProgress size={16} /> : undefined}
          >
            {loading ? 'Exporting…' : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
