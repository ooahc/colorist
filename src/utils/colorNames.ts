export const getColorName = (color: string): string => {
  try {
    const tempDiv = document.createElement('div');
    tempDiv.style.color = color;
    document.body.appendChild(tempDiv);
    const computedColor = window.getComputedStyle(tempDiv).color;
    document.body.removeChild(tempDiv);

    const namedColors = new Option().style;
    namedColors.color = color;
    if (namedColors.color) {
      return color.toLowerCase();
    }

    return computedColor;
  } catch (error) {
    return color;
  }
}; 