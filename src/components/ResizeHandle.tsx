import { useCallback, useRef } from 'react';

interface ResizeHandleProps {
  onResize: (width: number) => void;
  minWidth?: number;
  maxWidth?: number;
}

// 添加类型声明来解决 CSSStyleDeclaration 问题
declare global {
  interface CSSStyleDeclaration {
    WebkitUserSelect: string;
    msUserSelect: string;
    MozUserSelect: string;
  }
}

export function ResizeHandle({
  onResize,
  minWidth = 420,
  maxWidth = 600
}: ResizeHandleProps) {
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  // 添加和移除用户选择样式
  const disableSelection = useCallback(() => {
    document.body.style.userSelect = 'none';
    document.body.style.WebkitUserSelect = 'none';
    document.body.style.msUserSelect = 'none';
    document.body.style.MozUserSelect = 'none';
  }, []);

  const enableSelection = useCallback(() => {
    document.body.style.userSelect = '';
    document.body.style.WebkitUserSelect = '';
    document.body.style.msUserSelect = '';
    document.body.style.MozUserSelect = '';
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    startWidthRef.current = e.currentTarget.parentElement?.getBoundingClientRect().width ?? 0;
    document.body.style.cursor = 'ew-resize';
    disableSelection();
    e.preventDefault();
  }, [disableSelection]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDraggingRef.current) return;

    const delta = e.clientX - startXRef.current;
    const newWidth = Math.max(minWidth, Math.min(maxWidth, startWidthRef.current + delta));
    onResize(newWidth);
    e.preventDefault();
  }, [maxWidth, minWidth, onResize]);

  const handleMouseUp = useCallback(() => {
    if (!isDraggingRef.current) return;
    
    isDraggingRef.current = false;
    document.body.style.cursor = 'default';
    enableSelection();
  }, [enableSelection]);

  // 添加处理鼠标离开文档的函数
  const handleMouseLeave = useCallback(() => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      document.body.style.cursor = 'default';
      enableSelection();
    }
  }, [enableSelection]);

  // 添加和移除全局事件监听器
  const handleResizeStart = useCallback(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
  }, [handleMouseMove, handleMouseUp, handleMouseLeave]);

  const handleResizeEnd = useCallback(() => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    document.removeEventListener('mouseleave', handleMouseLeave);
    
    // 确保在任何情况下重置光标和选择状态
    isDraggingRef.current = false;
    document.body.style.cursor = 'default';
    enableSelection();
  }, [handleMouseMove, handleMouseUp, handleMouseLeave, enableSelection]);

  return (
    <div
      className="absolute right-0 top-0 w-1.5 h-full group cursor-ew-resize"
      onMouseDown={(e) => {
        handleMouseDown(e);
        handleResizeStart();
      }}
      onMouseUp={handleResizeEnd}
    >
      {/* 视觉指示器 */}
      <div className="absolute inset-y-0 left-0 w-px bg-gray-200 group-hover:bg-blue-500 transition-colors" />
      <div className="absolute inset-y-0 right-0 w-px bg-gray-200 group-hover:bg-blue-500 transition-colors" />
      
      {/* 拖动手柄指示器 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-8 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-full h-full flex items-center justify-center space-x-0.5">
          <div className="w-px h-4 bg-blue-500 rounded-full" />
          <div className="w-px h-4 bg-blue-500 rounded-full" />
        </div>
      </div>
    </div>
  );
} 