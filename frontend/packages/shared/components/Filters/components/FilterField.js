import React, { Fragment, useEffect, useState, useContext } from 'react';
import { FormGroup, withStyles } from '@material-ui/core';
import { Checkbox, FormControlLabel } from 'core/app/styledMUIComponents';
import capitalize from 'lodash/capitalize';
import { FiltersContext } from './Filters';

const styles = {
  label: {
    fontSize: '.875rem',
  },
  description: {
    display: 'block',
    color: '#979797',
    fontSize: '12px',
  },
  checkbox: {
    '& svg': {
      width: '.8em',
      height: '.8em',
    },
  },
};

const FilterField = ({
  classes,
  children,
  count,
  description,
  filterSetId,
  hasChildren,
  id,
  label,
  onChange,
  parentClicked,
  parentValue,
  preserveCase,
  icon,
}) => {
  const [value, setValue] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [childValues, setChildValues] = useState({});
  const { filterId, filterValues, updateFilters } = useContext(FiltersContext);

  useEffect(() => {
    // If checkbox filter is a CHILD,
    // it needs to toggle along with it's parent
    // when the parent is clicked.
    if (parentClicked && !hasChildren) {
      setValue(parentValue);
      if (onChange) {
        onChange({ [id]: parentValue });
      }
      updateFilters(filterId, filterSetId, { [id]: parentValue });
    }
  }, [id, filterId, filterSetId, hasChildren, onChange, parentClicked, parentValue, setValue, updateFilters]);

  useEffect(() => {
    // If checkbox filter is a PARENT,
    // it needs to keep track of its children's values.
    // If ANY children are toggled on, it must be on.
    // If ALL children are toggled off, it must be off.
    setValue(Object.values(childValues).reduce((acc, value) => acc || value, false));
  }, [childValues]);

  useEffect(
    // Sets the value of the checkbox if redux state was preloaded
    () => {
      const anyChild = Object.values(childValues).includes(true);
      const val = (filterValues[filterSetId] && filterValues[filterSetId][id]) || anyChild || false;
      if (val !== value) {
        setValue(val);
        if (onChange) {
          onChange({ [id]: val });
        }
      }
    },
    [filterValues, filterSetId, id, onChange, value, childValues],
  );

  const handleChildUpdate = update => {
    setClicked(false);
    setChildValues(prevState => {
      return { ...prevState, ...update };
    });
  };

  const checkboxControl = (
    <Checkbox
      checked={value || false}
      color="primary"
      classes={{ root: classes.checkbox }}
      inputProps={{ 'aria-label': `filter-${id}` }}
      onChange={(e, checked) => {
        if (!hasChildren) {
          updateFilters(filterId, filterSetId, { [id]: !!checked });
        }
        setValue(checked);
        setClicked(true);
        if (onChange) {
          onChange({ [id]: checked });
        }
      }}
    />
  );

  const countString = `(${count})`;
  return (
    <Fragment>
      <FormGroup row>
        <FormControlLabel
          control={checkboxControl}
          label={
            <Fragment>
              {icon}
              <span className={classes.label}>{`${preserveCase ? label : capitalize(label)} ${countString || 0}`}</span>
              {description && <span className={classes.description}>{description}</span>}
            </Fragment>
          }
        />
      </FormGroup>
      {children && children({ handleChildUpdate, parentValue: value, parentClicked: clicked })}
    </Fragment>
  );
};

export default withStyles(styles)(React.memo(FilterField));
