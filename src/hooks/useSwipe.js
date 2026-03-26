import { useRef, useCallback } from 'react';

export const useSwipe = (onSwipeLeft, onSwipeRight, threshold = 50) => {
  const startX = useRef(null);
  const startY = useRef(null);
  const endX = useRef(null);
  const endY = useRef(null);
  const isMouseDown = useRef(false);

  const handleSwipe = useCallback(() => {
    if (!startX.current || !endX.current) return;

    const distanceX = startX.current - endX.current;
    const distanceY = Math.abs(startY.current - endY.current);

    // Only register swipe if horizontal movement is greater than vertical
    if (Math.abs(distanceX) > distanceY) {
      const isLeftSwipe = distanceX > threshold;
      const isRightSwipe = distanceX < -threshold;

      if (isLeftSwipe && onSwipeLeft) {
        onSwipeLeft();
      } else if (isRightSwipe && onSwipeRight) {
        onSwipeRight();
      }
    }

    startX.current = null;
    startY.current = null;
    endX.current = null;
    endY.current = null;
  }, [onSwipeLeft, onSwipeRight, threshold]);

  const handleTouchStart = (e) => {
    startX.current = e.targetTouches[0].clientX;
    startY.current = e.targetTouches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    endX.current = e.changedTouches[0].clientX;
    endY.current = e.changedTouches[0].clientY;
    handleSwipe();
  };

  const handleMouseDown = (e) => {
    isMouseDown.current = true;
    startX.current = e.clientX;
    startY.current = e.clientY;
  };

  const handleMouseUp = (e) => {
    if (!isMouseDown.current) return;
    isMouseDown.current = false;
    endX.current = e.clientX;
    endY.current = e.clientY;
    handleSwipe();
  };

  const handleMouseMove = (e) => {
    if (!isMouseDown.current) return;
    endX.current = e.clientX;
    endY.current = e.clientY;
  };

  return {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
    onMouseDown: handleMouseDown,
    onMouseUp: handleMouseUp,
    onMouseMove: handleMouseMove,
  };
};
