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
import { useBreakpoint } from './useBreakpoint';

const meta = {
  title: 'Hooks/useBreakpoint',
};

export default meta;
type Story = StoryObj<typeof meta>;

// Component that displays current breakpoint
const BreakpointDisplay = ({ id }: { id: string }) => {
  const renderCountRef = useRef(0);
  renderCountRef.current += 1;

  const { breakpoint, up, down } = useBreakpoint();

  return (
    <div
      data-testid={`breakpoint-display-${id}`}
      style={{
        padding: '12px',
        marginBottom: '8px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        backgroundColor: '#f9f9f9',
      }}
    >
      <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
        Component {id} (Render: {renderCountRef.current})
      </div>
      <div>
        Current Breakpoint: <strong>{breakpoint}</strong>
      </div>
      <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
        <div>up('sm'): {up('sm').toString()}</div>
        <div>up('md'): {up('md').toString()}</div>
        <div>down('lg'): {down('lg').toString()}</div>
        <div>down('xl'): {down('xl').toString()}</div>
      </div>
    </div>
  );
};

// Component that demonstrates responsive behavior
const ResponsiveComponent = ({ id }: { id: string }) => {
  const renderCountRef = useRef(0);
  renderCountRef.current += 1;

  const { breakpoint } = useBreakpoint();

  const getResponsiveStyle = () => {
    switch (breakpoint) {
      case 'xl':
        return { backgroundColor: '#ff6b6b', color: 'white' };
      case 'lg':
        return { backgroundColor: '#4ecdc4', color: 'white' };
      case 'md':
        return { backgroundColor: '#45b7d1', color: 'white' };
      case 'sm':
        return { backgroundColor: '#96ceb4', color: 'black' };
      case 'xs':
        return { backgroundColor: '#feca57', color: 'black' };
      default:
        return { backgroundColor: '#ff9ff3', color: 'black' };
    }
  };

  const getResponsiveText = () => {
    switch (breakpoint) {
      case 'xl':
        return 'Extra Large (≥1536px)';
      case 'lg':
        return 'Large (≥1280px)';
      case 'md':
        return 'Medium (≥1024px)';
      case 'sm':
        return 'Small (≥768px)';
      case 'xs':
        return 'Extra Small (≥640px)';
      default:
        return 'Initial (<640px)';
    }
  };

  return (
    <div
      data-testid={`responsive-${id}`}
      style={{
        padding: '16px',
        marginBottom: '12px',
        borderRadius: '8px',
        border: '2px solid #333',
        ...getResponsiveStyle(),
      }}
    >
      <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
        Responsive Component {id} (Render: {renderCountRef.current})
      </div>
      <div style={{ fontSize: '14px' }}>{getResponsiveText()}</div>
      <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '4px' }}>
        Width: {typeof window !== 'undefined' ? window.innerWidth : 'N/A'}px
      </div>
    </div>
  );
};

