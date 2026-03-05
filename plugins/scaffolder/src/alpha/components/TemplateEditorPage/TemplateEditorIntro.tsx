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

import { MouseEventHandler } from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { WebFileSystemAccess } from '../../../lib/filesystem';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { scaffolderTranslationRef } from '../../../translation';
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import ListAltIcon from '@material-ui/icons/ListAlt';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import CardMedia from '@material-ui/core/CardMedia';
import PublishIcon from '@material-ui/icons/Publish';
import SvgIcon from '@material-ui/core/SvgIcon';
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles(theme => ({
  gridRoot: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardGrid: {
    maxWidth: 1000,
    display: 'grid',
    gridGap: theme.spacing(2),
    gridAutoFlow: 'row',
    [theme.breakpoints.up('md')]: {
      gridTemplateRows: '1fr 1fr',
      gridTemplateColumns: '1fr 1fr',
    },
  },
  card: {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    gridTemplateRows: '1fr',
    alignItems: 'center',
    margin: theme.spacing(0, 1),
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
  },
  icon: {
    justifySelf: 'center',
    paddingTop: theme.spacing(1),
    fontSize: 48,
  },
  introText: {
    textAlign: 'center',
    marginTop: theme.spacing(2),
  },
  infoIcon: {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
  },
  cardContent: {
    padding: theme.spacing(1),
  },
}));

interface EditorIntroProps {
  style?: JSX.IntrinsicElements['div']['style'];
  onSelect?: (
    option: 'create-template' | 'local' | 'form' | 'field-explorer',
  ) => void;
}

function ActionCard(props: {
  title: string;
  description: string;
  Icon: typeof SvgIcon;
  action?: MouseEventHandler;
  requireLoad?: boolean;
}) {
  const supportsLoad = props.requireLoad
    ? WebFileSystemAccess.isSupported()
    : true;
  const { t } = useTranslationRef(scaffolderTranslationRef);

  const classes = useStyles();
  const { Icon, title, description, action } = props;
  return (
    <Card className={classes.card}>
      {!supportsLoad && (
        <Tooltip
          placement="top"
          title={t(
            'templateEditorPage.templateEditorIntro.loadLocal.unsupportedTooltip',
          )}
        >
          <InfoOutlinedIcon />
        </Tooltip>
      )}

      <CardActionArea onClick={action}>
        <CardMedia>
          <Icon
            className={classes.icon}
            color={supportsLoad ? undefined : 'disabled'}
          />
        </CardMedia>
        <CardContent className={classes.cardContent}>
          <Typography
            gutterBottom
            variant="h5"
            component="h2"
            color={supportsLoad ? undefined : 'textSecondary'}
          >
            {title}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
export function TemplateEditorIntro(props: EditorIntroProps) {
  const classes = useStyles();
  const { t } = useTranslationRef(scaffolderTranslationRef);

  return (
    <div style={props.style}>
      <Typography variant="h4" component="h2" className={classes.introText}>
        {t('templateEditorPage.templateEditorIntro.title')}
      </Typography>
      <div className={classes.gridRoot}>
        <div className={classes.cardGrid}>
          <ActionCard
            title={t('templateEditorPage.templateEditorIntro.loadLocal.title')}
            description={t(
              'templateEditorPage.templateEditorIntro.loadLocal.description',
            )}
            requireLoad
            Icon={PublishIcon}
            action={() => props.onSelect?.('local')}
          />
          <ActionCard
            title={t(
              'templateEditorPage.templateEditorIntro.createLocal.title',
            )}
            description={t(
              'templateEditorPage.templateEditorIntro.createLocal.description',
            )}
            requireLoad
            action={() => props.onSelect?.('create-template')}
            Icon={CreateNewFolderIcon}
          />

          <ActionCard
            title={t('templateEditorPage.templateEditorIntro.formEditor.title')}
            description={t(
              'templateEditorPage.templateEditorIntro.formEditor.description',
            )}
            Icon={ListAltIcon}
            action={() => props.onSelect?.('form')}
          />

          <ActionCard
            title={t(
              'templateEditorPage.templateEditorIntro.fieldExplorer.title',
            )}
            description={t(
              'templateEditorPage.templateEditorIntro.fieldExplorer.description',
            )}
            Icon={FormatListBulletedIcon}
            action={() => props.onSelect?.('field-explorer')}
          />
        </div>
      </div>
    </div>
  );
}
