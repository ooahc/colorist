type ColorMode = 'HSL' | 'RGB' | 'HEX';

export const parseColorValue = (value: string, mode: ColorMode): string => {
  const cleanValue = value.trim();
  
  switch (mode) {
    case 'HSL':
      const hslMatch = cleanValue.match(/^hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)$/);
      if (hslMatch) {
        const [_, h, s, l] = hslMatch;
        return `hsl(${h}, ${s}%, ${l}%)`;
      }
      break;
      
    case 'RGB':
      const rgbMatch = cleanValue.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
      if (rgbMatch) {
        const [_, r, g, b] = rgbMatch;
        return `rgb(${r}, ${g}, ${b})`;
      }
      break;
      
    case 'HEX':
      const hexMatch = cleanValue.match(/^#?([A-Fa-f0-9]{6})$/);
      if (hexMatch) {
        return `#${hexMatch[1].toUpperCase()}`;
      }
      break;
  }
  
  return cleanValue;
};