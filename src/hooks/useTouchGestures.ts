import { useRef, useEffect, useCallback } from 'react';

interface TouchGestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onPinchZoomIn?: () => void;
  onPinchZoomOut?: () => void;
  onDoubleTap?: () => void;
  onLongPress?: () => void;
  swipeThreshold?: number;
  longPressDelay?: number;
  doubleTapDelay?: number;
}

interface TouchPoint {
  x: number;
  y: number;
  time: number;
}

export const useTouchGestures = (
  elementRef: React.RefObject<HTMLElement>,
  options: TouchGestureOptions
) => {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onPinchZoomIn,
    onPinchZoomOut,
    onDoubleTap,
    onLongPress,
    swipeThreshold = 50,
    longPressDelay = 500,
    doubleTapDelay = 300
  } = options;
  
  const touchStartRef = useRef<TouchPoint | null>(null);
  const lastTapRef = useRef<number>(0);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const initialPinchDistanceRef = useRef<number | null>(null);
  
  // Calculate distance between two touch points
  const getDistance = (touch1: Touch, touch2: Touch): number => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };
  
  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
    
    // Handle pinch gesture start
    if (e.touches.length === 2) {
      initialPinchDistanceRef.current = getDistance(e.touches[0], e.touches[1]);
    }
    
    // Start long press timer
    if (onLongPress) {
      longPressTimerRef.current = setTimeout(() => {
        onLongPress();
        // Haptic feedback
        if ('vibrate' in navigator) {
          navigator.vibrate(50);
        }
      }, longPressDelay);
    }
  }, [onLongPress, longPressDelay]);
  
  const handleTouchMove = useCallback((e: TouchEvent) => {
    // Cancel long press on move
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    
    // Handle pinch gesture
    if (e.touches.length === 2 && initialPinchDistanceRef.current !== null) {
      const currentDistance = getDistance(e.touches[0], e.touches[1]);
      const scale = currentDistance / initialPinchDistanceRef.current;
      
      if (scale > 1.2 && onPinchZoomIn) {
        onPinchZoomIn();
        initialPinchDistanceRef.current = currentDistance; // Reset to prevent multiple triggers
      } else if (scale < 0.8 && onPinchZoomOut) {
        onPinchZoomOut();
        initialPinchDistanceRef.current = currentDistance;
      }
    }
  }, [onPinchZoomIn, onPinchZoomOut]);
  
  const handleTouchEnd = useCallback((e: TouchEvent) => {
    // Clear long press timer
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    
    // Reset pinch distance
    initialPinchDistanceRef.current = null;
    
    if (!touchStartRef.current) return;
    
    const touchEnd = e.changedTouches[0];
    const deltaX = touchEnd.clientX - touchStartRef.current.x;
    const deltaY = touchEnd.clientY - touchStartRef.current.y;
    const deltaTime = Date.now() - touchStartRef.current.time;
    
    // Check for swipe gestures
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (Math.abs(deltaX) > swipeThreshold) {
        if (deltaX > 0 && onSwipeRight) {
          onSwipeRight();
        } else if (deltaX < 0 && onSwipeLeft) {
          onSwipeLeft();
        }
      }
    } else {
      // Vertical swipe
      if (Math.abs(deltaY) > swipeThreshold) {
        if (deltaY > 0 && onSwipeDown) {
          onSwipeDown();
        } else if (deltaY < 0 && onSwipeUp) {
          onSwipeUp();
        }
      }
    }
    
    // Check for double tap
    if (onDoubleTap && Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10 && deltaTime < 200) {
      const currentTime = Date.now();
      if (currentTime - lastTapRef.current < doubleTapDelay) {
        onDoubleTap();
        lastTapRef.current = 0; // Reset to prevent triple tap
      } else {
        lastTapRef.current = currentTime;
      }
    }
    
    touchStartRef.current = null;
  }, [
    swipeThreshold,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onDoubleTap,
    doubleTapDelay
  ]);
  
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    
    // Add passive: false to prevent scroll while handling touch
    const options = { passive: false };
    
    element.addEventListener('touchstart', handleTouchStart, options);
    element.addEventListener('touchmove', handleTouchMove, options);
    element.addEventListener('touchend', handleTouchEnd, options);
    
    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);
  
  return {
    // Expose refs for custom handling if needed
    touchStartRef,
    lastTapRef
  };
};