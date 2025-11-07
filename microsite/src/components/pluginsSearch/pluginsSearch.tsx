import React from 'react';

type Props = {
  searchTerm: string;
  onSearchTermChange: (newTerm: string) => void;
};

export const PluginsSearch = (props: Props) => {
  const { searchTerm, onSearchTermChange } = props;
  return (
    <input
      name="search"
      onInput={e => onSearchTermChange((e.target as HTMLInputElement).value)}
      value={searchTerm}
      placeholder="Search plugins..."
      className="DocSearch-Input search"
    />
  );
};
