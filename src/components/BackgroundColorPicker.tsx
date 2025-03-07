import { useState } from 'react';

interface BackgroundColorPickerProps {
  onChange: (color: string) => void;
  defaultColor?: string;
}

type ColorMode = 'rgb' | 'hsl' | 'hex';

interface RGBColor {
  r: number;
  g: number;
  b: number;
}

interface HSLColor {
  h: number;
  s: number;
  l: number;
}

export function BackgroundColorPicker({ onChange, defaultColor = '#ffffff' }: BackgroundColorPickerProps) {
  const [colorMode, setColorMode] = useState<ColorMode>('rgb');
  const [rgbColor, setRgbColor] = useState<RGBColor>({ r: 255, g: 255, b: 255 });
  const [hslColor, setHslColor] = useState<HSLColor>({ h: 0, s: 0, l: 100 });
  const [hexColor, setHexColor] = useState<string>(defaultColor);

  const handleRgbChange = (component: keyof RGBColor, value: number) => {
    const newColor = { ...rgbColor, [component]: value };
    setRgbColor(newColor);
    const hexValue = `#${newColor.r.toString(16).padStart(2, '0')}${newColor.g.toString(16).padStart(2, '0')}${newColor.b.toString(16).padStart(2, '0')}`;
    onChange(hexValue);
  };

  const handleHslChange = (component: keyof HSLColor, value: number) => {
    const newColor = { ...hslColor, [component]: value };
    setHslColor(newColor);
    onChange(`hsl(${newColor.h}, ${newColor.s}%, ${newColor.l}%)`);
  };

  const handleHexChange = (value: string) => {
    if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
      setHexColor(value);
      onChange(value);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex gap-4">
        <button
          className={`px-3 py-1 rounded ${colorMode === 'rgb' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setColorMode('rgb')}
        >
          RGB
        </button>
        <button
          className={`px-3 py-1 rounded ${colorMode === 'hsl' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setColorMode('hsl')}
        >
          HSL
        </button>
        <button
          className={`px-3 py-1 rounded ${colorMode === 'hex' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setColorMode('hex')}
        >
          HEX
        </button>
      </div>

      {colorMode === 'rgb' && (
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <label className="w-20">Red:</label>
            <input
              type="range"
              min="0"
              max="255"
              value={rgbColor.r}
              onChange={(e) => handleRgbChange('r', parseInt(e.target.value))}
              className="flex-1"
            />
            <input
              type="number"
              min="0"
              max="255"
              value={rgbColor.r}
              onChange={(e) => handleRgbChange('r', parseInt(e.target.value))}
              className="w-16 px-2 py-1 border rounded"
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-20">Green:</label>
            <input
              type="range"
              min="0"
              max="255"
              value={rgbColor.g}
              onChange={(e) => handleRgbChange('g', parseInt(e.target.value))}
              className="flex-1"
            />
            <input
              type="number"
              min="0"
              max="255"
              value={rgbColor.g}
              onChange={(e) => handleRgbChange('g', parseInt(e.target.value))}
              className="w-16 px-2 py-1 border rounded"
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-20">Blue:</label>
            <input
              type="range"
              min="0"
              max="255"
              value={rgbColor.b}
              onChange={(e) => handleRgbChange('b', parseInt(e.target.value))}
              className="flex-1"
            />
            <input
              type="number"
              min="0"
              max="255"
              value={rgbColor.b}
              onChange={(e) => handleRgbChange('b', parseInt(e.target.value))}
              className="w-16 px-2 py-1 border rounded"
            />
          </div>
        </div>
      )}

      {colorMode === 'hsl' && (
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <label className="w-20">Hue:</label>
            <input
              type="range"
              min="0"
              max="360"
              value={hslColor.h}
              onChange={(e) => handleHslChange('h', parseInt(e.target.value))}
              className="flex-1"
            />
            <input
              type="number"
              min="0"
              max="360"
              value={hslColor.h}
              onChange={(e) => handleHslChange('h', parseInt(e.target.value))}
              className="w-16 px-2 py-1 border rounded"
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-20">Saturation:</label>
            <input
              type="range"
              min="0"
              max="100"
              value={hslColor.s}
              onChange={(e) => handleHslChange('s', parseInt(e.target.value))}
              className="flex-1"
            />
            <input
              type="number"
              min="0"
              max="100"
              value={hslColor.s}
              onChange={(e) => handleHslChange('s', parseInt(e.target.value))}
              className="w-16 px-2 py-1 border rounded"
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-20">Lightness:</label>
            <input
              type="range"
              min="0"
              max="100"
              value={hslColor.l}
              onChange={(e) => handleHslChange('l', parseInt(e.target.value))}
              className="flex-1"
            />
            <input
              type="number"
              min="0"
              max="100"
              value={hslColor.l}
              onChange={(e) => handleHslChange('l', parseInt(e.target.value))}
              className="w-16 px-2 py-1 border rounded"
            />
          </div>
        </div>
      )}

      {colorMode === 'hex' && (
        <div className="flex items-center gap-4">
          <label className="w-20">Hex:</label>
          <input
            type="text"
            value={hexColor}
            onChange={(e) => handleHexChange(e.target.value)}
            placeholder="#000000"
            className="px-2 py-1 border rounded"
            pattern="^#[0-9A-Fa-f]{6}$"
          />
        </div>
      )}

      <div className="h-20 rounded" style={{ backgroundColor: colorMode === 'hsl' ? `hsl(${hslColor.h}, ${hslColor.s}%, ${hslColor.l}%)` : (colorMode === 'rgb' ? `rgb(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b})` : hexColor) }} />
    </div>
  );
} 