// Component that demonstrates up/down functions
const UpDownDemo = () => {
  const { up, down } = useBreakpoint();

  const breakpoints = ['initial', 'xs', 'sm', 'md', 'lg', 'xl'] as const;

  return (
    <div
      style={{
        padding: '16px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
      }}
    >
      <h3 style={{ marginTop: 0 }}>Up/Down Function Demo</h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px',
        }}
      >
        <div>
          <h4>up() function</h4>
          {breakpoints.map(bp => (
            <div key={bp} style={{ marginBottom: '4px' }}>
              up('{bp}'):{' '}
              <strong style={{ color: up(bp) ? 'green' : 'red' }}>
                {up(bp).toString()}
              </strong>
            </div>
          ))}
        </div>
        <div>
          <h4>down() function</h4>
          {breakpoints.map(bp => (
            <div key={bp} style={{ marginBottom: '4px' }}>
              down('{bp}'):{' '}
              <strong style={{ color: down(bp) ? 'green' : 'red' }}>
                {down(bp).toString()}
              </strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const BasicUsage: Story = {
  render: () => (
    <div style={{ padding: '20px' }}>
      <h2>useBreakpoint Basic Usage</h2>
      <div style={{ marginBottom: '20px' }}>
        <p>
          This demonstrates the basic functionality of the useBreakpoint hook.
        </p>
        <p>Try resizing the browser window to see the breakpoint change.</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Breakpoint Display Components</h3>
        {Array.from({ length: 3 }, (_, i) => (
          <BreakpointDisplay key={i} id={`${i + 1}`} />
        ))}
      </div>

      <UpDownDemo />
    </div>
  ),
};

export const ResponsiveDemo: Story = {
  render: () => (
    <div style={{ padding: '20px' }}>
      <h2>Responsive Component Demo</h2>
      <div style={{ marginBottom: '20px' }}>
        <p>
          These components change their appearance based on the current
          breakpoint.
        </p>
        <p>Resize the browser window to see the visual changes.</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Responsive Components</h3>
        {Array.from({ length: 4 }, (_, i) => (
          <ResponsiveComponent key={i} id={`${i + 1}`} />
        ))}
      </div>
    </div>
  ),
};

export const PerformanceTest: Story = {
  render: () => {
    const [showComponents, setShowComponents] = useState(true);

    return (
      <div style={{ padding: '20px' }}>
        <h2>Performance Test</h2>

        <div
          style={{
            background: '#e8f4fd',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #b3d9ff',
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
                  ✅ Components should only re-render when crossing breakpoint
                  boundaries
                </li>
                <li>
                  ✅ Render counts should increment only on actual breakpoint
                  changes
                </li>
                <li>
                  ✅ No re-renders should occur between breakpoint boundaries
                </li>
              </ul>
            </li>
            <li>
              <strong>Toggle Test:</strong> Use the toggle button to show/hide
              components
            </li>
          </ol>
        </div>

        <button
          onClick={() => setShowComponents(!showComponents)}
          style={{
            padding: '10px 20px',
            backgroundColor: showComponents ? '#ff6b6b' : '#51cf66',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginBottom: '20px',
          }}
        >
          {showComponents ? 'Hide' : 'Show'} Components
        </button>

        {showComponents && (
          <div style={{ marginTop: '20px' }}>
            <h3>Performance Test Components:</h3>
            <div
              style={{
                background: '#f8f9fa',
                padding: '15px',
                borderRadius: '8px',
                border: '1px solid #dee2e6',
              }}
            >
              {Array.from({ length: 10 }, (_, i) => (
                <BreakpointDisplay key={i} id={`perf-${i + 1}`} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  },
};

export const BreakpointBoundaries: Story = {
  render: () => (
    <div style={{ padding: '20px' }}>
      <h2>Breakpoint Boundaries</h2>

      <div
        style={{
          background: '#fff3cd',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '1px solid #ffeaa7',
        }}
      >
        <h3>📏 Breakpoint Values:</h3>
        <ul>
          <li>
            <strong>initial:</strong> &lt; 640px
          </li>
          <li>
            <strong>xs:</strong> ≥ 640px
          </li>
          <li>
            <strong>sm:</strong> ≥ 768px
          </li>
          <li>
            <strong>md:</strong> ≥ 1024px
          </li>
          <li>
            <strong>lg:</strong> ≥ 1280px
          </li>
          <li>
            <strong>xl:</strong> ≥ 1536px
          </li>
        </ul>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Current Window Size:</h3>
        <div
          style={{
            padding: '12px',
            backgroundColor: '#f0f0f0',
            borderRadius: '4px',
            fontFamily: 'monospace',
          }}
        >
          Width: {typeof window !== 'undefined' ? window.innerWidth : 'N/A'}px
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Breakpoint Display:</h3>
        {Array.from({ length: 2 }, (_, i) => (
          <BreakpointDisplay key={i} id={`boundary-${i + 1}`} />
        ))}
      </div>

      <UpDownDemo />
    </div>
  ),
};

export const LazyLoading: Story = {
  render: () => {
    const [showUpDown, setShowUpDown] = useState(false);

    return (
      <div style={{ padding: '20px' }}>
        <h2>Lazy Loading Demo</h2>

        <div
          style={{
            background: '#d4edda',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #c3e6cb',
          }}
        >
          <h3>🎯 Lazy Loading Benefits:</h3>
          <ul>
            <li>
              <strong>Efficient:</strong> Media queries are only created when
              up()/down() functions are called
            </li>
            <li>
              <strong>Performance:</strong> Reduces initial media query overhead
            </li>
            <li>
              <strong>Memory:</strong> Only creates listeners when actually
              needed
            </li>
          </ul>
        </div>

        <button
          onClick={() => setShowUpDown(!showUpDown)}
          style={{
            padding: '10px 20px',
            backgroundColor: showUpDown ? '#ff6b6b' : '#51cf66',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginBottom: '20px',
          }}
        >
          {showUpDown ? 'Hide' : 'Show'} Up/Down Functions
        </button>

        <div style={{ marginBottom: '20px' }}>
          <h3>Basic Breakpoint (Always Loaded):</h3>
          <BreakpointDisplay id="lazy-1" />
        </div>

        {showUpDown && (
          <div style={{ marginTop: '20px' }}>
            <h3>Lazy Up/Down Functions (Only Loaded When Toggled):</h3>
            <UpDownDemo />
          </div>
        )}
      </div>
    );
  },
};
