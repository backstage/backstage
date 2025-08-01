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
import { useRef, useState, useCallback } from 'react';
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

  const { classNames, resolvedProps, dataAttributes } = useStyles('Button', {
    size: 'medium',
    variant: 'primary',
  });

  return (
    <div
      data-testid={`non-responsive-${id}`}
      style={{
        marginBottom: '12px',
        padding: '12px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        backgroundColor: '#f9f9f9',
      }}
    >
      <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
        Component {id} (Render: {renderCountRef.current})
      </div>
      <div>Size: {resolvedProps.size}</div>
      <div>Variant: {resolvedProps.variant}</div>
      <div>Class: {classNames.root}</div>
      <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
        Data Attributes: {JSON.stringify(dataAttributes)}
      </div>
    </div>
  );
};

// Component that uses responsive props
const ResponsiveComponent = ({ id }: { id: string }) => {
  const renderCountRef = useRef(0);
  renderCountRef.current += 1;

  const { classNames, resolvedProps, dataAttributes } = useStyles('Button', {
    size: { xs: 'small', md: 'medium', lg: 'large' },
    variant: 'primary',
  });

  return (
    <div
      data-testid={`responsive-${id}`}
      style={{
        marginBottom: '12px',
        padding: '12px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        backgroundColor: '#fff3cd',
      }}
    >
      <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
        Component {id} (Render: {renderCountRef.current})
      </div>
      <div>Size: {resolvedProps.size}</div>
      <div>Variant: {resolvedProps.variant}</div>
      <div>Class: {classNames.root}</div>
      <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
        Data Attributes: {JSON.stringify(dataAttributes)}
      </div>
    </div>
  );
};

// Component that tests props stability
const PropsStabilityComponent = ({
  id,
  props,
}: {
  id: string;
  props: Record<string, any>;
}) => {
  const renderCountRef = useRef(0);
  renderCountRef.current += 1;

  const { classNames, resolvedProps, dataAttributes } = useStyles(
    'Button',
    props,
  );

  return (
    <div
      data-testid={`stability-${id}`}
      style={{
        marginBottom: '12px',
        padding: '12px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        backgroundColor: '#e8f4fd',
      }}
    >
      <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
        Component {id} (Render: {renderCountRef.current})
      </div>
      <div>Props: {JSON.stringify(props)}</div>
      <div>Resolved: {JSON.stringify(resolvedProps)}</div>
      <div>Class: {classNames.root}</div>
      <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
        Data Attributes: {JSON.stringify(dataAttributes)}
      </div>
    </div>
  );
};

