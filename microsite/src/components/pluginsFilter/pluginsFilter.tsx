import { ChipCategory } from '@site/src/util/types';
import React from 'react';

type Props = {
  categories: ChipCategory[];
  handleChipClick: (name: string) => void;
};

const PluginsFilter = ({ categories, handleChipClick }: Props) => {
  return (
    <div className="dropdown dropdown--hoverable PluginFilter">
      <button className="button button--info dropdown__toggle">
        Categories Filter
      </button>
      <ul className="dropdown__menu">
        {categories.map(chip => {
          return (
            <li key={chip.name}>
              <label className="dropdown__item">
                <input
                  type="checkbox"
                  className="dropdown__checkbox"
                  checked={chip.isSelected}
                  onChange={() => handleChipClick(chip.name)}
                />
                <span className="dropdown__label">{chip.name}</span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PluginsFilter;
