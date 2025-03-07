import { useState, useEffect } from 'react';
import { Minus, Maximize2, X, Palette, InfoIcon } from 'lucide-react';
import { ColorCard } from './components/ColorCard';
import { Controls } from './components/Controls';
import { getColorName } from './utils/colorNames';
import { ResizeHandle } from './components/ResizeHandle';
import { MonacoEditor } from './components/MonacoEditor';
import { ResizableEditor } from './components/ResizableEditor';

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
  const [colorMode, setColorMode] = useState<'none' | 'hsl' | 'rgb' | 'hex'>('none');
  const [asideWidth, setAsideWidth] = useState(420);

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
    const convertedColor = colorMode !== 'none' ? convertColor(newColor, colorMode) : newColor;
    
    if (colors.length === 0) {
      setColors([...defaultColors]);
      setTimeout(() => {
        const updatedColors = [...defaultColors];
        updatedColors[index] = {
          ...updatedColors[index],
          value: convertedColor
        };
        setColors(updatedColors);
      }, 0);
      return;
    }

    const updatedColors = [...colors];
    updatedColors[index] = {
      ...updatedColors[index],
      value: convertedColor
    };
    setColors(updatedColors);

    if (colorList) {
      const lines = colorList.split('\n');
      if (lines[index]) {
        const formatMatch = lines[index].match(/title=(.*?);color=/);
        if (formatMatch) {
          lines[index] = `title=${formatMatch[1]};color=${convertedColor}`;
        } else {
          lines[index] = convertedColor;
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
    const handleClickOutside = () => {
      if (isPopoverVisible) {
        setIsPopoverVisible(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isPopoverVisible]);

  const convertColor = (color: string, targetMode: 'hsl' | 'rgb' | 'hex'): string => {
    // 创建临时元素来标准化颜色
    const temp = document.createElement('div');
    temp.style.color = color;
    document.body.appendChild(temp);
    const computedColor = window.getComputedStyle(temp).color;
    document.body.removeChild(temp);

    // 解析 RGB 值
    const [r, g, b] = computedColor.match(/\d+/g)!.map(Number);

    switch (targetMode) {
      case 'rgb':
        return `rgb(${r},${g},${b})`;
      case 'hex':
        return `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`;
      case 'hsl':
        // RGB 转 HSL
        const r1 = r / 255;
        const g1 = g / 255;
        const b1 = b / 255;
        const max = Math.max(r1, g1, b1);
        const min = Math.min(r1, g1, b1);
        let h = 0, s = 0, l = (max + min) / 2;

        if (max !== min) {
          const d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          switch (max) {
            case r1: h = (g1 - b1) / d + (g1 < b1 ? 6 : 0); break;
            case g1: h = (b1 - r1) / d + 2; break;
            case b1: h = (r1 - g1) / d + 4; break;
          }
          h *= 60;
        }
        return `hsl(${Math.round(h)},${Math.round(s * 100)}%,${Math.round(l * 100)}%)`;
      default:
        return color;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Palette className="h-8 w-8" />
            <h1 className="text-xl font-semibold">
              疯狂的调色盘
              <span className="ml-2 font-normal text-[hsl(0,0%,60%)] font-logo">· by Oahc</span>
            </h1>
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
        <aside 
          className="sticky top-[72px] min-w-[420px] max-w-[600px] w-[30vw] h-[calc(100vh-72px)] overflow-y-auto p-6"
          style={{ width: asideWidth }}
        >
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">显示设置</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-4 mb-2">
                    <div className="flex items-center gap-2">
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
                    
                    <div className="flex items-center gap-2">
                      <label className="block text-sm font-medium text-gray-700">
                        颜色模式
                      </label>
                      <select
                        className="block w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                        value={colorMode}
                        onChange={(e) => {
                          const newMode = e.target.value as 'none' | 'hsl' | 'rgb' | 'hex';
                          setColorMode(newMode);
                          if (newMode !== 'none' && colors.length > 0) {
                            const updatedColors = colors.map(color => ({
                              ...color,
                              value: convertColor(color.value, newMode)
                            }));
                            setColors(updatedColors);
                            setColorList(updatedColors.map(color => {
                              if (color.name === color.value) {
                                return color.value;
                              }
                              return `title=${color.name};color=${color.value}`;
                            }).join('\n'));
                          }
                        }}
                      >
                        <option value="none">未选择</option>
                        <option value="hsl">HSL</option>
                        <option value="rgb">RGB</option>
                        <option value="hex">HEX</option>
                      </select>
                    </div>
                  </div>
                  <ResizableEditor
                    value={colorList}
                    onChange={handleColorListChange}
                    placeholder={placeholderText}
                    minHeight={160}
                    maxHeight={600}
                    defaultHeight={160}
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
          <ResizeHandle onResize={setAsideWidth} />
        </aside>

        <main className="flex-1 p-6">
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
