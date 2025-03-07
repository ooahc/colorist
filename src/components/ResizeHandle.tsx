import { useCallback, useRef } from 'react';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';

interface ResizeHandleProps {
  onResize: (width: number) => void;
  minWidth?: number;
  maxWidth?: number;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  collapsedWidth?: number;
}

export function ResizeHandle({
  onResize,
  minWidth = 420,
  maxWidth = 600,
  isCollapsed = false,
  onToggleCollapse,
  collapsedWidth = 0
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
    // 如果点击的是折叠按钮，不启动拖拽
    if ((e.target as HTMLElement).closest('.collapse-button')) {
      return;
    }

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

  // 添加和移除全局事件监听器
  const handleResizeStart = useCallback(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove, handleMouseUp]);

  const handleResizeEnd = useCallback(() => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove, handleMouseUp]);

  return (
    <div
      className={`absolute ${isCollapsed ? 'left-0' : 'right-0'} top-0 w-1.5 h-full group cursor-ew-resize`}
      onMouseDown={(e) => {
        handleMouseDown(e);
        handleResizeStart();
      }}
      onMouseUp={handleResizeEnd}
    >
      {/* 折叠/展开按钮 */}
      <button
        onClick={onToggleCollapse}
        className="collapse-button absolute top-6 -right-3 w-6 h-6 bg-white border border-gray-200 rounded-full 
          shadow-sm flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors z-10"
        title={isCollapsed ? '展开侧边栏' : '折叠侧边栏'}
      >
        {isCollapsed ? (
          <PanelLeftOpen className="w-4 h-4 text-gray-600" />
        ) : (
          <PanelLeftClose className="w-4 h-4 text-gray-600" />
        )}
      </button>

      {/* 分隔线指示器 */}
      <div className="absolute inset-y-0 left-0 w-px bg-gray-200 group-hover:bg-blue-500 transition-colors" />
      <div className="absolute inset-y-0 right-0 w-px bg-gray-200 group-hover:bg-blue-500 transition-colors" />
      
      {/* 拖动手柄指示器 */}
      {!isCollapsed && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-8 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-full h-full flex items-center justify-center space-x-0.5">
            <div className="w-px h-4 bg-blue-500 rounded-full" />
            <div className="w-px h-4 bg-blue-500 rounded-full" />
          </div>
        </div>
      )}
    </div>
  );
} 