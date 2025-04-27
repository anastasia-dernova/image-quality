// // src/app/page.tsx
// 'use client';

// import { useState } from 'react';
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Checkbox } from '@/components/ui/checkbox';
// import { useEvaluation } from '@/contexts/EvaluationContext';
// import { requestDirectoryAccess } from '@/utils/folderUtils';

// export default function Home() {
//   const { 
//     folderStructure, 
//     setRootFolder, 
//     toggleFolderSelection, 
//     marks, 
//     addMark, 
//     startEvaluation 
//   } = useEvaluation();
  
//   const [newMark, setNewMark] = useState('');
//   const [manualPath, setManualPath] = useState('');

//   // Handle folder selection via File System Access API
//   const handleFolderSelect = async () => {
//     const structure = await requestDirectoryAccess();
//     if (structure) {
//       setRootFolder(structure.root);
//     }
//   };

//   // Handle manual path entry
//   const handleManualPathSubmit = () => {
//     if (manualPath.trim()) {
//       setRootFolder(manualPath.trim());
//     }
//   };

//   // Handle adding a new mark
//   const handleAddMark = () => {
//     addMark(newMark);
//     setNewMark('');
//   };

//   return (
//     <div className="space-y-6">
//       {/* Folder Selection Section */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Step 1: Select Root Folder</CardTitle>
//           <CardDescription>
//             Choose the root folder containing your image folders structure
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="flex flex-col space-y-4">
//             <Button onClick={handleFolderSelect}>
//               Select Folder
//             </Button>
//             <div className="text-sm text-gray-500">Or enter path manually:</div>
//             <div className="flex space-x-2">
//               <Input
//                 value={manualPath}
//                 onChange={(e) => setManualPath(e.target.value)}
//                 placeholder="/path/to/your/root/folder"
//               />
//               <Button variant="outline" onClick={handleManualPathSubmit}>
//                 Set Path
//               </Button>
//             </div>
            
//             {folderStructure.root && (
//               <div className="mt-4">
//                 <div className="text-sm font-medium">Selected folder: {folderStructure.root}</div>
//               </div>
//             )}
//           </div>
//         </CardContent>
//       </Card>

//       {/* Folder Selection */}
//       {folderStructure.root && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Step 2: Select Folders to Compare</CardTitle>
//             <CardDescription>
//               Select which folders you want to include in the comparison
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               <div>
//                 <h3 className="text-md font-medium mb-2">Necessary Folders:</h3>
//                 <div className="space-y-2">
//                   <div className="flex items-center space-x-2">
//                     <Checkbox 
//                       id="originals" 
//                       checked={folderStructure.necessaryFolders.originals}
//                       onCheckedChange={() => toggleFolderSelection('originals')}
//                     />
//                     <label htmlFor="originals" className="text-sm font-medium">
//                       originals {folderStructure.necessaryFolders.originals ? '(Found)' : '(Not Found)'}
//                     </label>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <Checkbox 
//                       id="target" 
//                       checked={folderStructure.necessaryFolders.target}
//                       onCheckedChange={() => toggleFolderSelection('target')}
//                     />
//                     <label htmlFor="target" className="text-sm font-medium">
//                       target {folderStructure.necessaryFolders.target ? '(Found)' : '(Not Found)'}
//                     </label>
//                   </div>
//                 </div>
//               </div>

//               {Object.keys(folderStructure.optionalFolders).length > 0 && (
//                 <div>
//                   <h3 className="text-md font-medium mb-2">Optional Folders:</h3>
//                   <div className="space-y-2">
//                     {Object.entries(folderStructure.optionalFolders).map(([folderName, exists]) => (
//                       <div key={folderName} className="flex items-center space-x-2">
//                         <Checkbox 
//                           id={folderName} 
//                           checked={folderStructure.selectedFolders.includes(folderName)}
//                           onCheckedChange={() => toggleFolderSelection(folderName)}
//                         />
//                         <label htmlFor={folderName} className="text-sm font-medium">
//                           {folderName}
//                         </label>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* Marks Creation */}
//       {folderStructure.root && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Step 3: Define Quality Marks</CardTitle>
//             <CardDescription>
//               Add marks that will be used to evaluate image tuples
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               <div className="flex space-x-2">
//                 <Input
//                   value={newMark}
//                   onChange={(e) => setNewMark(e.target.value)}
//                   placeholder="Enter quality mark (e.g., Good, Bad, Excellent)"
//                 />
//                 <Button onClick={handleAddMark}>Add Mark</Button>
//               </div>

//               {marks.length > 0 && (
//                 <div className="mt-4">
//                   <h3 className="text-md font-medium mb-2">Defined Marks:</h3>
//                   <div className="flex flex-wrap gap-2">
//                     {marks.map((mark) => (
//                       <div 
//                         key={mark.id} 
//                         className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
//                       >
//                         {mark.label}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </CardContent>
//           <CardFooter className="flex justify-end">
//             <Button 
//               onClick={startEvaluation}
//               disabled={
//                 folderStructure.selectedFolders.length < 2 || 
//                 marks.length === 0 ||
//                 !(folderStructure.necessaryFolders.originals && folderStructure.necessaryFolders.target)
//               }
//             >
//               Start Evaluation
//             </Button>
//           </CardFooter>
//         </Card>
//       )}
//     </div>
//   );
// }

// src/app/page.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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