import { useCallback, useRef, useState } from 'react';
import { MonacoEditor } from './MonacoEditor';

interface ResizableEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
  maxHeight?: number;
  defaultHeight?: number;
}

export function ResizableEditor({
  value,
  onChange,
  placeholder,
  minHeight = 160,
  maxHeight = 600,
  defaultHeight = 160
}: ResizableEditorProps) {
  const [height, setHeight] = useState(defaultHeight);
  const isDraggingRef = useRef(false);
  const startYRef = useRef(0);
  const startHeightRef = useRef(height);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDraggingRef.current = true;
    startYRef.current = e.clientY;
    startHeightRef.current = height;
    document.body.style.cursor = 'row-resize';
    
    // 防止文本选择
    e.preventDefault();
  }, [height]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDraggingRef.current) return;

    const delta = e.clientY - startYRef.current;
    const newHeight = Math.max(minHeight, Math.min(maxHeight, startHeightRef.current + delta));
    setHeight(newHeight);
  }, [maxHeight, minHeight]);

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
    document.body.style.cursor = 'default';
  }, []);

  // 添加处理鼠标离开文档的函数
  const handleMouseLeave = useCallback(() => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      document.body.style.cursor = 'default';
    }
  }, []);

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
    
    // 确保在任何情况下重置光标
    isDraggingRef.current = false;
    document.body.style.cursor = 'default';
  }, [handleMouseMove, handleMouseUp, handleMouseLeave]);

  return (
    <div className="relative w-full border border-gray-300 rounded-md shadow-sm overflow-hidden">
      <MonacoEditor
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        height={height}
      />
      {/* 拖动手柄 */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1.5 bg-transparent hover:bg-gray-200 cursor-row-resize 
          flex items-center justify-center group transition-colors"
        onMouseDown={(e) => {
          handleMouseDown(e);
          handleResizeStart();
        }}
        onMouseUp={handleResizeEnd}
      >
        <div className="w-20 h-0.5 bg-gray-300 group-hover:bg-gray-400 transition-colors" />
      </div>
    </div>
  );
} 