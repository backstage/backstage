import React, { useContext } from 'react';
import Select from 'react-select';
import { FiltersContext } from './Filters';

const styles = {
  menu: provided => ({
    ...provided,
    fontSize: 14,
  }),
  multiValue: provided => ({
    ...provided,
    border: '1px solid black',
    borderRadius: 15,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  }),
};

const SearchableSet = ({ id, values }) => {
  const { filterId, filterValues, replaceFilters } = useContext(FiltersContext);

  return (
    <Select
      defaultValue={Object.keys(filterValues[id] || {}).map(val => {
        const knownFilters = values.find(option => option.value === val);
        return knownFilters
          ? {
              value: val,
              label: knownFilters.label,
            }
          : null;
      })}
      name="searchable"
      options={values}
      onChange={values =>
        replaceFilters(
          filterId,
          id,
          values.reduce((acc, selected) => {
            acc[selected.value] = true;
            return acc;
          }, {}),
        )
      }
      isMulti
      styles={styles}
    />
  );
};

export default SearchableSet;
