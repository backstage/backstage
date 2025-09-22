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

import { useState, useEffect } from 'react';
import { makeStyles, Portal, Paper } from '@material-ui/core';
import { useGitTemplate } from './hooks';
import {
  PAGE_MAIN_CONTENT_SELECTOR,
  PAGE_FEEDBACK_LINK_SELECTOR,
  ADDON_FEEDBACK_CONTAINER_ID,
  ADDON_FEEDBACK_CONTAINER_SELECTOR,
} from './constants';
import { IssueLink } from './IssueLink';
import {
  useShadowRootElements,
  useShadowRootSelection,
} from '@backstage/plugin-techdocs-react';
import { Repository } from './types';
import { ReportIssueProps } from './ReportIssue';

const useStyles = makeStyles(theme => ({
  root: {
    transform: 'translate(-100%, -100%)',
    position: 'absolute',
    padding: theme.spacing(1),
    zIndex: theme.zIndex.tooltip,
    background: theme.palette.common.white,
  },
}));

type Style = {
  top: string;
  left: string;
};

// Props customizing the <ReportIssue /> Addon.
export type ReportIssueAddonContentProps = ReportIssueProps & {
  repository: Repository;
};

export const ReportIssueAddonContent = ({
  debounceTime,
  templateBuilder,
  repository,
}: ReportIssueAddonContentProps) => {
  const classes = useStyles();
  const [style, setStyle] = useState<Style>();
  const defaultTemplate = useGitTemplate(debounceTime);
  const selection = useShadowRootSelection(debounceTime);

  const [mainContent, feedbackLink] = useShadowRootElements([
    PAGE_MAIN_CONTENT_SELECTOR,
    PAGE_FEEDBACK_LINK_SELECTOR,
  ]);

  let [feedbackContainer] = useShadowRootElements([
    ADDON_FEEDBACK_CONTAINER_SELECTOR,
  ]);

  if (feedbackLink) {
    feedbackLink.style.display = 'none';
  }

  useEffect(() => {
    if (
      !selection ||
      !selection.containsNode(mainContent, true) ||
      selection.containsNode(feedbackContainer, true)
    ) {
      return;
    }

    const mainContentPosition = mainContent.getBoundingClientRect();
    const selectionPosition = selection.getRangeAt(0).getBoundingClientRect();

    const distanceFromTop = selectionPosition.top - mainContentPosition.top;
    const minDistanceFromTop = 50;

    let top = distanceFromTop < minDistanceFromTop ? 101 : distanceFromTop - 16;

    if (mainContentPosition.top < 0) {
      const absMainContentTop = Math.abs(mainContentPosition.top);
      if (distanceFromTop - absMainContentTop < minDistanceFromTop) {
        top += 89;
      }
    }

    setStyle({
      top: `${top}px`,
      left: `${selectionPosition.left + selectionPosition.width / 2}px`,
    });
  }, [selection, mainContent, feedbackContainer]);

  if (!feedbackContainer) {
    feedbackContainer = document.createElement('div');
    feedbackContainer.setAttribute('id', ADDON_FEEDBACK_CONTAINER_ID);
    mainContent!.prepend(feedbackContainer);
  }

  if (!selection || !selection.containsNode(mainContent, true)) {
    return null;
  }

  return (
    <Portal container={feedbackContainer}>
      <Paper
        data-testid="report-issue-addon"
        className={classes.root}
        style={style}
      >
        <IssueLink
          repository={repository}
          template={
            templateBuilder ? templateBuilder({ selection }) : defaultTemplate
          }
        />
      </Paper>
    </Portal>
  );
};
