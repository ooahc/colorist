import React from 'react';

interface ControlsProps {
  columns: number;
  setColumns: (value: number) => void;
  cardHeight: number;
  setCardHeight: (value: number) => void;
  fontSize: number;
  setFontSize: (value: number) => void;
}

export const Controls: React.FC<ControlsProps> = ({
  columns,
  setColumns,
  cardHeight,
  setCardHeight,
  fontSize,
  setFontSize,
}) => {
  return (
    <div className="space-y-6 bg-white p-4 rounded-lg shadow-sm">
      <div>
        <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
          Columns
          <span className="text-gray-500">{columns}</span>
        </label>
        <input 
          type="range" 
          min="1" 
          max="12"
          value={columns}
          onChange={(e) => setColumns(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>
      
      <div>
        <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
          Card Height
          <span className="text-gray-500">{cardHeight}px</span>
        </label>
        <input 
          type="range" 
          min="80" 
          max="240" 
          step="8"
          value={cardHeight}
          onChange={(e) => setCardHeight(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>
      
      <div>
        <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
          Font Size
          <span className="text-gray-500">{fontSize}px</span>
        </label>
        <input 
          type="range" 
          min="10" 
          max="20" 
          value={fontSize}
          onChange={(e) => setFontSize(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>
    </div>
  );
};