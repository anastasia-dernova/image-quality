'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { useEvaluation } from '@/contexts/EvaluationContext';
import { Trash2 } from 'lucide-react';
import FolderSelector from '@/components/FolderSelector';

export default function HomePage() {
  const { marks, addMark, removeMark } = useEvaluation();
  const [newMarkLabel, setNewMarkLabel] = useState('');
  const [isAddMarkDialogOpen, setIsAddMarkDialogOpen] = useState(false);
  
  // Handle adding new mark
  const handleAddMark = () => {
    if (newMarkLabel.trim()) {
      addMark(newMarkLabel);
      setNewMarkLabel('');
      setIsAddMarkDialogOpen(false);
    }
  };
  
  // Handle mark removal
  const handleRemoveMark = (id: string) => {
    removeMark(id);
  };
  
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Image Quality Evaluator</h1>
        <p className="text-gray-500">Compare images across different processing methods and evaluate their quality</p>
      </div>
      
      {/* Folder Selection Section */}
      <div className="mb-8">
        <FolderSelector />
      </div>
      
      {/* Mark Management Section */}
      <Card>
        <CardHeader>
          <CardTitle>Manage Quality Marks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Define the quality marks you want to use for evaluation. You need at least one mark.
            </p>
            
            <div className="space-y-2">
              {marks.map((mark) => (
                <div key={mark.id} className="flex items-center justify-between p-2 border rounded-md">
                  <span>{mark.label}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleRemoveMark(mark.id)}
                    aria-label={`Remove ${mark.label}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            <Dialog open={isAddMarkDialogOpen} onOpenChange={setIsAddMarkDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">Add New Mark</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Quality Mark</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <Label htmlFor="mark-label">Mark Label</Label>
                  <Input 
                    id="mark-label" 
                    value={newMarkLabel} 
                    onChange={(e) => setNewMarkLabel(e.target.value)}
                    placeholder="e.g., Excellent, Good, Fair, Poor"
                    className="mt-1"
                  />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddMarkDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddMark}>
                    Add Mark
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
      
      {/* Instructions and About */}
      <Card>
        <CardHeader>
          <CardTitle>How to Use</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Select a root directory containing folders with images to compare</li>
            <li>Choose which folders to include in the comparison (at least 2)</li>
            <li>Define quality marks if needed (some default ones are provided)</li>
            <li>Start the evaluation</li>
            <li>For each image set, select the appropriate quality mark</li>
            <li>Review your results when finished</li>
          </ol>
          
          <div className="mt-4 p-3 text-sm rounded-md bg-blue-50 text-blue-600">
            <strong>Note:</strong> This application uses the File System Access API, which is supported in Chrome, Edge, and other Chromium-based browsers. It is not supported in Firefox or Safari.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}