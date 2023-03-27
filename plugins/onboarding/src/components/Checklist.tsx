/*
 * Copyright 2023 The Backstage Authors
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
import React, { ChangeEvent, useContext } from 'react';
import { Button, List, makeStyles, Theme } from '@material-ui/core';

import { TabBar } from './TabBar';

import { OnboardingContext } from '../context/OnboardingContext';
import { CheckListItem } from './CheckListItem';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    overflow: 'scroll',
    minHeight: theme.spacing(60),
    maxHeight: theme.spacing(60),
  },
  submitBtn: {
    margin: '5px',
    width: '150px',
    alignSelf: 'end',
  },
}));

export const Checklist: React.FC = () => {
  const classes = useStyles();

  const {
    groups,
    selectedGroup,
    subGroups,
    checklists,
    selectedSubGroup,
    updateSelectedSubGroup,
    updateSelectedGroup,
    syncChecklistStatus,
  } = useContext(OnboardingContext);

  return (
    <>
      {groups?.length ? (
        <TabBar
          tabs={groups}
          selectedTab={selectedGroup}
          handleChange={(_event: ChangeEvent<{}>, value?: string) => {
            updateSelectedGroup(value || selectedGroup);
          }}
        />
      ) : null}
      {subGroups?.length ? (
        <TabBar
          tabs={subGroups}
          selectedTab={selectedSubGroup}
          handleChange={(_event: ChangeEvent<{}>, value?: string) => {
            updateSelectedSubGroup(value || selectedSubGroup);
          }}
        />
      ) : null}

      <List className={classes.container}>
        {checklists?.map((item: any) => {
          return <CheckListItem {...item} />;
        })}
      </List>

      {groups && subGroups && checklists?.length ? (
        <Button
          onClick={syncChecklistStatus}
          className={classes.submitBtn}
          variant="contained"
          color="primary"
        >
          Submit
        </Button>
      ) : null}
    </>
  );
};
