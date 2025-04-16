// src/utils/statisticsUtils.ts
import { EvaluationResult, Mark, EvaluationStats } from '@/types';

// Function to generate chart data for recharts
export const generateChartData = (stats: EvaluationStats, marks: Mark[]) => {
  return Object.entries(stats.markDistribution).map(([markId, count]) => {
    const mark = marks.find(m => m.id === markId);
    return {
      name: mark?.label || 'Unknown',
      value: count,
    };
  });
};

// Function to calculate percentage
export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

// Function to generate random colors for chart (for demo purposes)
export const generateChartColors = (count: number): string[] => {
  const colors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
    '#FF9F40', '#2ECC71', '#E74C3C', '#3498DB', '#F39C12'
  ];
  
  // If we need more colors than available, generate random ones
  if (count > colors.length) {
    for (let i = colors.length; i < count; i++) {
      const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
      colors.push(randomColor);
    }
  }
  
  return colors.slice(0, count);
};

// Function to generate a summary of the evaluation
export const generateEvaluationSummary = (
  stats: EvaluationStats,
  marks: Mark[]
): { text: string, distribution: string[] } => {
  const percentEvaluated = calculatePercentage(stats.evaluated, stats.total);
  
  const text = `Evaluation Complete: ${stats.evaluated}/${stats.total} tuples (${percentEvaluated}%)`;
  
  const distribution = Object.entries(stats.markDistribution).map(([markId, count]) => {
    const mark = marks.find(m => m.id === markId);
    const percent = calculatePercentage(count, stats.evaluated);
    return `${mark?.label || 'Unknown'}: ${count} (${percent}%)`;
  });
  
  return { text, distribution };
};