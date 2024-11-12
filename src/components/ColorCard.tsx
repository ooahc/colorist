import React from 'react';

interface ColorCardProps {
  color: string;
  name: string;
  height: number;
  fontSize: number;
}

export const ColorCard: React.FC<ColorCardProps> = ({ color, name, height, fontSize }) => {
  return (
    <div 
      className="rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
      style={{ height }}
    >
      <div 
        className="h-4/5 transition-colors duration-200" 
        style={{ backgroundColor: color }}
      />
      <div 
        className="h-1/5 p-2 bg-white flex items-center justify-center"
        style={{ fontSize }}
      >
        <code className="font-mono text-gray-700 truncate max-w-full">
          {name}
        </code>
      </div>
    </div>
  );
};