// Component that demonstrates complex responsive props
const ComplexResponsiveComponent = ({ id }: { id: string }) => {
  const renderCountRef = useRef(0);
  renderCountRef.current += 1;

  const { classNames, resolvedProps, dataAttributes } = useStyles('Button', {
    size: { xs: 'small', sm: 'medium', md: 'large', lg: 'xlarge' },
    variant: { xs: 'secondary', md: 'primary' },
    disabled: { xs: true, lg: false },
  });

  return (
    <div
      data-testid={`complex-responsive-${id}`}
      style={{
        marginBottom: '12px',
        padding: '12px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        backgroundColor: '#d4edda',
      }}
    >
      <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
        Component {id} (Render: {renderCountRef.current})
      </div>
      <div>Size: {resolvedProps.size}</div>
      <div>Variant: {resolvedProps.variant}</div>
      <div>Disabled: {resolvedProps.disabled?.toString()}</div>
      <div>Class: {classNames.root}</div>
      <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
        Data Attributes: {JSON.stringify(dataAttributes)}
      </div>
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

export const PropsStabilityTest: Story = {
  render: () => {
    const [props1, setProps1] = useState({
      size: 'medium',
      variant: 'primary',
    });
    const [props2, setProps2] = useState({
      size: 'large',
      variant: 'secondary',
    });
    const [props3, setProps3] = useState({
      size: { xs: 'small', md: 'medium' },
      variant: 'primary',
    });

    // Function to create new props object (simulates unstable props)
    const createUnstableProps = useCallback(
      () => ({
        size: 'medium',
        variant: 'primary',
      }),
      [],
    );

    // Function to create stable props object
    const createStableProps = useCallback(
      () => ({
        size: 'medium',
        variant: 'primary',
      }),
      [],
    );

    return (
      <div style={{ padding: '20px' }}>
        <h2>Props Stability Test</h2>

        <div
          style={{
            background: '#fff3cd',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #ffeaa7',
          }}
        >
          <h3>📋 Test Instructions:</h3>
          <ol>
            <li>
              <strong>Initial State:</strong> Note the render counts for all
              components
            </li>
            <li>
              <strong>Props Change Test:</strong> Click the buttons to change
              props and observe:
              <ul>
                <li>
                  ✅ Components should only re-render when props actually change
                </li>
                <li>
                  ✅ Components with same prop values should not re-render
                </li>
                <li>
                  ✅ The createPropsKey optimization should prevent unnecessary
                  re-renders
                </li>
              </ul>
            </li>
            <li>
              <strong>Unstable Props Test:</strong> Test with unstable prop
              objects
            </li>
          </ol>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3>🔧 Props Controls:</h3>
          <div
            style={{
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap',
              marginBottom: '20px',
            }}
          >
            <button
              onClick={() => setProps1({ size: 'medium', variant: 'primary' })}
              style={{
                padding: '8px 16px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
              }}
            >
              Set Props 1: medium/primary
            </button>
            <button
              onClick={() => setProps1({ size: 'large', variant: 'secondary' })}
              style={{
                padding: '8px 16px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
              }}
            >
              Set Props 1: large/secondary
            </button>
            <button
              onClick={() => setProps2({ size: 'small', variant: 'danger' })}
              style={{
                padding: '8px 16px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
              }}
            >
              Set Props 2: small/danger
            </button>
            <button
              onClick={() =>
                setProps3({
                  size: { xs: 'small', md: 'large' },
                  variant: 'warning',
                })
              }
              style={{
                padding: '8px 16px',
                backgroundColor: '#ffc107',
                color: 'black',
                border: 'none',
                borderRadius: '4px',
              }}
            >
              Set Props 3: responsive/warning
            </button>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3>📊 Props Stability Components:</h3>
          <div
            style={{
              background: '#f8f9fa',
              padding: '15px',
              borderRadius: '8px',
              border: '1px solid #dee2e6',
            }}
          >
            <PropsStabilityComponent id="1" props={props1} />
            <PropsStabilityComponent id="2" props={props2} />
            <PropsStabilityComponent id="3" props={props3} />
            <PropsStabilityComponent id="4" props={createStableProps()} />
            <PropsStabilityComponent id="5" props={createUnstableProps()} />
          </div>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h3>🎯 Expected Behavior:</h3>
          <ul>
            <li>
              <strong>Props Change:</strong> Components should re-render when
              props actually change
            </li>
            <li>
              <strong>Props Stability:</strong> Components with same prop values
              should not re-render
            </li>
            <li>
              <strong>Optimization:</strong> The createPropsKey function should
              prevent unnecessary re-renders
            </li>
          </ul>
        </div>
      </div>
    );
  },
};

export const ComplexResponsiveTest: Story = {
  render: () => {
    return (
      <div style={{ padding: '20px' }}>
        <h2>Complex Responsive Props Test</h2>

        <div
          style={{
            background: '#d4edda',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #c3e6cb',
          }}
        >
          <h3>📋 Test Instructions:</h3>
          <ol>
            <li>
              <strong>Initial State:</strong> Note the render counts and
              resolved props
            </li>
            <li>
              <strong>Resize Test:</strong> Resize the browser window and
              observe:
              <ul>
                <li>
                  ✅ Components should re-render when crossing breakpoint
                  boundaries
                </li>
                <li>
                  ✅ Resolved props should change based on current breakpoint
                </li>
                <li>✅ Data attributes should reflect the resolved values</li>
              </ul>
            </li>
            <li>
              <strong>Complex Props:</strong> Test with multiple responsive
              properties
            </li>
          </ol>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3>🔄 Complex Responsive Components:</h3>
          <div
            style={{
              background: '#f8f9fa',
              padding: '15px',
              borderRadius: '8px',
              border: '1px solid #dee2e6',
            }}
          >
            {Array.from({ length: 3 }, (_, i) => (
              <ComplexResponsiveComponent key={i} id={`${i + 1}`} />
            ))}
          </div>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h3>🎯 Expected Behavior:</h3>
          <ul>
            <li>
              <strong>Responsive Resolution:</strong> Props should resolve to
              the appropriate value for the current breakpoint
            </li>
            <li>
              <strong>Data Attributes:</strong> Data attributes should reflect
              the resolved prop values
            </li>
            <li>
              <strong>Performance:</strong> Components should only re-render on
              actual breakpoint changes
            </li>
          </ul>
        </div>
      </div>
    );
  },
};

export const PerformanceComparison: Story = {
  render: () => {
    const [showComponents, setShowComponents] = useState(true);
    const [testType, setTestType] = useState<
      'non-responsive' | 'responsive' | 'mixed'
    >('mixed');

    return (
      <div style={{ padding: '20px' }}>
        <h2>Performance Comparison Test</h2>

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
              observe render behavior
            </li>
            <li>
              <strong>Toggle Test:</strong> Use controls to show/hide components
              and change test types
            </li>
            <li>
              <strong>Performance:</strong> Compare render behavior between
              different component types
            </li>
          </ol>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3>🔧 Test Controls:</h3>
          <div
            style={{
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap',
              marginBottom: '20px',
            }}
          >
            <button
              onClick={() => setShowComponents(!showComponents)}
              style={{
                padding: '10px 20px',
                backgroundColor: showComponents ? '#ff6b6b' : '#51cf66',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              {showComponents ? 'Hide' : 'Show'} Components
            </button>
            <button
              onClick={() => setTestType('non-responsive')}
              style={{
                padding: '10px 20px',
                backgroundColor:
                  testType === 'non-responsive' ? '#007bff' : '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Non-Responsive Only
            </button>
            <button
              onClick={() => setTestType('responsive')}
              style={{
                padding: '10px 20px',
                backgroundColor:
                  testType === 'responsive' ? '#28a745' : '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Responsive Only
            </button>
            <button
              onClick={() => setTestType('mixed')}
              style={{
                padding: '10px 20px',
                backgroundColor: testType === 'mixed' ? '#ffc107' : '#6c757d',
                color: 'black',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Mixed
            </button>
          </div>
        </div>

        {showComponents && (
          <div style={{ marginTop: '20px' }}>
            <h3>📊 Performance Test Components:</h3>
            <div
              style={{
                background: '#f8f9fa',
                padding: '15px',
                borderRadius: '8px',
                border: '1px solid #dee2e6',
              }}
            >
              {testType === 'non-responsive' &&
                Array.from({ length: 10 }, (_, i) => (
                  <NonResponsiveComponent key={i} id={`perf-nr-${i + 1}`} />
                ))}
              {testType === 'responsive' &&
                Array.from({ length: 10 }, (_, i) => (
                  <ResponsiveComponent key={i} id={`perf-r-${i + 1}`} />
                ))}
              {testType === 'mixed' && (
                <>
                  {Array.from({ length: 5 }, (_, i) => (
                    <NonResponsiveComponent
                      key={`nr-${i}`}
                      id={`perf-mixed-nr-${i + 1}`}
                    />
                  ))}
                  {Array.from({ length: 5 }, (_, i) => (
                    <ResponsiveComponent
                      key={`r-${i}`}
                      id={`perf-mixed-r-${i + 1}`}
                    />
                  ))}
                </>
              )}
            </div>
          </div>
        )}

        <div style={{ marginTop: '20px' }}>
          <h3>🎯 Expected Behavior:</h3>
          <ul>
            <li>
              <strong>Non-Responsive:</strong> Should maintain render count
              during resize
            </li>
            <li>
              <strong>Responsive:</strong> Should increment render count on
              breakpoint changes
            </li>
            <li>
              <strong>Mixed:</strong> Should show different behavior for
              different component types
            </li>
            <li>
              <strong>Performance:</strong> Large numbers of components should
              still perform well
            </li>
          </ul>
        </div>
      </div>
    );
  },
};
