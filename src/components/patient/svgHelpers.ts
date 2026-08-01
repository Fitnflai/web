// src/components/patient/svgHelpers.ts

// Wellness Ring Constants and Helpers
export const WELLNESS_RING_RADIUS = 37;
export const WELLNESS_RING_CIRCUMFERENCE = 2 * Math.PI * WELLNESS_RING_RADIUS; // ~232.48

/**
 * Calculates the strokeDashoffset for the wellness ring based on a given score.
 * @param score The wellness score (0-100).
 * @returns The strokeDashoffset value.
 */
export const getWellnessRingStrokeDashoffset = (score: number): number => {
  const normalizedScore = Math.max(0, Math.min(100, score)); // Ensure score is between 0 and 100
  return WELLNESS_RING_CIRCUMFERENCE - (normalizedScore / 100) * WELLNESS_RING_CIRCUMFERENCE;
};

// Line Chart Constants (can be passed as parameters for more flexibility)
// Default bounding box dimensions and padding as per design
export const LINE_CHART_WIDTH = 500;
export const LINE_CHART_HEIGHT = 120;
export const LINE_CHART_PADDING_X = 30;
export const LINE_CHART_PADDING_Y = 20;

/**
 * Calculates the X-coordinate for a point in a line chart.
 * Assumes equally spaced points across the width.
 * @param index The index of the data point.
 * @param totalPoints The total number of data points.
 * @param chartWidth The total width of the SVG viewBox.
 * @param paddingX Horizontal padding.
 * @returns The X-coordinate.
 */
export const getLineChartX = (
  index: number,
  totalPoints: number,
  chartWidth: number = LINE_CHART_WIDTH,
  paddingX: number = LINE_CHART_PADDING_X
): number => {
  if (totalPoints <= 1) {
    return chartWidth / 2; // Center if only one point
  }
  return paddingX + (index / (totalPoints - 1)) * (chartWidth - 2 * paddingX);
};

/**
 * Calculates the Y-coordinate for a point in a line chart.
 * SVG Y-axis is inverted (0 at top).
 * @param value The actual data value.
 * @param minValue The minimum value in the dataset.
 * @param maxValue The maximum value in the dataset.
 * @param chartHeight The total height of the SVG viewBox.
 * @param paddingY Vertical padding.
 * @returns The Y-coordinate.
 */
export const getLineChartY = (
  value: number,
  minValue: number,
  maxValue: number,
  chartHeight: number = LINE_CHART_HEIGHT,
  paddingY: number = LINE_CHART_PADDING_Y
): number => {
  // Handle case where min and max are the same to avoid division by zero
  const range = maxValue - minValue;
  if (range === 0) {
    return (chartHeight - paddingY) / 2; // Vertically center if all values are the same
  }
  // Invert Y-axis: higher values mean lower Y-coordinate in SVG
  return (chartHeight - paddingY) - ((value - minValue) / range) * (chartHeight - 2 * paddingY);
};
