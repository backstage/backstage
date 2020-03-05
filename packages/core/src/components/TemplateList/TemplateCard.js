import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TemplateCardMedia from './TemplateCardMedia';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Typography,
  withStyles,
} from '@material-ui/core';
import { Link } from '@material-ui/core';
import { CardLayoutStyles } from './CardLayoutStyles';

const styles = theme => ({
  ...CardLayoutStyles(theme),
  chip: {
    backgroundColor: theme.palette.gold,
    marginRight: 6,
  },
});

export class TemplateCard extends Component {
  static propTypes = {
    isGoldenPath: PropTypes.bool,
    item: PropTypes.object.isRequired,
  };

  static defaultProps = {
    isGoldenPath: false,
  };

  render() {
    const { item, isGoldenPath, classes } = this.props;
    const isExperimental = item.lifecycle === 'experimental';
    // if (!item.owner) {
    //   // If an item has no owner, it has most likely been unregistered from sysmodel. Should not crash the whole page.
    //   return null;
    // }
    return (
      <Card key={item.id} className={classes.card}>
        <TemplateCardMedia name={item.name} />
        {item.description && (
          <CardContent>
            {isGoldenPath && (
              <Chip
                label="Golden Path"
                color="secondary"
                classes={{ root: classes.chip }}
              />
            )}
            {isExperimental && <Chip label="Experimental" />}
            <Typography component="div">{item.description}</Typography>
          </CardContent>
        )}
        <CardActions className={classes.cardActions}>
          <Link href={item.link || `/create/${item.id}`}>
            <Button color="primary">{item.callToAction || 'Choose'}</Button>
          </Link>
        </CardActions>
      </Card>
    );
  }
}

export default withStyles(styles)(TemplateCard);
