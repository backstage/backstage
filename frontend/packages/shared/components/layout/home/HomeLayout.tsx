import React, { FC } from 'react';
import classNames from 'classnames';
import { Content, Header, Page } from 'shared/components/layout';
import { theme } from 'core/app/PageThemeProvider';
import { useProfile } from 'shared/apis/user';
import { getTimeBasedGreeting } from 'shared/apis/time/timeUtil';
import HomePageTimer from 'plugins/homePage/components/HomePageTimer';
import HomeDrawer from 'plugins/homePage/components/HomeDrawer';
import { useStackOverflowQuestions } from './hooks';
import { Typography, makeStyles, Theme, Tooltip } from '@material-ui/core';
import { Link } from 'shared/components';
import _unescape from 'lodash/unescape';
import SOEIcon from 'shared/assets/icons/so-icon-white.svg';

const useStyles = makeStyles<Theme>({
  subtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: '1.0em',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    maxWidth: 540,
    opacity: 0,
    transition: 'opacity 5s',
    height: '1.75em',
  },
  subtitleShown: {
    opacity: 1,
  },
  subtitleIcon: {
    width: 24,
    height: 24,
    opacity: 0.8,
    position: 'relative',
    top: 4,
  },
});

const HomeLayout: FC<{}> = props => {
  const { children } = props;
  const classes = useStyles(props);
  const profile = useProfile();
  const greeting = getTimeBasedGreeting();
  const question = useStackOverflowQuestions();
  const subtitle = question && _unescape(question.title);

  return (
    <Page theme={theme.home}>
      <Header
        title={profile ? `${greeting.greeting}, ${profile.givenName}` : greeting.greeting}
        subtitle={
          <Tooltip title={(subtitle && `Click and help us answer: ${subtitle}`) || ''} placement="bottom-start">
            <Link to={question && question.link} gaprops={{ label: 'Home StackOverflow Click' }}>
              <Typography
                variant="subtitle1"
                className={classNames(classes.subtitle, { [classes.subtitleShown]: subtitle })}
              >
                {(subtitle && (
                  <>
                    <img src={SOEIcon} alt="Stack Overflow Icon" className={classes.subtitleIcon} />{' '}
                    {`Answer me: ${subtitle}`}
                  </>
                )) ||
                  '\xA0' /* nbsp */}
              </Typography>
            </Link>
          </Tooltip>
        }
        tooltip={greeting.language}
        pageTitleOverride="Home"
        type=""
      >
        <HomePageTimer />
      </Header>
      <Content centered>{children}</Content>
      <HomeDrawer />
    </Page>
  );
};

export default HomeLayout;
