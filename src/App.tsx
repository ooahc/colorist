import { useState, useEffect } from 'react';
import { Minus, Maximize2, X, Palette, InfoIcon } from 'lucide-react';
import { ColorCard } from './components/ColorCard';
import { Controls } from './components/Controls';
import { getColorName } from './utils/colorNames';

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
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);

  const defaultColors: ColorData[] = [
    { name: 'Red', value: 'hsl(0, 100%, 50%)' },
    { name: 'Orange', value: 'hsl(30, 100%, 50%)' },
    { name: 'Yellow', value: 'hsl(60, 100%, 50%)' },
    { name: 'Green', value: 'hsl(120, 100%, 50%)' },
    { name: 'Blue', value: 'hsl(240, 100%, 50%)' },
    { name: 'Purple', value: 'hsl(300, 100%, 50%)' },
  ];

  const handleColorListChange = (value: string) => {
    const lines = value.split('\n');
    const colors = lines
      .map(inputLine => {
        const trimmedLine = inputLine.trim();
        if (!trimmedLine) return null;

        // 匹配完整格式 title=name;color=value
        const formatMatch = trimmedLine.match(/^title=(.*?);color=(.+)$/);
        if (formatMatch) {
          return {
            name: formatMatch[1].trim(),
            value: formatMatch[2].trim()
          };
        }
        
        // 匹配直接的颜色值（支持更多格式）
        const isColorValue = /^(#([0-9a-f]{3}|[0-9a-f]{6})|rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)|hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\))$/i;
        
        if (isColorValue.test(trimmedLine)) {
          return {
            name: getColorName(trimmedLine),
            value: trimmedLine
          };
        }
        
        return null;
      })
      .filter((color): color is ColorData => color !== null);
    
    setColorList(value);
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

    if (colorList) {
      const lines = colorList.split('\n');
      if (lines[index]) {
        const formatMatch = lines[index].match(/title=(.*?);color=/);
        if (formatMatch) {
          lines[index] = `title=${formatMatch[1]};color=${newColor}`;
        } else {
          lines[index] = newColor;
        }
        setColorList(lines.join('\n'));
      }
    }
    setSelectedColorIndex(index);
  };

  const handleCardBlur = () => {
    setSelectedColorIndex(null);
  };

  const placeholderText = `以下任意格式可生成颜色卡片：
1. title=MyColor;color=#fff
2. title=Blue;color=#000
3. #ff0000
4. rgb(0,255,0)
5. hsl(240,100%,50%)`;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isPopoverVisible) {
        setIsPopoverVisible(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isPopoverVisible]);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Palette className="h-8 w-8" />
            <h1 className="text-2xl font-bold">疯狂的调色盘</h1>
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

      <div className="flex pt-[72px] h-screen">
        <aside className="fixed bottom-0 top-[72px] left-5 w-[408px] overflow-y-auto p-6">
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">显示设置</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Color List
                    </label>
                    <div className="relative">
                      <InfoIcon 
                        className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsPopoverVisible(!isPopoverVisible);
                        }}
                      />
                      {isPopoverVisible && (
                        <div className="absolute left-full top-0 ml-2 w-64 p-2 text-xs bg-gray-800 text-white rounded-md shadow-lg whitespace-pre-line">
                          {placeholderText}
                          <div className="absolute -left-1 top-2 w-2 h-2 bg-gray-800 rotate-45" />
                        </div>
                      )}
                    </div>
                  </div>
                  <textarea
                    className="w-full h-40 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                    placeholder={placeholderText}
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
          </div>
        </aside>

        <main className="ml-[448px] flex-1 p-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
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
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;