import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { FilterSelectors } from '../reducer';
import { initializeFiltersAction, updateFiltersAction, replaceFiltersAction } from '../actions';

export const FiltersContext = React.createContext({ updateFilters: () => {} });

const styles = {
  root: {
    padding: '15px',
  },
  title: { margin: '15px auto' },
};

const Filters = ({
  children,
  classes,
  initializeFilters,
  id,
  onChange,
  preload,
  replaceFilters,
  updateFilters,
  values,
}) => {
  let [initialPreload] = useState(() => preload);

  useEffect(() => {
    initializeFilters(id, initialPreload);
  }, [id, initialPreload, initializeFilters]);

  useEffect(() => {
    if (onChange && values) {
      onChange(values);
    }
  }, [onChange, values]);

  return (
    <FiltersContext.Provider value={{ filterValues: values || {}, filterId: id, replaceFilters, updateFilters }}>
      <div className={classes.root}>{children}</div>
    </FiltersContext.Provider>
  );
};

Filters.propTypes = {
  children: PropTypes.node,
  id: PropTypes.string.isRequired,
  initializeFilters: PropTypes.func,
  onChange: PropTypes.func,
  updateFilters: PropTypes.func,
  replaceFilters: PropTypes.func,
};

const mapStateToProps = (state, ownProps) => ({
  values: FilterSelectors.getValues(state, ownProps.id),
});

const mapDispatchToProps = {
  initializeFilters: initializeFiltersAction,
  updateFilters: updateFiltersAction,
  replaceFilters: replaceFiltersAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Filters));
