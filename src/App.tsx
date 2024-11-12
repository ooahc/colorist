import React, { useState } from 'react';
import { Minus, Maximize2, X, Palette } from 'lucide-react';
import { ColorCard } from './components/ColorCard';
import { Controls } from './components/Controls';

type ColorMode = 'HSL' | 'RGB' | 'HEX';

interface ColorData {
  name: string;
  value: string;
}

function App() {
  const [colorList, setColorList] = useState('');
  const [columns, setColumns] = useState(6);
  const [cardHeight, setCardHeight] = useState(160);
  const [fontSize, setFontSize] = useState(14);
  const [colors, setColors] = useState<ColorData[]>([]);
  const [selectedColorIndex, setSelectedColorIndex] = useState<number | null>(null);

  const defaultColors: ColorData[] = [
    { name: 'Red', value: 'hsl(0, 100%, 50%)' },
    { name: 'Orange', value: 'hsl(30, 100%, 50%)' },
    { name: 'Yellow', value: 'hsl(60, 100%, 50%)' },
    { name: 'Green', value: 'hsl(120, 100%, 50%)' },
    { name: 'Blue', value: 'hsl(240, 100%, 50%)' },
    { name: 'Purple', value: 'hsl(300, 100%, 50%)' },
  ];

  const handleColorListChange = (newValue: string) => {
    setColorList(newValue);
    const colors = newValue.split('\n')
      .filter(Boolean)
      .map(line => {
        const match = line.match(/\[title=(.*?);color=(.*?)\]/);
        
        if (match) {
          const [_, title, colorValue] = match;
          return {
            name: title,
            value: colorValue
          };
        }
        return null;
      })
      .filter((color): color is ColorData => color !== null);
    
    setColors(colors);
  };

  const displayColors = colors.length > 0 ? colors : defaultColors;

  const handleColorChange = (index: number, newColor: string) => {
    const updatedColors = [...colors];
    updatedColors[index] = {
      ...updatedColors[index],
      value: newColor
    };
    setColors(updatedColors);

    const lines = colorList.split('\n');
    lines[index] = `[title=${updatedColors[index].name};color=${newColor}]`;
    setColorList(lines.join('\n'));
    setSelectedColorIndex(index);
  };

  const handleCardBlur = () => {
    setSelectedColorIndex(null);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Palette className="h-8 w-8" />
            <h1 className="text-2xl font-bold">Color Value Viewer</h1>
          </div>
          <div className="flex gap-4">
            <button className="hover:bg-white/10 p-2 rounded-full transition-colors">
              <Minus className="h-5 w-5" />
            </button>
            <button className="hover:bg-white/10 p-2 rounded-full transition-colors">
              <Maximize2 className="h-5 w-5" />
            </button>
            <button className="hover:bg-white/10 p-2 rounded-full transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 gap-6 p-6 max-w-7xl mx-auto w-full">
        <aside className="w-80 space-y-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Color Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color List
                </label>
                <textarea
                  className="w-full h-40 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                  placeholder="Enter colors (format: [title=name;color=value])"
                  value={colorList}
                  onChange={(e) => handleColorListChange(e.target.value)}
                />
              </div>
            </div>
          </div>

          <Controls
            columns={columns}
            setColumns={setColumns}
            cardHeight={cardHeight}
            setCardHeight={setCardHeight}
            fontSize={fontSize}
            setFontSize={setFontSize}
          />
        </aside>

        <main className="flex-1 bg-white p-6 rounded-lg shadow-sm">
          <div 
            className="grid gap-4" 
            style={{ 
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` 
            }}
          >
            {displayColors.map((color, idx) => (
              <ColorCard
                key={idx}
                color={color.value}
                name={color.name}
                height={cardHeight}
                fontSize={fontSize}
                onColorChange={(newColor) => handleColorChange(idx, newColor)}
                isSelected={selectedColorIndex === idx}
                onBlur={handleCardBlur}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;