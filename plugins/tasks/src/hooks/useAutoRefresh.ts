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
import { useEffect, useRef, useCallback, useState } from 'react';
import { DateTime } from 'luxon';

interface UseAutoRefreshOptions {
  /**
   * Auto-refresh interval in milliseconds
   * Minimum 10 seconds to prevent server hammering
   */
  intervalMs?: number | null;
  /** Function to call for refresh */
  onRefresh: () => void | Promise<void>;
  /** Whether auto-refresh should be enabled */
  enabled?: boolean;
  /** Whether to refresh immediately on mount */
  refreshOnMount?: boolean;
  /** Whether to refresh when page becomes visible */
  refreshOnVisible?: boolean;
}

/**
 * Hook for managing automatic refresh functionality with resource optimization
 *
 * Server-friendly:
 * - Only refreshes when page is visible (foreground tab)
 * - Enforces minimum 10-second intervals
 * - Stops when user is idle (5+ minutes)
 *
 * Client-friendly:
 * - Detects user idle state to reduce CPU usage
 * - Uses passive event listeners for better performance
 * - Proper memory cleanup and interval management
 */
export function useAutoRefresh({
  intervalMs = 30000, // Default 30 seconds
  onRefresh,
  enabled = false,
  refreshOnMount = false,
  refreshOnVisible = true,
}: UseAutoRefreshOptions) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const enabledRef = useRef(enabled);
  const lastActivityRef = useRef(DateTime.now().toMillis());

  const [isPageVisible, setIsPageVisible] = useState(true);
  const [lastRefreshTime, setLastRefreshTime] = useState(0);
  const [isUserIdle, setIsUserIdle] = useState(false);

  // Adapt interval based on user activity for client resource optimization
  const getAdaptiveInterval = useCallback(() => {
    let baseInterval = Math.max(intervalMs ?? 30000, 10000);

    // Slow down when user is idle to save CPU and battery
    if (isUserIdle) {
      baseInterval = Math.max(baseInterval * 2, 60000); // 2x slower when idle, minimum 1min
    }

    return baseInterval;
  }, [intervalMs, isUserIdle]);

  const safeIntervalMs = getAdaptiveInterval();

  // Update enabled ref when prop changes
  enabledRef.current = enabled;

  // User activity detection for idle state - reduces CPU and battery usage
  useEffect(() => {
    if (typeof document === 'undefined') return undefined;

    const resetActivityTimer = () => {
      lastActivityRef.current = DateTime.now().toMillis();
      if (isUserIdle) {
        setIsUserIdle(false);
      }
    };

    const checkIdleState = () => {
      const idleThreshold = 5 * 60 * 1000; // 5 minutes
      const isIdle =
        DateTime.now().toMillis() - lastActivityRef.current > idleThreshold;
      if (isIdle !== isUserIdle) {
        setIsUserIdle(isIdle);
      }
    };

    // Listen for user activity with passive listeners for better performance
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
    ] as const;
    events.forEach(event => {
      document.addEventListener(event, resetActivityTimer, { passive: true });
    });

    // Check idle state every minute (infrequent check to save CPU)
    const idleCheckInterval = setInterval(checkIdleState, 60000);

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetActivityTimer);
      });
      clearInterval(idleCheckInterval);
    };
  }, [isUserIdle]);

  const shouldRefresh = useCallback(() => {
    return enabledRef.current && isPageVisible && !document.hidden;
  }, [isPageVisible]);

  const startAutoRefresh = useCallback(() => {
    if (!shouldRefresh()) return;

    // Clear any existing interval to prevent memory leaks
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(async () => {
      // Triple-check conditions before refreshing
      if (shouldRefresh()) {
        const now = DateTime.now().toMillis();
        // Additional safety: ensure minimum time has passed to prevent hammering
        if (now - lastRefreshTime >= 5000) {
          // Minimum 5 seconds between refreshes
          setLastRefreshTime(now);
          try {
            await onRefresh();
          } catch (error) {
            // Silently handle errors to prevent breaking the auto-refresh loop
            // Error is intentionally ignored to maintain refresh functionality
          }
        }
      }
    }, safeIntervalMs);
  }, [shouldRefresh, safeIntervalMs, onRefresh, lastRefreshTime]);

  const stopAutoRefresh = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const toggleAutoRefresh = useCallback(
    (enable: boolean) => {
      enabledRef.current = enable;
      if (enable && shouldRefresh()) {
        startAutoRefresh();
      } else {
        stopAutoRefresh();
      }
    },
    [startAutoRefresh, stopAutoRefresh, shouldRefresh],
  );

  // Page Visibility API - stops refresh when page is not visible
  useEffect(() => {
    if (typeof document === 'undefined') {
      return undefined;
    }

    const handleVisibilityChange = () => {
      const visible = !document.hidden;
      setIsPageVisible(visible);

      if (visible && enabledRef.current) {
        // Resume auto-refresh when page becomes visible
        if (refreshOnVisible) {
          // Trigger immediate refresh when page becomes visible
          const now = DateTime.now().toMillis();
          if (now - lastRefreshTime >= 5000) {
            setLastRefreshTime(now);
            const result = onRefresh();
            if (result instanceof Promise) {
              result.catch((_error: unknown) => {
                // Error is intentionally ignored to maintain refresh functionality
              });
            }
          }
        }
        startAutoRefresh();
      } else {
        // Stop auto-refresh when page is hidden to save resources
        stopAutoRefresh();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [
    startAutoRefresh,
    stopAutoRefresh,
    refreshOnVisible,
    onRefresh,
    lastRefreshTime,
  ]);

  // Effect for managing the interval lifecycle
  useEffect(() => {
    if (enabled && shouldRefresh()) {
      startAutoRefresh();
    } else {
      stopAutoRefresh();
    }

    // Cleanup on unmount - prevent memory leaks
    return () => {
      stopAutoRefresh();
    };
  }, [enabled, shouldRefresh, startAutoRefresh, stopAutoRefresh]);

  // Restart interval when adaptive interval changes for resource optimization
  useEffect(() => {
    if (enabled && shouldRefresh() && intervalRef.current) {
      startAutoRefresh(); // This will clear old interval and start with new optimized timing
    }
  }, [safeIntervalMs, enabled, shouldRefresh, startAutoRefresh]);

  // Effect for initial refresh on mount
  useEffect(() => {
    if (refreshOnMount && shouldRefresh()) {
      const result = onRefresh();
      if (result instanceof Promise) {
        result.catch((_error: unknown) => {
          // Error is intentionally ignored to maintain refresh functionality
        });
      }
    }
  }, [refreshOnMount, onRefresh, shouldRefresh]);

  // Cleanup on unmount - critical for preventing memory leaks
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    isAutoRefreshEnabled: enabled,
    isPageVisible,
    isUserIdle,
    actualIntervalMs: safeIntervalMs,
    startAutoRefresh,
    stopAutoRefresh,
    toggleAutoRefresh,
  };
}
