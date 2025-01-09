'use client';

import { Box, Inline } from '../../../packages/canon';

const fakeBlockList = [
  { width: 45, height: 60 },
  { width: 150, height: 75 },
  { width: 80, height: 50 },
  { width: 120, height: 70 },
  { width: 95, height: 65 },
  { width: 80, height: 32 },
  { width: 130, height: 60 },
  { width: 100, height: 80 },
  { width: 140, height: 45 },
  { width: 85, height: 70 },
  { width: 125, height: 50 },
];

const FakeBox = ({
  width = 120,
  height = 80,
}: {
  width?: number;
  height?: number;
}) => (
  <Box
    borderRadius="xs"
    style={{
      background: '#eaf2fd',
      borderRadius: '4px',
      boxShadow: '0 0 0 1px #2563eb',
      width,
      height,
      backgroundImage:
        'url("data:image/svg+xml,%3Csvg%20width%3D%226%22%20height%3D%226%22%20viewBox%3D%220%200%206%206%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22%232563eb%22%20fill-opacity%3D%220.3%22%20fill-rule%3D%22evenodd%22%3E%3Cpath%20d%3D%22M5%200h1L0%206V5zM6%205v1H5z%22/%3E%3C/g%3E%3C/svg%3E")',
    }}
  />
);

export const InlinePreview = () => {
  return (
    <Inline>
      {fakeBlockList.map((block, index) => (
        <FakeBox key={index} width={block.width} height={block.height} />
      ))}
    </Inline>
  );
};
