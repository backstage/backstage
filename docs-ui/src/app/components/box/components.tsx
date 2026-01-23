'use client';

import { Box } from '../../../../../packages/ui/src/components/Box/Box';

const diagonalStripePattern = (() => {
  const svg = `
    <svg width="6" height="6" viewBox="0 0 6 6" xmlns="http://www.w3.org/2000/svg">
      <g fill="#2563eb" fill-opacity="0.6" fill-rule="evenodd">
        <path d="M5 0h1L0 6V5zM6 5v1H5z"/>
      </g>
    </svg>
  `.trim();
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
})();

export const Default = () => {
  return (
    <Box
      width="64px"
      height="64px"
      style={{
        background: '#eaf2fd',
        borderRadius: '4px',
        border: '1px solid #2563eb',
        backgroundImage: `url("${diagonalStripePattern}")`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        color: '#2563eb',
      }}
    />
  );
};
