'use client';

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  createContext,
  useContext,
  ReactNode,
} from 'react';

// ============================================================
//  CONFIGURATION (can be overridden via props)
// ============================================================
const DEFAULT_IDLE_TIME = 2000;
const DEFAULT_SIZE = 64;
const DEFAULT_MARGIN = 0;
// Fraction of the widget's own `size` that stays visible while idle.
const DEFAULT_IDLE_VISIBLE_RATIO = 0.6;
const DEFAULT_MIN_VISIBLE_PX = 40;

const clamp = (value: number, min: number, max: number) =>
  max < min ? min : Math.min(Math.max(value, min), max);

// ============================================================

interface FloatingContextValue {
  containerRef: React.RefObject<HTMLDivElement | null>;
  position: { x: number; y: number };
  size: number;
  snapSide: 'left' | 'right';
  isIdle: boolean;
  isDragging: boolean;
  tuckOffsetX: number;
  margin: number;
  dragHasMoved: boolean;
  isOverDropTarget: boolean;
}

const FloatingContext = createContext<FloatingContextValue | null>(null);

export function useFloatingContext() {
  const ctx = useContext(FloatingContext);
  if (!ctx) throw new Error('useFloatingContext must be used inside FloatingWrapper');
  return ctx;
}

interface FloatingWrapperProps {
  children: ReactNode;
  isVisible?: boolean;
  idleTime?: number;
  size?: number;
  margin?: number;
  idleVisibleRatio?: number;
  minVisiblePx?: number;
  onClick?: (e: React.MouseEvent) => void;
  onDragStart?: () => void;
  onDragEnd?: (droppedOnDropTarget: boolean) => void;
  dropTargetRef?: React.RefObject<HTMLElement | null>;
  onDropTargetChange?: (isOver: boolean) => void;
}

const getViewportWidth = () => document.documentElement.clientWidth;
const getViewportHeight = () => document.documentElement.clientHeight;

