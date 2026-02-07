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
import {
  alertApiRef,
  discoveryApiRef,
  useApi,
} from '@backstage/core-plugin-api';
import {
  useBackstageStreamedDownload,
  type BackstageStreamedDownloadOptions,
} from './file-download';
import { setEnabledBackendFilters } from './setEnabledBackendFilters.ts';
import { useEntityList } from '@backstage/plugin-catalog-react';

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
 * A button that opens a dialog to export the current catalog selection.
 *
 * @param buttonProps - Props to pass to the export button
 * @public
 */
export const CatalogExportButton = ({
  buttonProps,
}: {
  buttonProps?: ButtonProps;
}) => {
  const discoveryApi = useApi(discoveryApiRef);
  const { filters } = useEntityList();
  const {
    download: postExport,
    loading,
    error,
  } = useBackstageStreamedDownload();
  const [open, setOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<CatalogExportType>(
    CatalogExportType.CSV,
  );
  const alertApi = useApi(alertApiRef);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (isExporting && !loading) {
      if (error) {
        alertApi.post({
          message: `Failed to export catalog: ${error.message}`,
          severity: 'error',
        });
      } else {
        alertApi.post({
          message: 'Catalog exported successfully',
          severity: 'success',
        });
      }
      setOpen(false);
      setIsExporting(false);
    }
  }, [isExporting, loading, error, alertApi]);

  const handleExport = useCallback(async () => {
    setIsExporting(true);

    const newSearchParams = new URLSearchParams();
    newSearchParams.set('exportFormat', exportFormat);
    setEnabledBackendFilters(filters, newSearchParams);

    const baseUrl = await discoveryApi.getBaseUrl('catalog');
    const options: BackstageStreamedDownloadOptions = {
      url: `${baseUrl}/export`,
      filename: `catalog-export.${exportFormat}`,
      searchParams: newSearchParams,
    };
    await postExport(options);
  }, [filters, exportFormat, postExport, discoveryApi]);

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
                onChange={e =>
                  setExportFormat(e.target.value as CatalogExportType)
                }
              >
                {Object.values(CatalogExportType).map(format => (
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
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
