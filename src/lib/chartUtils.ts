export const COLORS = [
    "#4F46E5", // Indigo
    "#EC4899", // Pink
    "#22C55E", // Green
    "#F59E0B", // Amber
    "#3B82F6", // Blue
    "#EF4444", // Red
    "#10B981", // Emerald
    "#A855F7", // Purple
    "#EAB308", // Yellow
    "#14B8A6"  // Teal
  ];
  
  export const assignColorsToCategories = (grouped: Record<string, number>) => {
    const categories = Object.keys(grouped);
  
    return categories.map((category, index) => ({
      name: category,
      value: grouped[category],
      color: COLORS[index % COLORS.length]
    }));
  };
  