export function FloatingWrapper({
  children,
  isVisible = true,
  idleTime = DEFAULT_IDLE_TIME,
  size = DEFAULT_SIZE,
  margin = DEFAULT_MARGIN,
  idleVisibleRatio = DEFAULT_IDLE_VISIBLE_RATIO,
  minVisiblePx = DEFAULT_MIN_VISIBLE_PX,
  onClick,
  onDragStart,
  onDragEnd,
  dropTargetRef,
  onDropTargetChange,
}: FloatingWrapperProps) {
  const visiblePx = useMemo(
    () => clamp(size * idleVisibleRatio, Math.min(minVisiblePx, size), size),
    [size, idleVisibleRatio, minVisiblePx]
  );
  const idleOffset = size - visiblePx;

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [snapSide, setSnapSide] = useState<'left' | 'right'>('right');
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isIdle, setIsIdle] = useState(false);
  const [dragHasMoved, setDragHasMoved] = useState(false);
  const [isOverDropTarget, setIsOverDropTarget] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isOverDropTargetRef = useRef(false);
  // Prevent synthetic click (fired ~300ms after touchend on iOS) from double-firing onClick
  const touchTappedRef = useRef(false);

  const updateDropTarget = useCallback(
    (clientX: number, clientY: number) => {
      const targetRect = dropTargetRef?.current?.getBoundingClientRect();
      const isOver = Boolean(
        targetRect &&
          clientX >= targetRect.left &&
          clientX <= targetRect.right &&
          clientY >= targetRect.top &&
          clientY <= targetRect.bottom
      );

      if (isOverDropTargetRef.current !== isOver) {
        isOverDropTargetRef.current = isOver;
        setIsOverDropTarget(isOver);
        onDropTargetChange?.(isOver);
      }
    },
    [dropTargetRef, onDropTargetChange]
  );

  const wakeUp = useCallback(() => {
    setIsIdle(false);
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
  }, []);

  const wakeUpAndResetTimer = useCallback(() => {
    setIsIdle(false);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => setIsIdle(true), idleTime);
  }, [idleTime]);

  useEffect(() => {
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setPosition({
        x: getViewportWidth() - rect.width - margin,
        y: margin,
      });
      setSnapSide('right');
    }
    wakeUpAndResetTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const snapToEdge = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const vw = getViewportWidth();
    const vh = getViewportHeight();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const maxX = Math.max(margin, vw - rect.width - margin);
    const maxY = Math.max(margin, vh - rect.height - margin);

    const distLeft = centerX;
    const distRight = vw - centerX;
    const newSide = distLeft < distRight ? 'left' : 'right';
    setSnapSide(newSide);

    setPosition({
      x: newSide === 'left' ? margin : maxX,
      y: clamp(centerY - rect.height / 2, margin, maxY),
    });

    wakeUpAndResetTimer();
  }, [wakeUpAndResetTimer, margin]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      startPosRef.current = { x: e.clientX, y: e.clientY };
      setDragHasMoved(false);
      isOverDropTargetRef.current = false;
      setIsOverDropTarget(false);
      setIsDragging(true);
      isDraggingRef.current = true;
      setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      wakeUp();
      onDragStart?.();
      e.preventDefault();
    },
    [wakeUp, onDragStart]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      if (
        Math.abs(e.clientX - startPosRef.current.x) > 5 ||
        Math.abs(e.clientY - startPosRef.current.y) > 5
      ) {
        setDragHasMoved(true);
      }
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      updateDropTarget(e.clientX, e.clientY);
      const el = containerRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const maxX = Math.max(margin, getViewportWidth() - rect.width - margin);
        const maxY = Math.max(margin, getViewportHeight() - rect.height - margin);
        setPosition({
          x: clamp(newX, margin, maxX),
          y: clamp(newY, margin, maxY),
        });
      }
    },
    [dragOffset, margin, updateDropTarget]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    isDraggingRef.current = false;
    snapToEdge();
    onDragEnd?.(isOverDropTargetRef.current);
    isOverDropTargetRef.current = false;
    setIsOverDropTarget(false);
    onDropTargetChange?.(false);
  }, [snapToEdge, onDragEnd, onDropTargetChange]);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      startPosRef.current = { x: touch.clientX, y: touch.clientY };
      setDragHasMoved(false);
      isOverDropTargetRef.current = false;
      setIsOverDropTarget(false);
      setIsDragging(true);
      isDraggingRef.current = true;
      setDragOffset({ x: touch.clientX - rect.left, y: touch.clientY - rect.top });
      wakeUp();
      onDragStart?.();
      if (e.cancelable) e.preventDefault();
    },
    [wakeUp, onDragStart]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDraggingRef.current) return;
      const touch = e.touches[0];
      if (
        Math.abs(touch.clientX - startPosRef.current.x) > 5 ||
        Math.abs(touch.clientY - startPosRef.current.y) > 5
      ) {
        setDragHasMoved(true);
      }
      const newX = touch.clientX - dragOffset.x;
      const newY = touch.clientY - dragOffset.y;
      updateDropTarget(touch.clientX, touch.clientY);
      const el = containerRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const maxX = Math.max(margin, getViewportWidth() - rect.width - margin);
        const maxY = Math.max(margin, getViewportHeight() - rect.height - margin);
        setPosition({
          x: clamp(newX, margin, maxX),
          y: clamp(newY, margin, maxY),
        });
      }
    },
    [dragOffset, margin, updateDropTarget]
  );

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      const wasDragging = dragHasMoved;
      setIsDragging(false);
      isDraggingRef.current = false;
      snapToEdge();
      onDragEnd?.(isOverDropTargetRef.current);
      isOverDropTargetRef.current = false;
      setIsOverDropTarget(false);
      onDropTargetChange?.(false);

      // If it was a tap (no drag), fire onClick here directly and suppress
      // the 300ms-delayed synthetic click that iOS/Android send afterward.
      if (!wasDragging && onClick) {
        e.preventDefault(); // stops the ghost click
        touchTappedRef.current = true;
        onClick(e as unknown as React.MouseEvent);
        // Reset the flag after the ghost click window has passed
        setTimeout(() => { touchTappedRef.current = false; }, 600);
      }
    },
    [snapToEdge, onDragEnd, onDropTargetChange, dragHasMoved, onClick]
  );

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleTouchEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  useEffect(() => {
    const handleWindowResize = () => {
      if (containerRef.current && !isDragging) {
        const rect = containerRef.current.getBoundingClientRect();
        const maxX = Math.max(margin, getViewportWidth() - rect.width - margin);
        const maxY = Math.max(margin, getViewportHeight() - rect.height - margin);
        setPosition((prev) => ({
          x: snapSide === 'left' ? margin : maxX,
          y: clamp(prev.y, margin, maxY),
        }));
      }
    };
    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, [snapSide, isDragging, margin]);

  const handleContainerClick = useCallback(
    (e: React.MouseEvent) => {
      // If the tap was already handled in touchEnd, swallow this synthetic click
      if (touchTappedRef.current) {
        touchTappedRef.current = false;
        return;
      }
      if (!dragHasMoved && onClick) {
        onClick(e);
      }
      setDragHasMoved(false);
    },
    [dragHasMoved, onClick]
  );

  const handleMouseEnter = useCallback(() => {
    if (isDraggingRef.current) return;
    wakeUp();
  }, [wakeUp]);

  const handleMouseLeave = useCallback(() => {
    if (isDraggingRef.current) return;
    wakeUpAndResetTimer();
  }, [wakeUpAndResetTimer]);

  const tuckOffsetX = isIdle ? (snapSide === 'left' ? -idleOffset : idleOffset) : 0;

  const contextValue: FloatingContextValue = {
    containerRef,
    position,
    size,
    snapSide,
    isIdle,
    isDragging,
    tuckOffsetX,
    margin,
    dragHasMoved,
    isOverDropTarget,
  };

  return (
    <FloatingContext.Provider value={contextValue}>
      <div
        ref={containerRef}
        className={`fixed z-[60] select-none touch-none ${isVisible ? 'pointer-events-auto' : 'pointer-events-none'}`}
        style={{
          left: position.x,
          top: position.y,
          width: size,
          height: size,
          transition: isDragging
            ? 'opacity 0.3s ease'
            : 'left 0.15s ease-out, top 0.15s ease-out, opacity 0.3s ease',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'scale(1)' : 'scale(0.8)',
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleContainerClick}
      >
        {children}
      </div>
    </FloatingContext.Provider>
  );
}