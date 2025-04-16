// src/app/statistics/page.tsx
'use client';

import { useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEvaluation } from '@/contexts/EvaluationContext';
import { useRouter } from 'next/navigation';
import { generateChartData, generateChartColors, calculatePercentage } from '@/utils/statisticsUtils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function StatisticsPage() {
  const { getStatistics, marks, evaluationResults, imageTuples, resetEvaluation } = useEvaluation();
  const router = useRouter();
  
  // Get statistics
  const stats = getStatistics();
  
  // Calculate completion percentage
  const completionPercentage = calculatePercentage(stats.evaluated, stats.total);
  
  // Generate chart data
  const chartData = generateChartData(stats, marks);
  
  // Generate chart colors
  const chartColors = generateChartColors(marks.length);
  
  // Handle start new evaluation
  const handleNewEvaluation = () => {
    resetEvaluation();
  };
  
  // Check if we have results, if not redirect to home
  useEffect(() => {
    if (evaluationResults.length === 0 || imageTuples.length === 0) {
      router.push('/');
    }
  }, [evaluationResults, imageTuples, router]);
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Evaluation Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="text-xl font-medium mb-2">Completion Rate</h3>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold">{completionPercentage}%</div>
              <div className="text-sm text-gray-500">({stats.evaluated}/{stats.total} tuples evaluated)</div>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-medium mb-4">Mark Distribution</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} tuples`, 'Count']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-xl font-medium mb-2">Mark Details</h3>
            <div className="space-y-2">
              {marks.map((mark) => {
                const count = stats.markDistribution[mark.id] || 0;
                const percentage = calculatePercentage(count, stats.evaluated);
                
                return (
                  <div key={mark.id} className="flex justify-between items-center p-2 border-b">
                    <div className="flex items-center">
                      <div 
                        className="w-4 h-4 mr-2 rounded-full" 
                        style={{ backgroundColor: chartColors[marks.indexOf(mark) % chartColors.length] }}
                      ></div>
                      <span>{mark.label}</span>
                    </div>
                    <div className="text-sm">
                      {count} tuples ({percentage}%)
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleNewEvaluation}>
            Start New Evaluation
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}