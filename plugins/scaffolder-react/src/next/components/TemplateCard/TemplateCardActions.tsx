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

import { UserIcon } from '@backstage/core-components';
import { EntityRefLinks } from '@backstage/plugin-catalog-react';
import Button from '@material-ui/core/Button';
import { makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';

const useStyles = makeStyles<Theme>(theme => ({
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    flex: 1,
    alignItems: 'center',
  },
  ownedBy: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    color: theme.palette.link,
  },
  actionContainer: { padding: '16px', flex: 1, alignItems: 'flex-end' },
}));

/**
 * The Props for the {@link TemplateCardActions} component
 * @alpha
 */
export interface TemplateCardActionsProps {
  ownedByRelations: any;
  canCreateTask: boolean;
  handleChoose: () => void;
}
export const TemplateCardActions = ({
  canCreateTask,
  handleChoose,
  ownedByRelations,
}: TemplateCardActionsProps) => {
  const styles = useStyles();

  return (
    <div className={styles.footer} data-testid="template-card-actions--footer">
      <div
        className={styles.ownedBy}
        data-testid="template-card-actions--ownedby"
      >
        {ownedByRelations.length > 0 && (
          <>
            <UserIcon fontSize="small" />
            <EntityRefLinks
              style={{ marginLeft: '8px' }}
              entityRefs={ownedByRelations}
              defaultKind="Group"
              hideIcons
            />
          </>
        )}
      </div>
      {canCreateTask ? (
        <Button
          size="small"
          variant="outlined"
          color="primary"
          data-testid="template-card-actions--create"
          onClick={handleChoose}
        >
          Choose
        </Button>
      ) : null}
    </div>
  );
};
