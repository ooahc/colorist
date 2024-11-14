import React, { useRef, useEffect } from 'react';

interface ColorCardProps {
  color: string;
  name: string;
  height: number;
  fontSize: number;
  onColorChange: (newColor: string) => void;
  isSelected?: boolean;
  onBlur?: () => void;
}

export const ColorCard: React.FC<ColorCardProps> = ({ 
  color, 
  name, 
  height, 
  fontSize,
  onColorChange,
  isSelected,
  onBlur 
}) => {
  const colorInputRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        onBlur?.();
      }
    };

    if (isSelected) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isSelected, onBlur]);

  const handleClick = () => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (rect && colorInputRef.current) {
      // 创建一个临时元素来标准化颜色值
      const tempDiv = document.createElement('div');
      tempDiv.style.color = color;
      document.body.appendChild(tempDiv);
      const computedColor = window.getComputedStyle(tempDiv).color;
      document.body.removeChild(tempDiv);
      
      // 将 RGB 格式转换为 HEX
      const rgb = computedColor.match(/\d+/g);
      if (rgb) {
        const hex = '#' + rgb.map(x => {
          const hex = parseInt(x).toString(16);
          return hex.length === 1 ? '0' + hex : hex;
        }).join('');
        colorInputRef.current.value = hex;
      } else {
        colorInputRef.current.value = color;
      }

      const scrollX = window.scrollX;
      const scrollY = window.scrollY;
      
      colorInputRef.current.style.position = 'fixed';
      colorInputRef.current.style.left = `${rect.right + scrollX}px`;
      colorInputRef.current.style.top = `${rect.top + scrollY}px`;
      colorInputRef.current.click();
    }
    onColorChange(color);
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onColorChange(e.target.value);
    setTimeout(() => {
      onBlur?.();
      // 重置颜色选择器位置
      if (colorInputRef.current) {
        colorInputRef.current.style.position = 'absolute';
        colorInputRef.current.style.left = '-9999px'; // 移出视图
        colorInputRef.current.style.top = '-9999px';  // 移出视图
      }
    }, 0);
  };

  return (
    <div 
      ref={cardRef}
      className={`rounded-lg overflow-hidden border transition-all duration-200 ${
        isSelected 
          ? 'border-blue-500 shadow-lg' 
          : 'border-gray-200 shadow-sm hover:shadow-md'
      }`}
      style={{ height }}
      onClick={handleClick}
    >
      <div className="h-4/5 relative">
        <div 
          className="h-full w-full transition-colors duration-200" 
          style={{ backgroundColor: color }}
        />
        <input
          ref={colorInputRef}
          type="color"
          value={color}
          onChange={handleColorChange}
          className="absolute opacity-0 pointer-events-none"
          style={{ top: 0, left: 0 }}
        />
      </div>
      <div 
        className="h-1/5 p-2 bg-white flex flex-col items-center justify-center"
        style={{ fontSize }}
      >
        <code className="font-mono text-gray-700 truncate max-w-full">
          {name}
        </code>
      </div>
    </div>
  );
};