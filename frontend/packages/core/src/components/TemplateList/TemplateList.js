import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import TemplateCard from './TemplateCard';
import { CardLayoutStyles } from './CardLayoutStyles';

export class TemplateList extends Component {
  static GOLDEN_PATH_TEMPLATE_IDS = [
    'simple-apollo-standalone',
    'scio-cookie',
    'react-skeleton',
    'science-box-cookie',
  ];

  static propTypes = {
    items: PropTypes.array.isRequired,
  };

  static isGoldenPathItem(item) {
    return TemplateList.GOLDEN_PATH_TEMPLATE_IDS.includes(item.id);
  }

  render() {
    const { items, classes } = this.props;

    return (
      <Fragment>
        <div className={classes.container}>
          {items.map(item => (
            <TemplateCard
              key={item.id}
              item={item}
              isGoldenPath={TemplateList.isGoldenPathItem(item)}
            />
          ))}
        </div>
      </Fragment>
    );
  }
}

export default withStyles(CardLayoutStyles)(TemplateList);
