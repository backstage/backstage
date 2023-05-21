import { ChipCategory } from '@site/src/util/types';
import React from 'react';

type Props = {
  categories: ChipCategory[];
  handleChipClick: (name: string) => void;
};

const PluginsFilter = ({ categories, handleChipClick }: Props) => {
  const alphaCategories = categories.sort((a,b) => a.name.localeCompare(b.name))

  return (
    <div className="dropdown dropdown--hoverable">
      <button className="button button--info dropdown__toggle">
        Categories Filter
      </button>
      <ul className="dropdown__menu">
        {alphaCategories.map(chip => {
          return (
            <li key={chip.name} onClick={() => handleChipClick(chip.name)}>
              <div className="dropdown__item">
                <input
                  type="checkbox"
                  className="dropdown__checkbox"
                  checked={chip.isSelected}
                  onChange={() => handleChipClick(chip.name)}
                />
                <span className="dropdown__label">{chip.name}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PluginsFilter;
