'use client';

import { Flex } from '../../../packages/canon';

const DecorativeBox = () => {
  return (
    <div
      style={{
        background: '#eaf2fd',
        borderRadius: '4px',
        boxShadow: '0 0 0 1px #2563eb',
        height: '32px',
        minWidth: '100px',
        backgroundImage:
          'url("data:image/svg+xml,%3Csvg%20width%3D%226%22%20height%3D%226%22%20viewBox%3D%220%200%206%206%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22%232563eb%22%20fill-opacity%3D%220.3%22%20fill-rule%3D%22evenodd%22%3E%3Cpath%20d%3D%22M5%200h1L0%206V5zM6%205v1H5z%22/%3E%3C/g%3E%3C/svg%3E")',
      }}
    />
  );
};

export const FlexPreview = () => {
  return (
    <div style={{ width: '320px' }}>
      <Flex>
        <DecorativeBox />
        <DecorativeBox />
        <DecorativeBox />
      </Flex>
    </div>
  );
};
