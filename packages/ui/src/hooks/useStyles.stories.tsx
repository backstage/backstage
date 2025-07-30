/*
 * Copyright 2025 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { StoryObj } from '@storybook/react';
import { useRef, useState } from 'react';
import { useStyles } from './useStyles';

const meta = {
  title: 'Hooks/useStyles',
};

export default meta;
type Story = StoryObj<typeof meta>;

// Component that uses non-responsive props
const NonResponsiveComponent = ({ id }: { id: string }) => {
  const renderCountRef = useRef(0);
  renderCountRef.current += 1;

  const { classNames, resolvedProps } = useStyles('Button', {
    size: 'medium',
    variant: 'primary',
  });

  return (
    <div data-testid={`non-responsive-${id}`} style={{ marginBottom: '12px' }}>
      <div>Render count: {renderCountRef.current}</div>
      <div>Size: {resolvedProps.size}</div>
      <div>Variant: {resolvedProps.variant}</div>
      <div>Class: {classNames.root}</div>
    </div>
  );
};

// Component that uses responsive props
const ResponsiveComponent = ({ id }: { id: string }) => {
  const renderCountRef = useRef(0);
  renderCountRef.current += 1;

  const { classNames, resolvedProps } = useStyles('Button', {
    size: { xs: 'small', md: 'medium', lg: 'large' },
    variant: 'primary',
  });

  return (
    <div data-testid={`responsive-${id}`} style={{ marginBottom: '12px' }}>
      <div>Render count: {renderCountRef.current}</div>
      <div>Size: {resolvedProps.size}</div>
      <div>Variant: {resolvedProps.variant}</div>
      <div>Class: {classNames.root}</div>
    </div>
  );
};

export const ReRenderTest: Story = {
  render: () => {
    const [showResponsive, setShowResponsive] = useState(true);

    return (
      <div style={{ padding: '20px' }}>
        <h2>useStyles Re-render Test</h2>
        <div
          style={{
            background: '#f5f5f5',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #ddd',
          }}
        >
          <h3>📋 Test Instructions:</h3>
          <ol>
            <li>
              <strong>Initial State:</strong> Note the render counts for all
              components
            </li>
            <li>
              <strong>Resize Test:</strong> Resize the browser window and
              observe:
              <ul>
                <li>
                  ✅ Non-responsive components should maintain the same render
                  count
                </li>
                <li>
                  ✅ Responsive components should increment their render count
                </li>
              </ul>
            </li>
            <li>
              <strong>Toggle Test:</strong> Use the toggle button to show/hide
              responsive components
            </li>
          </ol>
        </div>

        <div
          style={{
            background: '#e8f4fd',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #b3d9ff',
          }}
        >
          <h3>🎯 Expected Behavior:</h3>
          <ul>
            <li>
              <strong>Non-responsive:</strong> Components with simple props
              (like <code>size: 'medium'</code>) should NOT re-render on resize
            </li>
            <li>
              <strong>Responsive:</strong> Components with responsive props
              (like <code>size: {`{ xs: 'small', md: 'medium' }`}</code>) SHOULD
              re-render on resize
            </li>
            <li>
              <strong>Optimization:</strong> This prevents unnecessary
              re-renders in large component trees
            </li>
          </ul>
        </div>

        <button
          onClick={() => setShowResponsive(!showResponsive)}
          style={{
            padding: '10px 20px',
            backgroundColor: showResponsive ? '#ff6b6b' : '#51cf66',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginBottom: '20px',
          }}
        >
          {showResponsive ? 'Hide' : 'Show'} Responsive Components
        </button>

        <div style={{ marginTop: '20px' }}>
          <h3>
            🚫 Non-Responsive Components (should not re-render on resize):
          </h3>
          <div
            style={{
              background: '#f8f9fa',
              padding: '15px',
              borderRadius: '8px',
              border: '1px solid #dee2e6',
            }}
          >
            {Array.from({ length: 5 }, (_, i) => (
              <NonResponsiveComponent key={i} id={`${i}`} />
            ))}
          </div>
        </div>

        {showResponsive && (
          <div style={{ marginTop: '20px' }}>
            <h3>🔄 Responsive Components (will re-render on resize):</h3>
            <div
              style={{
                background: '#fff3cd',
                padding: '15px',
                borderRadius: '8px',
                border: '1px solid #ffeaa7',
              }}
            >
              {Array.from({ length: 3 }, (_, i) => (
                <ResponsiveComponent key={i} id={`${i}`} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  },
};
