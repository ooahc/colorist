export const getColorName = (color: string): string => {
  try {
    // 创建一个隐藏的 canvas 元素
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    
    // 先尝试直接获取颜色名称
    const tempDiv = document.createElement('div');
    tempDiv.style.color = color;
    document.body.appendChild(tempDiv);
    const computedColor = window.getComputedStyle(tempDiv).color;
    document.body.removeChild(tempDiv);

    // 检查是否是命名颜色
    const namedColors = new Option().style;
    namedColors.color = color;
    if (namedColors.color) {
      return color.toLowerCase(); // 如果是命名颜色，直接返回
    }

    return computedColor;
  } catch (error) {
    return color; // 如果出错，返回原始颜色值
  }
}; 