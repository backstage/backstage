/*
 * Copyright 2026 The Backstage Authors
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
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@material-ui/core';
import { useApi } from '@backstage/core-plugin-api';
import useAsync from 'react-use/esm/useAsync';

import { DetailsDialogEntityProvider } from './DetailsDialogEntityProvider';
import { DetailsContent } from '@backstage/plugin-golden-paths-react';

type Props = {
  isOpen: boolean;
  onClose: VoidFunction;
  entityRef?: string;
};

const DetailsDialog = ({ isOpen, onClose, entityRef }: Props) => {
  const catalogApi = useApi(catalogApiRef);

  const asyncEntityState = useAsync(async () => {
    if (!entityRef) return undefined;

    return await catalogApi.getEntityByRef(entityRef);
  });

  return (
    <Dialog open={isOpen} fullWidth maxWidth="xl">
      <DialogTitle disableTypography>
        <Typography variant="h3">Golden Path details</Typography>
      </DialogTitle>

      <DialogContent>
        <DetailsDialogEntityProvider asyncEntityState={asyncEntityState}>
          <DetailsContent isStartButtonDisplayed={false} />
        </DetailsDialogEntityProvider>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DetailsDialog;
