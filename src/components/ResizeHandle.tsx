import { useCallback, useEffect } from 'react';

interface ResizeHandleProps {
  onResize: (width: number) => void;
}

export const ResizeHandle: React.FC<ResizeHandleProps> = ({ onResize }) => {
  const handleDrag = useCallback((e: MouseEvent) => {
    const width = e.clientX;
    if (width >= 420 && width <= 600) {
      onResize(width);
    }
  }, [onResize]);

  const handleDragEnd = useCallback(() => {
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', handleDragEnd);
    document.body.style.cursor = 'default';
  }, [handleDrag]);

  const startResize = useCallback(() => {
    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', handleDragEnd);
    document.body.style.cursor = 'ew-resize';
  }, [handleDrag, handleDragEnd]);

  return (
    <div
      className="absolute right-0 top-0 w-1 h-full cursor-ew-resize hover:bg-blue-500/50 transition-colors"
      onMouseDown={startResize}
    />
  );
}; 